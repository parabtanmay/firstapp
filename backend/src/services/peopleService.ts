import { v4 as uuid } from "uuid";
import { listPeopleByUser, upsertPerson } from "./cosmosService.js";
import type { Person } from "../types/models.js";

export const assignFacesToPeople = async (userId: string, faceIds: string[]) => {
  const people = await listPeopleByUser(userId);
  const assignments: Record<string, string> = {};

  for (const faceId of faceIds) {
    const existing = people.find((person) => person.faceIds.includes(faceId));
    if (existing) {
      assignments[faceId] = existing.id;
      continue;
    }

    const person: Person = {
      id: uuid(),
      userId,
      faceIds: [faceId],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await upsertPerson(person);
    assignments[faceId] = person.id;
  }

  return assignments;
};

export const renamePerson = async (userId: string, personId: string, displayName: string) => {
  const people = await listPeopleByUser(userId);
  const person = people.find((x) => x.id === personId);
  if (!person) throw new Error("Person not found");
  person.displayName = displayName;
  person.updatedAt = new Date().toISOString();
  await upsertPerson(person);
  return person;
};
