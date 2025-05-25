import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import HistoryList from './pages/HistoryList';
import HistoryDetail from './pages/HistoryDetail';
import SearchResults from './pages/SearchResults';
import { auth } from './firebase';

console.log('Firebase Auth loaded:', auth);

function App() {
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
