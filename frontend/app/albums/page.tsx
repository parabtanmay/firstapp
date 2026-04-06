import { getAlbums } from "../../lib/api";

export default async function AlbumsPage() {
  const { albums } = await getAlbums();

  return (
    <section>
      <h2>Auto Albums</h2>
      <ul>
        {albums.map((album: any) => (
          <li key={album.id}>
            <strong>{album.title}</strong> · {album.type} · {album.mediaIds.length} items
          </li>
        ))}
      </ul>
    </section>
  );
}
