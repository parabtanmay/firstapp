from __future__ import annotations

import json
import random
import re
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import urlparse

BASE_DIR = Path(__file__).parent

CONTRACTIONS = {
    "do not": "don't",
    "does not": "doesn't",
    "did not": "didn't",
    "is not": "isn't",
    "are not": "aren't",
    "was not": "wasn't",
    "were not": "weren't",
    "cannot": "can't",
    "can not": "can't",
    "will not": "won't",
    "would not": "wouldn't",
    "should not": "shouldn't",
    "could not": "couldn't",
    "it is": "it's",
    "there is": "there's",
    "that is": "that's",
    "i am": "I'm",
    "you are": "you're",
    "we are": "we're",
    "they are": "they're",
}

SOFTENERS = [
    "In my view,",
    "From a practical standpoint,",
    "One thing worth noting is that",
    "In everyday use,",
]


def apply_contractions(text: str) -> str:
    output = text
    for phrase, contraction in CONTRACTIONS.items():
        output = re.sub(rf"\b{re.escape(phrase)}\b", contraction, output, flags=re.IGNORECASE)
    return output


def vary_sentence_starts(text: str) -> str:
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    if len(sentences) < 2:
        return text

    improved: list[str] = []
    for idx, sentence in enumerate(sentences):
        if idx % 3 == 1 and len(sentence) > 20:
            sentence = f"{random.choice(SOFTENERS)} {sentence[0].lower() + sentence[1:]}"
        improved.append(sentence)

    return " ".join(improved)


def humanize_text(text: str) -> str:
    cleaned = re.sub(r"\s+", " ", text).strip()
    if not cleaned:
        return ""

    rewritten = apply_contractions(cleaned)
    rewritten = vary_sentence_starts(rewritten)

    if not rewritten.endswith((".", "!", "?")):
        rewritten += "."

    return rewritten


class AppHandler(BaseHTTPRequestHandler):
    def _send_text(self, content: str, content_type: str = "text/html", status: int = 200) -> None:
        payload = content.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", f"{content_type}; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def _send_json(self, data: dict, status: int = 200) -> None:
        self._send_text(json.dumps(data), "application/json", status)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/":
            html = (BASE_DIR / "templates" / "index.html").read_text(encoding="utf-8")
            self._send_text(html)
            return

        if parsed.path == "/static/style.css":
            css = (BASE_DIR / "static" / "style.css").read_text(encoding="utf-8")
            self._send_text(css, "text/css")
            return

        self._send_text("Not Found", "text/plain", 404)

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path != "/humanize":
            self._send_text("Not Found", "text/plain", 404)
            return

        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length).decode("utf-8") if length else "{}"

        try:
            payload = json.loads(raw)
        except json.JSONDecodeError:
            self._send_json({"error": "Invalid JSON body."}, 400)
            return

        text = str(payload.get("text", "")).strip()
        if not text:
            self._send_json({"error": "Please enter text to humanize."}, 400)
            return

        self._send_json(
            {
                "humanized_text": humanize_text(text),
                "note": "Use this as a draft and add your own examples to keep it authentic.",
            }
        )


if __name__ == "__main__":
    server = HTTPServer(("127.0.0.1", 5000), AppHandler)
    print("Server running at http://127.0.0.1:5000")
    server.serve_forever()
