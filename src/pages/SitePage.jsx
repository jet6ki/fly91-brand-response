/**
 * SitePage — the redesigned Fly91 homepage.
 *
 * Assembles all the feature components (booking widget, live flight tracker,
 * Telentir support, testimonials). Demonstrates the full React + Express +
 * MongoDB data flow: forms post to the API, the tracker pulls live data,
 * testimonials persist through moderation.
 */

import Nav from '../components/layout/Nav.jsx';
import Footer from '../components/layout/Footer.jsx';
import BookingWidget from '../components/booking/BookingWidget.jsx';
import FlightTracker from '../components/tracker/FlightTracker.jsx';
import TelentirWidget from '../components/telentir/TelentirWidget.jsx';
import TestimonialsSection from '../components/testimonials/TestimonialsSection.jsx';
import './SitePage.css';

export default function SitePage() {
  return (
    <div className="site">
      {/* Top bar */}
      <div className="topbar">
        <div className="wrap topbar-inner">
          <div className="topbar-left">
            <span>📞 0832 669 6091</span>
            <span>💬 WhatsApp Support</span>
          </div>
          <div className="topbar-right">
            <a href="#">Partner Login</a>
            <a href="#">Help</a>
            <a href="#">हिन्दी</a>
          </div>
        </div>
      </div>

      <Nav />

      {/* Hero */}
      <section className="site-hero">
        <div className="wrap">
          <div className="hero-header">
            <span className="hero-badge">
              <span className="dot" />
              11 Indian cities · 7 ATR aircraft · Built for regional India
            </span>
            <h1>Fly into India's <span>skipped cities,</span><br />properly.</h1>
            <p className="hero-sub">Goa to Sindhudurg in 80 minutes. Hyderabad to Vijayawada on time. Bengaluru to Lakshadweep direct. Regional flights, built around regional India.</p>
          </div>
          <BookingWidget />
        </div>
      </section>

      {/* Live flight tracker */}
      <FlightTracker />

      {/* What we are */}
      <section className="what-we-are">
        <div className="wrap wwa-grid">
          <div>
            <div className="section-eyebrow">About Fly91</div>
            <h2>We fly where <span>bigger jets don't.</span></h2>
            <p>Fly91 started in Goa in 2024 with one idea — that India's tier-2 and tier-3 cities deserve honest, direct flights to the big ones. No changeovers. No 14-hour drives. Just a short hop on an ATR 72-600, on a timetable built for how people actually travel.</p>
            <p>We're small on purpose. Smaller planes fit the smaller airports that bigger carriers won't touch. Sindhudurg. Agatti. Jalgaon. These are the routes that matter, and we run them properly.</p>

            <div className="wwa-stats">
              <div className="wwa-stat"><span className="num">11</span><span className="label">Cities flown</span></div>
              <div className="wwa-stat"><span className="num">7<small>×</small></span><span className="label">ATR 72-600</span></div>
              <div className="wwa-stat"><span className="num">120<small>+</small></span><span className="label">Flights / week</span></div>
            </div>
          </div>
          <div className="wwa-visual">
            <video autoPlay muted loop playsInline className="wwa-video">
              <source src="/media/atr-wing-clouds.mp4" type="video/mp4" />
            </video>
            <div className="wwa-visual-badge">
              <div className="wwa-visual-badge-icon">🛡️</div>
              <div>
                <h5>UDAN Partner · DGCA-certified</h5>
                <p>Part of India's Regional Connectivity Scheme</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TelentirWidget />

      {/* Why Fly91 */}
      <section className="why">
        <div className="wrap">
          <div className="section-eyebrow">Why Fly91</div>
          <h2>Built for <span>regional India,</span><br />run like it matters.</h2>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">🗺</div>
              <h3>Routes no one else flies.</h3>
              <p>Sindhudurg. Agatti. Jalgaon. Solapur. Rajahmundry. The India bigger jets skip — because the smaller town is usually home.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">✈</div>
              <h3>ATR 72-600. Built for hops.</h3>
              <p>The same aircraft trusted across regional Europe, Japan, and Scandinavia. Short runways, quick turns, lower fuel burn on 2-hour routes.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">📞</div>
              <h3>We call. You don't hold.</h3>
              <p>When something changes — delay, gate, weather — our AI voice support calls you. No hold music. No escalation ladder.</p>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <Footer />
    </div>
  );
}
