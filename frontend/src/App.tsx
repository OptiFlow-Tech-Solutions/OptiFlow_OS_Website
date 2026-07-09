import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { PageLayout, PageLoader } from './components';
import routes from './routes';

export default function App() {
  return (
    <BrowserRouter basename="/os">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PageLayout />}>
            {routes.map(({ path, component: Page }) => (
              <Route key={path} path={path} element={<Page />} />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
