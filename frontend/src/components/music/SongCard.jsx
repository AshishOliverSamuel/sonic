import { Play } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore.js';

export default function SongCard({ song }) {
  const playSong = usePlayerStore((state) => state.playSong);

  return (
    <button
      type="button"
      onClick={() => playSong(song)}
      className="group flex h-full min-w-0 flex-col rounded-md bg-sonic-secondary p-3 text-left transition hover:bg-sonic-elevated"
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-sonic-elevated">
        <img src={song.imageUrl} alt={song.name} className="h-full w-full object-cover transition group-hover:scale-105" />
        <span className="absolute bottom-3 right-3 grid h-11 w-11 translate-y-2 place-items-center rounded-full bg-sonic-green text-black opacity-0 shadow-glow transition group-hover:translate-y-0 group-hover:opacity-100">
          <Play className="ml-0.5 h-5 w-5 fill-current" />
        </span>
      </div>
      <p className="line-clamp-1 mt-3 text-sm font-semibold text-white">{song.name}</p>
      <p className="line-clamp-1 mt-1 text-xs text-sonic-muted">{song.artistName}</p>
    </button>
  );
}

