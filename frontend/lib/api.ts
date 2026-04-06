const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";

export const getTimeline = async () => {
  const response = await fetch(`${apiBase}/media/timeline`, { cache: "no-store" });
  return (await response.json()) as { items: Array<Record<string, unknown>> };
};

export const getAlbums = async () => {
  const response = await fetch(`${apiBase}/media/albums`, { cache: "no-store" });
  return (await response.json()) as { albums: Array<Record<string, unknown>> };
};

export const searchMedia = async (q: string) => {
  const response = await fetch(`${apiBase}/media/search?q=${encodeURIComponent(q)}`, { cache: "no-store" });
  return response.json();
};

export const getPeople = async () => {
  const response = await fetch(`${apiBase}/people`, { cache: "no-store" });
  return response.json();
};

export const getMemories = async () => {
  const response = await fetch(`${apiBase}/media/memories`, { cache: "no-store" });
  return response.json();
};
