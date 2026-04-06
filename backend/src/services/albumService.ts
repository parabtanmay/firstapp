import dayjs from "dayjs";
import type { Album, MediaItem } from "../types/models.js";
import { v4 as uuid } from "uuid";

const hoursBetween = (a: string, b: string) => Math.abs(dayjs(a).diff(dayjs(b), "hour"));

export const buildAutoAlbums = (userId: string, mediaItems: MediaItem[]): Album[] => {
  const sorted = [...mediaItems].sort((a, b) => (a.capturedAt ?? a.createdAt).localeCompare(b.capturedAt ?? b.createdAt));
  const albums: Album[] = [];

  let currentEvent: MediaItem[] = [];
  for (const item of sorted) {
    const previous = currentEvent[currentEvent.length - 1];
    if (!previous) {
      currentEvent.push(item);
      continue;
    }

    const previousDate = previous.capturedAt ?? previous.createdAt;
    const currentDate = item.capturedAt ?? item.createdAt;
    const sameLocation = previous.location?.label && item.location?.label && previous.location.label === item.location.label;

    if (hoursBetween(previousDate, currentDate) <= 6 || sameLocation) {
      currentEvent.push(item);
    } else {
      if (currentEvent.length > 2) albums.push(eventAlbum(userId, currentEvent));
      currentEvent = [item];
    }
  }

  if (currentEvent.length > 2) albums.push(eventAlbum(userId, currentEvent));

  const tripCandidates = sorted.filter((item) => item.tags.includes("outdoor") || item.tags.includes("travel"));
  if (tripCandidates.length > 4) albums.push(tripAlbum(userId, tripCandidates));

  return albums;
};

const eventAlbum = (userId: string, items: MediaItem[]): Album => ({
  id: uuid(),
  userId,
  type: "event",
  title: `Event - ${dayjs(items[0].capturedAt ?? items[0].createdAt).format("MMM D, YYYY")}`,
  mediaIds: items.map((x) => x.id),
  dynamic: true,
  coverMediaId: items[0]?.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const tripAlbum = (userId: string, items: MediaItem[]): Album => ({
  id: uuid(),
  userId,
  type: "trip",
  title: "Trips",
  mediaIds: items.map((x) => x.id),
  dynamic: true,
  coverMediaId: items[0]?.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export const buildMemories = (mediaItems: MediaItem[]) => {
  const today = dayjs();
  return mediaItems.filter((item) => {
    const date = dayjs(item.capturedAt ?? item.createdAt);
    return date.date() === today.date() && date.month() === today.month() && date.year() < today.year();
  });
};
