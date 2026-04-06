export type MediaType = "image" | "video";

export interface FaceMatch {
  faceId: string;
  confidence: number;
  personId?: string;
  boundingBox?: number[];
}

export interface MediaItem {
  id: string;
  userId: string;
  blobName: string;
  thumbnailBlobName?: string;
  mediaType: MediaType;
  createdAt: string;
  capturedAt?: string;
  location?: {
    lat: number;
    lon: number;
    label?: string;
  };
  tags: string[];
  aiCaption?: string;
  aiScore?: number;
  faces: FaceMatch[];
  streamUrl?: string;
  previewClipUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface Person {
  id: string;
  userId: string;
  displayName?: string;
  faceIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Album {
  id: string;
  userId: string;
  type: "trip" | "event" | "people" | "manual";
  title: string;
  mediaIds: string[];
  dynamic: boolean;
  coverMediaId?: string;
  createdAt: string;
  updatedAt: string;
}
