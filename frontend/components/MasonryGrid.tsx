export interface MediaCard {
  id: string;
  url: string;
  caption?: string;
  mediaType?: "image" | "video";
}

export const MasonryGrid = ({ items }: { items: MediaCard[] }) => (
  <section className="masonry-grid">
    {items.map((item) => (
      <article key={item.id} className="masonry-card">
        {item.mediaType === "video" ? (
          <video controls preload="metadata" src={item.url} />
        ) : (
          <img loading="lazy" src={item.url} alt={item.caption ?? "photo"} />
        )}
        {item.caption && <p>{item.caption}</p>}
      </article>
    ))}
  </section>
);
