import type { Request, Response } from "express";
import { z } from "zod";
import { listPeopleByUser } from "../services/cosmosService.js";
import { renamePerson } from "../services/peopleService.js";

export const listPeople = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"]?.toString() ?? "demo-user";
  const people = await listPeopleByUser(userId);
  res.json({ people });
};

const renameSchema = z.object({ displayName: z.string().min(1) });

export const renamePersonHandler = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"]?.toString() ?? "demo-user";
  const personId = req.params.personId;
  const { displayName } = renameSchema.parse(req.body);
  const person = await renamePerson(userId, personId, displayName);
  res.json({ person });
};
