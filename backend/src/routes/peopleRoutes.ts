import { Router } from "express";
import { listPeople, renamePersonHandler } from "../controllers/peopleController.js";

const router = Router();

router.get("/", listPeople);
router.patch("/:personId", renamePersonHandler);

export default router;
