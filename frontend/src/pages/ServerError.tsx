import { Link } from 'react-router-dom';
import { SEOHead } from '../components';
import Button from '../components/Button';

export default function ServerError() {
  return (
    <>
      <SEOHead title="Server Error — OptiFlow OS" description="We are experiencing a temporary technical issue. Our team has been notified and is working to resolve it." />
      <main id="content" role="main">
        <section className="error-section">
          <div className="container">
            <div className="error-card reveal">
              <div className="error-code">500</div>
              <h1>Something Went Wrong</h1>
              <p className="lead">
                We're experiencing a technical issue on our end. Our team has been notified and is working to resolve it. Please try again shortly.
              </p>
              <div className="error-actions">
                <Button variant="primary" size="lg" glow as={Link} to="/">Go to Homepage</Button>
                <Button variant="secondary" size="lg" as={Link} to="/contact">Contact Support</Button>
              </div>
              <div className="error-contact reveal">
                <h3>Need immediate assistance?</h3>
                <p>Email: <a href="mailto:info@optiflow.co.in">info@optiflow.co.in</a></p>
                <p>Phone: <a href="tel:+917874677836">+91 7874677836</a></p>
                <p style={{ marginTop: 8, fontSize: 13 }}>We respond within one business day.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
