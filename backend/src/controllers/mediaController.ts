import { v4 as uuid } from "uuid";
import type { Request, Response } from "express";
import { z } from "zod";
import { buildPublicMediaUrl, generateUploadSas } from "../services/storageService.js";
import { analyzeImage, detectFaces, extractSearchTerms } from "../services/aiService.js";
import { getMediaById, listMediaByUser, semanticSearch, upsertMedia } from "../services/cosmosService.js";
import { assignFacesToPeople } from "../services/peopleService.js";
import type { MediaItem } from "../types/models.js";
import { buildAutoAlbums, buildMemories } from "../services/albumService.js";

const uploadRequestSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
  mediaType: z.enum(["image", "video"]),
  capturedAt: z.string().optional(),
  location: z
    .object({
      lat: z.number(),
      lon: z.number(),
      label: z.string().optional()
    })
    .optional()
});

export const requestUpload = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"]?.toString() ?? "demo-user";
  const payload = uploadRequestSchema.parse(req.body);
  const blobName = `${userId}/${Date.now()}-${payload.filename}`;
  const sas = generateUploadSas(blobName, payload.contentType);

  const mediaId = uuid();
  const pendingRecord: MediaItem = {
    id: mediaId,
    userId,
    blobName,
    mediaType: payload.mediaType,
    createdAt: new Date().toISOString(),
    capturedAt: payload.capturedAt,
    location: payload.location,
    tags: [],
    faces: []
  };
  await upsertMedia(pendingRecord);

  res.json({
    mediaId,
    blobName,
    uploadUrl: sas.blobUrl,
    expiresOn: sas.expiresOn
  });
};

const finalizeUploadSchema = z.object({ mediaId: z.string() });

export const finalizeUpload = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"]?.toString() ?? "demo-user";
  const { mediaId } = finalizeUploadSchema.parse(req.body);
  const media = await getMediaById(userId, mediaId);
  if (!media) return res.status(404).json({ message: "Media not found" });

  const mediaUrl = buildPublicMediaUrl(media.blobName);

  if (media.mediaType === "image") {
    const [vision, faces] = await Promise.all([analyzeImage(mediaUrl), detectFaces(mediaUrl)]);
    const assignments = await assignFacesToPeople(
      userId,
      faces.map((x) => x.faceId)
    );

    media.tags = Array.from(new Set([...(media.tags ?? []), ...vision.tags]));
    media.aiCaption = vision.caption;
    media.aiScore = vision.score;
    media.faces = faces.map((face) => ({
      faceId: face.faceId,
      personId: assignments[face.faceId],
      confidence: 0.8,
      boundingBox: face.rectangle
    }));
  }

  if (media.mediaType === "video") {
    media.streamUrl = `${mediaUrl}`;
    media.previewClipUrl = `${mediaUrl}#t=0,8`;
    media.tags = Array.from(new Set([...(media.tags ?? []), "video"]));
  }

  await upsertMedia(media);

  res.json({ media });
};

export const searchMedia = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"]?.toString() ?? "demo-user";
  const query = req.query.q?.toString() ?? "";
  const terms = extractSearchTerms(query);
  const results = await semanticSearch(userId, terms);
  res.json({ query, terms, count: results.length, results });
};

export const listTimeline = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"]?.toString() ?? "demo-user";
  const all = await listMediaByUser(userId);
  res.json({ items: all });
};

export const listAlbums = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"]?.toString() ?? "demo-user";
  const all = await listMediaByUser(userId);
  const albums = buildAutoAlbums(userId, all);
  res.json({ albums });
};

export const listMemories = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"]?.toString() ?? "demo-user";
  const all = await listMediaByUser(userId);
  const memories = buildMemories(all);
  res.json({ items: memories });
};
