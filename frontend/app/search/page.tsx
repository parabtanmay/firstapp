import { searchMedia } from "../../lib/api";
import { MasonryGrid } from "../../components/MasonryGrid";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = (await searchParams).q ?? "beach photos";
  const { results, terms } = await searchMedia(q);

  const cards = (results ?? []).map((item: any) => ({
    id: item.id,
    url: item.streamUrl ?? item.thumbnailBlobName ?? item.blobName,
    caption: `${item.aiCaption ?? ""} (${(item.tags ?? []).join(", ")})`,
    mediaType: item.mediaType
  }));

  return (
    <section>
      <h2>Semantic Search</h2>
      <p>
        Query: <strong>{q}</strong> · Terms: {(terms ?? []).join(", ")}
      </p>
      <MasonryGrid items={cards} />
    </section>
  );
}
