import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import routes from '../routes';

interface MetaHeadProps {
  title?: string;
  description?: string;
}

function MetaHeadInner({ title, description }: MetaHeadProps) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  useEffect(() => {
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }
  }, [description]);

  return null;
}

export default function MetaHead({ title, description }: MetaHeadProps) {
  const { pathname } = useLocation();
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  const route = routes.find((r) => r.path === normalizedPath || (r.path === '*' && !routes.some((x) => x.path === normalizedPath)));

  const resolvedTitle = title || route?.title;
  const resolvedDescription = description || route?.description;

  return <MetaHeadInner title={resolvedTitle} description={resolvedDescription} />;
}
