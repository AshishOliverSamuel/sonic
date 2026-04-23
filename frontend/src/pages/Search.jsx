import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AlbumCard from '../components/music/AlbumCard.jsx';
import ArtistCard from '../components/music/ArtistCard.jsx';
import SongCard from '../components/music/SongCard.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { searchAlbums, searchArtists, searchSongs } from '../api/music.js';

const tabs = ['Songs', 'Albums', 'Artists'];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(urlQuery);
  const [activeTab, setActiveTab] = useState('Songs');

  useEffect(() => {
    setQuery(urlQuery);
    setDebouncedQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const trimmed = query.trim();
      setDebouncedQuery(trimmed);
      setSearchParams(trimmed ? { q: trimmed } : {}, { replace: true });
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [query, setSearchParams]);

  const enabled = debouncedQuery.length > 0;

  const songsQuery = useQuery({
    queryKey: ['search-songs', debouncedQuery],
    queryFn: () => searchSongs(debouncedQuery),
    enabled,
  });

  const albumsQuery = useQuery({
    queryKey: ['search-albums', debouncedQuery],
    queryFn: () => searchAlbums(debouncedQuery),
    enabled,
  });

  const artistsQuery = useQuery({
    queryKey: ['search-artists', debouncedQuery],
    queryFn: () => searchArtists(debouncedQuery),
    enabled,
  });

  const activeQuery = useMemo(() => {
    if (activeTab === 'Albums') return albumsQuery;
    if (activeTab === 'Artists') return artistsQuery;
    return songsQuery;
  }, [activeTab, albumsQuery, artistsQuery, songsQuery]);

  return (
    <div className="space-y-7">
      <div className="sticky top-0 z-20 -mx-4 bg-sonic-main/95 px-4 pb-4 pt-1 backdrop-blur md:static md:mx-0 md:bg-transparent md:px-0 md:pb-0 md:pt-0">
        <label className="relative block max-w-2xl">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="What do you want to listen to?"
            className="h-12 w-full rounded-full border border-transparent bg-white pl-12 pr-5 text-sm font-medium text-black outline-none transition focus:border-sonic-green"
          />
        </label>
      </div>

      {!enabled ? (
        <section className="pt-10">
          <h1 className="text-3xl font-extrabold tracking-normal">Search Sonic</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-sonic-muted">Find songs, albums, and artists from JioSaavn.</p>
        </section>
      ) : (
        <>
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab ? 'bg-white text-black' : 'bg-sonic-elevated text-white hover:bg-neutral-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeQuery.isLoading || activeQuery.isFetching ? (
            <ResultSkeleton />
          ) : (
            <SearchResults activeTab={activeTab} results={activeQuery.data || []} />
          )}
        </>
      )}
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton key={index} className="aspect-[0.82]" />
      ))}
    </div>
  );
}

function SearchResults({ activeTab, results }) {
  if (results.length === 0) {
    return <p className="py-12 text-sm text-sonic-muted">No results found.</p>;
  }

  if (activeTab === 'Artists') {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {results.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    );
  }

  if (activeTab === 'Albums') {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {results.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
      {results.map((song) => (
        <SongCard key={song.id} song={song} />
      ))}
    </div>
  );
}

