import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  AZURE_STORAGE_CONNECTION_STRING: z.string(),
  AZURE_STORAGE_CONTAINER_MEDIA: z.string().default("media"),
  AZURE_STORAGE_CONTAINER_THUMBNAILS: z.string().default("thumbnails"),
  AZURE_COSMOS_ENDPOINT: z.string(),
  AZURE_COSMOS_KEY: z.string(),
  AZURE_COSMOS_DB_NAME: z.string().default("smartphotos"),
  AZURE_COSMOS_CONTAINER_MEDIA: z.string().default("mediaItems"),
  AZURE_COSMOS_CONTAINER_PEOPLE: z.string().default("people"),
  AZURE_VISION_ENDPOINT: z.string(),
  AZURE_VISION_KEY: z.string(),
  AZURE_FACE_ENDPOINT: z.string(),
  AZURE_FACE_KEY: z.string(),
  AZURE_SAS_TTL_MINUTES: z.coerce.number().default(30),
  AZURE_CDN_BASE_URL: z.string().optional()
});

export const env = envSchema.parse(process.env);
