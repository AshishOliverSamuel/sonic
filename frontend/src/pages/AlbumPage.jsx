import { useQuery } from '@tanstack/react-query';
import { Play } from 'lucide-react';
import { useParams } from 'react-router-dom';
import SongRow from '../components/music/SongRow.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { getAlbum } from '../api/music.js';
import { usePlayerStore } from '../store/playerStore.js';

export default function AlbumPage() {
  const { id } = useParams();
  const playQueue = usePlayerStore((state) => state.playQueue);

  const albumQuery = useQuery({
    queryKey: ['album', id],
    queryFn: () => getAlbum(id),
  });

  const album = albumQuery.data;
  const songs = album?.songs || [];

  if (albumQuery.isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-6 rounded-md bg-gradient-to-b from-[#38515f] to-sonic-main p-5 sm:flex-row sm:items-end md:p-8">
        <img
          src={album?.imageUrl || '/images/song-placeholder.jpeg'}
          alt={album?.name}
          className="aspect-square w-40 rounded-md object-cover shadow-2xl md:w-56"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">Album</p>
          <h1 className="line-clamp-2 mt-2 text-4xl font-extrabold tracking-normal text-white md:text-6xl">{album?.name}</h1>
          <p className="mt-4 text-sm text-sonic-muted">
            {album?.artistName} {album?.year ? `- ${album.year}` : ''} {songs.length ? `- ${songs.length} songs` : ''}
          </p>
        </div>
      </section>

      <section>
        <button
          type="button"
          onClick={() => playQueue(songs, 0)}
          disabled={songs.length === 0}
          className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-sonic-green text-black shadow-glow transition hover:scale-105 disabled:opacity-40"
          aria-label="Play album"
        >
          <Play className="ml-0.5 h-7 w-7 fill-current" />
        </button>

        {songs.length > 0 ? (
          <div className="space-y-1">
            {songs.map((song, index) => (
              <SongRow key={song.id} song={song} index={index} songs={songs} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-sonic-muted">No tracks found for this album.</p>
        )}
      </section>
    </div>
  );
}

