import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar.jsx';
import PlayerBar from './components/layout/PlayerBar.jsx';
import ErrorToasts from './components/ui/ErrorToasts.jsx';
import AlbumPage from './pages/AlbumPage.jsx';
import ArtistPage from './pages/ArtistPage.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-sonic-main text-white">
      <Sidebar />
      <main className="min-h-screen pb-[178px] md:pb-[114px] md:pl-60">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 md:px-8 md:py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/artist/:id" element={<ArtistPage />} />
            <Route path="/album/:id" element={<AlbumPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
      <PlayerBar />
      <ErrorToasts />
    </div>
  );
}

