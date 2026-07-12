import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { PageLayout, PageLoader, ErrorBoundary } from './components';
import routes from './routes';

export default function App() {
  return (
    <BrowserRouter basename="/os">
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<PageLayout />}>
              {routes.map(({ path, component: Page }) => (
                <Route key={path} path={path} element={<Page />} />
              ))}
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
