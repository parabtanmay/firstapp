import { CosmosClient, type Container } from "@azure/cosmos";
import { env } from "../config/env.js";
import type { MediaItem, Person } from "../types/models.js";

const cosmosClient = new CosmosClient({ endpoint: env.AZURE_COSMOS_ENDPOINT, key: env.AZURE_COSMOS_KEY });

let mediaContainer: Container;
let peopleContainer: Container;

export const initCosmos = async () => {
  const { database } = await cosmosClient.databases.createIfNotExists({ id: env.AZURE_COSMOS_DB_NAME });
  const media = await database.containers.createIfNotExists({
    id: env.AZURE_COSMOS_CONTAINER_MEDIA,
    partitionKey: { paths: ["/userId"] }
  });
  const people = await database.containers.createIfNotExists({
    id: env.AZURE_COSMOS_CONTAINER_PEOPLE,
    partitionKey: { paths: ["/userId"] }
  });
  mediaContainer = media.container;
  peopleContainer = people.container;
};

export const upsertMedia = async (item: MediaItem) => mediaContainer.items.upsert(item);

export const listMediaByUser = async (userId: string) => {
  const query = await mediaContainer.items
    .query<MediaItem>({ query: "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.createdAt DESC", parameters: [{ name: "@userId", value: userId }] })
    .fetchAll();
  return query.resources;
};

export const semanticSearch = async (userId: string, terms: string[]) => {
  const normalized = terms.map((t) => t.toLowerCase());
  const allMedia = await listMediaByUser(userId);

  return allMedia
    .map((item) => {
      const tagHits = item.tags.reduce((score, tag) => (normalized.some((term) => tag.toLowerCase().includes(term)) ? score + 2 : score), 0);
      const caption = item.aiCaption?.toLowerCase() ?? "";
      const captionHits = normalized.reduce((sum, term) => (caption.includes(term) ? sum + 1 : sum), 0);
      const relevance = tagHits + captionHits;
      return { ...item, relevance };
    })
    .filter((item) => item.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance);
};

export const getMediaById = async (userId: string, id: string) => {
  const { resource } = await mediaContainer.item(id, userId).read<MediaItem>();
  return resource ?? null;
};

export const listPeopleByUser = async (userId: string) => {
  const query = await peopleContainer.items
    .query<Person>({ query: "SELECT * FROM c WHERE c.userId = @userId", parameters: [{ name: "@userId", value: userId }] })
    .fetchAll();
  return query.resources;
};

export const upsertPerson = async (person: Person) => peopleContainer.items.upsert(person);
