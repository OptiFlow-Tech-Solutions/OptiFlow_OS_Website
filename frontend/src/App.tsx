import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageLayout } from './components';
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter basename="/os">
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
