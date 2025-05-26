import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import HistoryList from './pages/HistoryList';
import HistoryDetail from './pages/HistoryDetail';
import SearchResults from './pages/SearchResults';
import { useEffect } from 'react';
import { auth } from './firebase';
import { api } from './api/axios';
import type { GenerationRequest } from '../../server/src/types';

console.log('Firebase Auth loaded:', auth);

// type OfflineEntry = {
//   prompt: string;
//   code: string;
//   type: 'comment' | 'test' | 'analysis';
//   model: string;
//   module: string;
//   functionName: string;
//   user?: string;
// };

type OfflineEntry = GenerationRequest;

function App() {
  const QUEUE_KEY = 'offline-logs';

function flushQueueIfOnline() {
  const queue: OfflineEntry[] = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  if (queue.length === 0) return;

  Promise.all(
    queue.map((entry:OfflineEntry) =>
      api.post('/generate', { ...entry, offline: true }).catch(console.error)
    )
  ).then(() => {
    console.log(`✅ Synced ${queue.length} offline logs`);
    localStorage.removeItem(QUEUE_KEY);
  });
}

useEffect(() => {
  if (navigator.onLine) {
    flushQueueIfOnline();
  }

  window.addEventListener('online', flushQueueIfOnline);
  return () => window.removeEventListener('online', flushQueueIfOnline);
}, []);
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<HistoryList />} />
        <Route path="/history/entry/:id" element={<HistoryDetail />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </Layout>
  );
}

export default App;
