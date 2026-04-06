import "../styles/globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <h1>Azure Smart Photos</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/albums">Albums</a>
            <a href="/people">People</a>
            <a href="/search">Search</a>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
