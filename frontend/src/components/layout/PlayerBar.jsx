import { Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { formatTime } from '../../api/music.js';
import { usePlayerStore } from '../../store/playerStore.js';

export default function PlayerBar() {
  const audioRef = useRef(null);
  const {
    currentSong,
    isPlaying,
    volume,
    progress,
    duration,
    togglePlay,
    next,
    prev,
    setVolume,
    setProgress,
    setDuration,
    setPlaying,
  } = usePlayerStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) {
      return;
    }

    if (!currentSong.audioUrl) {
      window.dispatchEvent(new CustomEvent('sonic:error', { detail: 'This song does not have a playable audio URL.' }));
      setPlaying(false);
      return;
    }

    if (audio.src !== currentSong.audioUrl) {
      audio.src = currentSong.audioUrl;
      audio.currentTime = 0;
    }

    if (isPlaying) {
      audio.play().catch(() => {
        setPlaying(false);
        window.dispatchEvent(new CustomEvent('sonic:error', { detail: 'Unable to start playback for this song.' }));
      });
    }
  }, [currentSong, isPlaying, setPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) {
      return;
    }

    if (isPlaying) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong, setPlaying]);

  const handleSeek = (event) => {
    const nextProgress = Number(event.target.value);
    setProgress(nextProgress);
    if (audioRef.current) {
      audioRef.current.currentTime = nextProgress;
    }
  };

  const resolvedDuration = duration || currentSong?.duration || 0;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 h-[90px] border-t border-sonic-border bg-sonic-player px-3 text-white md:px-5">
      <audio
        ref={audioRef}
        className="hidden"
        onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={next}
      />

      <div className="grid h-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:grid-cols-[minmax(180px,1fr)_minmax(320px,2fr)_minmax(160px,1fr)]">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={currentSong?.imageUrl || '/images/song-placeholder.jpeg'}
            alt={currentSong?.name || 'Song artwork'}
            className="h-[50px] w-[50px] shrink-0 rounded-md object-cover"
          />
          <div className="min-w-0">
            <p className="line-clamp-1 text-sm font-semibold text-white">{currentSong?.name || 'Select a song'}</p>
            <p className="line-clamp-1 text-xs text-sonic-muted">{currentSong?.artistName || 'Sonic player'}</p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous"
              onClick={prev}
              disabled={!currentSong}
              className="rounded-full p-2 text-sonic-muted transition hover:text-white disabled:opacity-40"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={togglePlay}
              disabled={!currentSong}
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-black transition hover:scale-105 disabled:opacity-40"
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="ml-0.5 h-5 w-5 fill-current" />}
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={next}
              disabled={!currentSong}
              className="rounded-full p-2 text-sonic-muted transition hover:text-white disabled:opacity-40"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>

          <div className="hidden w-full max-w-xl items-center gap-3 md:flex">
            <span className="w-10 text-right text-xs text-sonic-muted">{formatTime(progress)}</span>
            <input
              aria-label="Playback progress"
              type="range"
              min="0"
              max={resolvedDuration || 0}
              value={Math.min(progress, resolvedDuration || 0)}
              onChange={handleSeek}
              disabled={!currentSong}
              className="h-1 flex-1 cursor-pointer"
            />
            <span className="w-10 text-xs text-sonic-muted">{formatTime(resolvedDuration)}</span>
          </div>
        </div>

        <div className="hidden items-center justify-end gap-3 md:flex">
          <Volume2 className="h-5 w-5 text-sonic-muted" />
          <input
            aria-label="Volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) => setVolume(event.target.value)}
            className="h-1 w-28 cursor-pointer"
          />
        </div>
      </div>
    </footer>
  );
}

