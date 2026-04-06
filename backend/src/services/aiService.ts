import { env } from "../config/env.js";

export interface VisionAnalysisResult {
  tags: string[];
  caption?: string;
  score?: number;
}

export interface DetectedFace {
  faceId: string;
  rectangle?: number[];
}

const headers = {
  "Content-Type": "application/json"
};

export const analyzeImage = async (imageUrl: string): Promise<VisionAnalysisResult> => {
  const response = await fetch(`${env.AZURE_VISION_ENDPOINT}/computervision/imageanalysis:analyze?api-version=2024-02-01&features=tags,caption`, {
    method: "POST",
    headers: {
      ...headers,
      "Ocp-Apim-Subscription-Key": env.AZURE_VISION_KEY
    },
    body: JSON.stringify({ url: imageUrl })
  });

  if (!response.ok) {
    throw new Error(`Vision API failed with status ${response.status}`);
  }

  const json = (await response.json()) as {
    tagsResult?: { values?: { name: string }[] };
    captionResult?: { text?: string; confidence?: number };
  };

  return {
    tags: json.tagsResult?.values?.map((tag) => tag.name) ?? [],
    caption: json.captionResult?.text,
    score: json.captionResult?.confidence
  };
};

export const detectFaces = async (imageUrl: string): Promise<DetectedFace[]> => {
  const response = await fetch(`${env.AZURE_FACE_ENDPOINT}/face/v1.0/detect?returnFaceId=true&recognitionModel=recognition_04`, {
    method: "POST",
    headers: {
      ...headers,
      "Ocp-Apim-Subscription-Key": env.AZURE_FACE_KEY
    },
    body: JSON.stringify({ url: imageUrl })
  });

  if (!response.ok) {
    throw new Error(`Face API failed with status ${response.status}`);
  }

  const json = (await response.json()) as { faceId: string; faceRectangle?: Record<string, number> }[];
  return json.map((face) => ({
    faceId: face.faceId,
    rectangle: face.faceRectangle ? Object.values(face.faceRectangle) : undefined
  }));
};

export const extractSearchTerms = (query: string) => {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !["show", "me", "photos", "images", "with", "of"].includes(word));
};
