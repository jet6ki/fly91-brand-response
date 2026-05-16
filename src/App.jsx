import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import SitePage from './pages/SitePage.jsx';
import DeckPage from './pages/DeckPage.jsx';
import FlashcardsPage from './pages/FlashcardsPage.jsx';
import PRPage from './pages/PRPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/site" element={<SitePage />} />
      <Route path="/deck" element={<DeckPage />} />
      <Route path="/flashcards" element={<FlashcardsPage />} />
      <Route path="/pr" element={<PRPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
