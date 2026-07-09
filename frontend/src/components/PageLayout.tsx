import { Outlet } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import ScrollTop from './ScrollTop';
import StickyCTA from './StickyCTA';
import '../styles/global-ui.css';

export default function PageLayout() {
  return (
    <>
      <a href="#content" className="skip-link">Skip to content</a>
      <Nav />
      <main
        id="content"
        role="main"
        style={{ flex: 1, paddingTop: 'var(--nav-h)' }}
      >
        <Outlet />
      </main>
      <Footer />
      <ScrollTop />
      <StickyCTA />
    </>
  );
}
