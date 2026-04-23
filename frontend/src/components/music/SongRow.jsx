import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatTime } from '../../api/music.js';
import { usePlayerStore } from '../../store/playerStore.js';

export default function SongRow({ song, index = 0, songs = [] }) {
  const playSong = usePlayerStore((state) => state.playSong);
  const playQueue = usePlayerStore((state) => state.playQueue);

  const handlePlay = () => {
    if (songs.length > 0) {
      playQueue(songs, index);
      return;
    }

    playSong(song);
  };

  return (
    <div className="group grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-md px-2 py-2 transition hover:bg-white/5 md:grid-cols-[44px_minmax(0,1fr)_minmax(140px,0.45fr)_64px]">
      <button
        type="button"
        aria-label={`Play ${song.name}`}
        onClick={handlePlay}
        className="grid h-9 w-9 place-items-center rounded-full text-sonic-muted transition hover:bg-sonic-green hover:text-black"
      >
        <span className="text-sm group-hover:hidden">{index + 1}</span>
        <Play className="hidden h-4 w-4 fill-current group-hover:block" />
      </button>

      <div className="flex min-w-0 items-center gap-3">
        <img src={song.imageUrl} alt={song.name} className="h-11 w-11 rounded-md object-cover" />
        <div className="min-w-0">
          <p className="line-clamp-1 text-sm font-medium text-white">{song.name}</p>
          <p className="line-clamp-1 text-xs text-sonic-muted">{song.artistName}</p>
        </div>
      </div>

      <div className="hidden min-w-0 md:block">
        {song.album?.id ? (
          <Link to={`/album/${song.album.id}`} className="line-clamp-1 text-sm text-sonic-muted hover:text-white">
            {song.album.name}
          </Link>
        ) : (
          <span className="line-clamp-1 text-sm text-sonic-muted">{song.album?.name || '-'}</span>
        )}
      </div>

      <span className="text-right text-xs text-sonic-muted">{formatTime(song.duration)}</span>
    </div>
  );
}

