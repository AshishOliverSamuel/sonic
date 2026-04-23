import { Link } from 'react-router-dom';

export default function AlbumCard({ album }) {
  return (
    <Link to={`/album/${album.id}`} className="group rounded-md bg-sonic-secondary p-3 transition hover:bg-sonic-elevated">
      <img
        src={album.imageUrl}
        alt={album.name}
        className="aspect-square w-full rounded-md object-cover shadow-xl transition group-hover:scale-[1.02]"
      />
      <p className="line-clamp-1 mt-3 text-sm font-semibold text-white">{album.name}</p>
      <p className="line-clamp-1 mt-1 text-xs text-sonic-muted">{album.artistName || album.year || 'Album'}</p>
    </Link>
  );
}

