import { MasonryGrid } from "../components/MasonryGrid";
import { getMemories, getTimeline } from "../lib/api";

export default async function HomePage() {
  const [timeline, memories] = await Promise.all([getTimeline(), getMemories()]);

  const cards = timeline.items.map((item: any) => ({
    id: item.id,
    url: item.streamUrl ?? item.thumbnailBlobName ?? item.blobName,
    caption: item.aiCaption,
    mediaType: item.mediaType
  }));

  return (
    <div>
      <h2>Timeline</h2>
      <p>AI-powered stream of your photos and videos with lazy loading and masonry layout.</p>
      <MasonryGrid items={cards} />

      <h2>Memories</h2>
      <p>{memories.items?.length ?? 0} memories from this day in previous years.</p>
    </div>
  );
}
