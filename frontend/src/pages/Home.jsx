import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import AlbumCard from '../components/music/AlbumCard.jsx';
import ArtistCard from '../components/music/ArtistCard.jsx';
import SongCard from '../components/music/SongCard.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { getTrending, searchAlbums, searchArtists } from '../api/music.js';

const quickPicks = [
  { title: 'Top Hits', image: '/images/card-top-hits.jpeg', query: 'top hits' },
  { title: 'New Releases', image: '/images/card-new-releases.jpeg', query: 'new hindi songs' },
  { title: 'Discover', image: '/images/card-discover.jpeg', query: 'discover' },
  { title: 'Radio', image: '/images/card-radio.jpeg', query: 'radio hits' },
  { title: 'Podcasts', image: '/images/card-podcasts.jpeg', query: 'podcast' },
];

const popularArtistNames = ['Arijit Singh', 'AR Rahman', 'The Weeknd', 'Taylor Swift', 'Diljit Dosanjh', 'Shreya Ghoshal'];

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const trendingQuery = useQuery({
    queryKey: ['trending'],
    queryFn: getTrending,
  });

  const artistsQuery = useQuery({
    queryKey: ['popular-artists'],
    queryFn: async () => {
      const artists = await Promise.all(
        popularArtistNames.map(async (name) => {
          const result = await searchArtists(name);
          return result[0];
        }),
      );
      return artists.filter(Boolean);
    },
  });

  const albumsQuery = useQuery({
    queryKey: ['home-albums'],
    queryFn: () => searchAlbums('new hindi releases'),
  });

  return (
    <div className="space-y-9">
      <section>
        <h1 className="text-3xl font-extrabold tracking-normal text-white md:text-4xl">{greeting()}</h1>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickPicks.map((pick) => (
            <Link
              key={pick.title}
              to={`/search?q=${encodeURIComponent(pick.query)}`}
              className="group flex h-20 overflow-hidden rounded-md bg-sonic-secondary transition hover:bg-sonic-elevated"
            >
              <img src={pick.image} alt={pick.title} className="h-20 w-20 shrink-0 object-cover" />
              <span className="flex min-w-0 items-center px-4 text-sm font-bold text-white md:text-base">{pick.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-normal">Trending Now</h2>
          <Link to="/search?q=trending hindi 2024" className="text-sm font-semibold text-sonic-muted hover:text-white">
            See more
          </Link>
        </div>

        {trendingQuery.isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="aspect-[0.82]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {trendingQuery.data?.slice(0, 6).map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold tracking-normal">Popular Artists</h2>
        {artistsQuery.isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square rounded-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {artistsQuery.data?.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold tracking-normal">New Albums</h2>
        {albumsQuery.isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="aspect-[0.82]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {albumsQuery.data?.slice(0, 6).map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

