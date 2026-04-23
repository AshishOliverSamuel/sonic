import { Link } from 'react-router-dom';

export default function ArtistCard({ artist }) {
  return (
    <Link
      to={`/artist/${artist.id}`}
      className="group rounded-md bg-sonic-secondary p-4 text-center transition hover:bg-sonic-elevated"
    >
      <img
        src={artist.imageUrl}
        alt={artist.name}
        className="mx-auto aspect-square w-full max-w-[180px] rounded-full object-cover shadow-xl transition group-hover:scale-[1.03]"
      />
      <p className="line-clamp-1 mt-4 text-sm font-semibold text-white">{artist.name}</p>
      <p className="mt-1 text-xs text-sonic-muted">Artist</p>
    </Link>
  );
}

