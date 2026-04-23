import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import AlbumCard from '../components/music/AlbumCard.jsx';
import SongRow from '../components/music/SongRow.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { getArtist, getArtistAlbums, getArtistSongs } from '../api/music.js';

export default function ArtistPage() {
  const { id } = useParams();

  const artistQuery = useQuery({
    queryKey: ['artist', id],
    queryFn: () => getArtist(id),
  });

  const songsQuery = useQuery({
    queryKey: ['artist-songs', id],
    queryFn: () => getArtistSongs(id),
  });

  const albumsQuery = useQuery({
    queryKey: ['artist-albums', id],
    queryFn: () => getArtistAlbums(id),
  });

  const artist = artistQuery.data;
  const songs = songsQuery.data?.length ? songsQuery.data : artist?.topSongs || [];
  const albums = albumsQuery.data?.length ? albumsQuery.data : artist?.topAlbums || [];

  if (artistQuery.isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-9">
      <section className="flex flex-col gap-6 rounded-md bg-gradient-to-b from-[#27452f] to-sonic-main p-5 sm:flex-row sm:items-end md:p-8">
        <img
          src={artist?.imageUrl || '/images/song-placeholder.jpeg'}
          alt={artist?.name}
          className="h-36 w-36 rounded-full object-cover shadow-2xl md:h-48 md:w-48"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">Artist</p>
          <h1 className="line-clamp-2 mt-2 text-4xl font-extrabold tracking-normal text-white md:text-6xl">{artist?.name}</h1>
          <p className="mt-4 text-sm text-sonic-muted">{songs.length} popular songs</p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-bold tracking-normal">Popular Songs</h2>
        {songsQuery.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {songs.slice(0, 12).map((song, index) => (
              <SongRow key={song.id} song={song} index={index} songs={songs} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold tracking-normal">Albums</h2>
        {albumsQuery.isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="aspect-[0.82]" />
            ))}
          </div>
        ) : albums.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {albums.slice(0, 12).map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-sonic-muted">No albums found.</p>
        )}
      </section>
    </div>
  );
}

