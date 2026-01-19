import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { SearchPage } from './pages/SearchPage';
import { UploadPage } from './pages/UploadPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-background text-zinc-100 selection:bg-primary/30">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;