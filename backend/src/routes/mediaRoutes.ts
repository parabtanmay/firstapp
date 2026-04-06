import { Router } from "express";
import {
  finalizeUpload,
  listAlbums,
  listMemories,
  listTimeline,
  requestUpload,
  searchMedia
} from "../controllers/mediaController.js";

const router = Router();

router.post("/upload/request", requestUpload);
router.post("/upload/finalize", finalizeUpload);
router.get("/timeline", listTimeline);
router.get("/search", searchMedia);
router.get("/albums", listAlbums);
router.get("/memories", listMemories);

export default router;
