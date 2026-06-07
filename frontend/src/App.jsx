import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import EditorPage from './pages/EditorPage';
import PreviewPage from './pages/PreviewPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All pages share the Navbar + Footer via Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/preview" element={<PreviewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
