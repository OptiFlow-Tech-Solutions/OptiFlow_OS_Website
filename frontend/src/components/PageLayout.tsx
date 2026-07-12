import { Outlet } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import ScrollTop from './ScrollTop';
import ScrollRestoration from './ScrollRestoration';
import StickyCTA from './StickyCTA';
import MetaHead from './MetaHead';
import Breadcrumb from './Breadcrumb';
import '../styles/global-ui.css';

export default function PageLayout() {
  return (
    <>
      <MetaHead />
      <a href="#content" className="skip-link">Skip to content</a>
      <Nav />
      <main
        id="content"
        role="main"
        style={{ flex: 1, paddingTop: 'var(--nav-h)' }}
      >
        <Breadcrumb />
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
      <ScrollTop />
      <StickyCTA />
    </>
  );
}
