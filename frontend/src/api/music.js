import axios from 'axios';

const PLACEHOLDER_IMAGE = '/images/song-placeholder.jpeg';

export const musicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 30000,
});

export function cleanText(value, fallback = '') {
  if (value === null || value === undefined) {
    return fallback;
  }

  const cleaned = String(value)
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned || fallback;
}

function payloadData(payload) {
  return payload?.data ?? payload;
}

export function extractList(payload) {
  const data = payloadData(payload);

  if (Array.isArray(data)) {
    return data;
  }

  return data?.results || data?.songs || data?.topSongs || data?.topAlbums || data?.albums || [];
}

function qualityUrl(items, quality = '500x500') {
  if (!Array.isArray(items) || items.length === 0) {
    return '';
  }

  return items.find((item) => item?.quality === quality)?.url || items[items.length - 1]?.url || '';
}

export function imageUrl(item) {
  return qualityUrl(item?.image, '500x500') || item?.song_image || item?.album_image || PLACEHOLDER_IMAGE;
}

export function audioUrl(item) {
  const urls = item?.downloadUrl;
  if (Array.isArray(urls)) {
    return urls.find((entry) => entry?.quality === '320kbps')?.url || urls[urls.length - 1]?.url || '';
  }

  if (Array.isArray(item?.download_links)) {
    return item.download_links[item.download_links.length - 1] || '';
  }

  return item?.media_url || item?.audioUrl || '';
}

function namesFromArray(items) {
  return items
    .map((artist) => cleanText(artist?.name))
    .filter(Boolean)
    .join(', ');
}

export function artistName(item) {
  const direct = cleanText(item?.primaryArtists || item?.song_artist || item?.artistName || item?.artist);
  if (direct) {
    return direct;
  }

  const primary = item?.artists?.primary;
  if (Array.isArray(primary)) {
    const names = namesFromArray(primary);
    if (names) {
      return names;
    }
  }
  if (typeof primary === 'string' && cleanText(primary)) {
    return cleanText(primary);
  }

  const all = item?.artists?.all;
  if (Array.isArray(all)) {
    const names = namesFromArray(all);
    if (names) {
      return names;
    }
  }
  if (typeof all === 'string' && cleanText(all)) {
    return cleanText(all);
  }

  return 'Unknown Artist';
}

export function normalizeSong(song = {}) {
  const album = song.album || {};

  return {
    ...song,
    id: String(song.id || song.song_id || ''),
    name: cleanText(song.name || song.song_name, 'Untitled'),
    duration: Number(song.duration || song.song_duration || 0),
    imageUrl: imageUrl(song),
    audioUrl: audioUrl(song),
    artistName: artistName(song),
    album: {
      ...album,
      id: String(album.id || song.album_id || ''),
      name: cleanText(album.name || song.album_name),
    },
  };
}

export function normalizeSongList(payload) {
  return extractList(payload).map(normalizeSong).filter((song) => song.id);
}

export function normalizeAlbum(album = {}) {
  const data = payloadData(album);

  return {
    ...data,
    id: String(data?.id || data?.album_id || ''),
    name: cleanText(data?.name || data?.album_name, 'Untitled Album'),
    year: data?.year || '',
    imageUrl: imageUrl(data),
    artistName: artistName(data),
    songs: Array.isArray(data?.songs) ? data.songs.map(normalizeSong).filter((song) => song.id) : [],
  };
}

export function normalizeAlbumList(payload) {
  return extractList(payload).map(normalizeAlbum).filter((album) => album.id);
}

export function normalizeArtist(artist = {}) {
  const data = payloadData(artist);

  return {
    ...data,
    id: String(data?.id || ''),
    name: cleanText(data?.name, 'Unknown Artist'),
    imageUrl: imageUrl(data),
    topSongs: Array.isArray(data?.topSongs) ? data.topSongs.map(normalizeSong).filter((song) => song.id) : [],
    topAlbums: Array.isArray(data?.topAlbums) ? data.topAlbums.map(normalizeAlbum).filter((album) => album.id) : [],
  };
}

export function normalizeArtistList(payload) {
  return extractList(payload).map(normalizeArtist).filter((artist) => artist.id);
}

export function formatTime(value) {
  const totalSeconds = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export async function getTrending() {
  const response = await musicApi.get('/api/music/trending');
  return normalizeSongList(response.data);
}

export async function searchSongs(query) {
  const response = await musicApi.get('/api/music/search', { params: { q: query } });
  return normalizeSongList(response.data);
}

export async function searchAlbums(query) {
  const response = await musicApi.get('/api/music/search/albums', { params: { q: query } });
  return normalizeAlbumList(response.data);
}

export async function searchArtists(query) {
  const response = await musicApi.get('/api/music/search/artists', { params: { q: query } });
  return normalizeArtistList(response.data);
}

export async function getSong(id) {
  const response = await musicApi.get(`/api/music/song/${id}`);
  return normalizeSongList(response.data)[0] || null;
}

export async function getAlbum(id) {
  const response = await musicApi.get(`/api/music/album/${id}`);
  return normalizeAlbum(response.data);
}

export async function getArtist(id) {
  const response = await musicApi.get(`/api/music/artist/${id}`);
  return normalizeArtist(response.data);
}

export async function getArtistSongs(id) {
  const response = await musicApi.get(`/api/music/artist/${id}/songs`);
  return normalizeSongList(response.data);
}

export async function getArtistAlbums(id) {
  const response = await musicApi.get(`/api/music/artist/${id}/albums`);
  return normalizeAlbumList(response.data);
}

