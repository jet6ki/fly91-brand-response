import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Link to="/" className="logo">
            <span className="logo-fly" style={{ color: 'white' }}>FLY</span>
            <span className="logo-91" style={{ color: 'var(--yellow)' }}>91</span>
            <span className="logo-dot" />
          </Link>
          <p>Connecting the India that other airlines skip. Goa-based, proudly regional, built around a simple idea: explain everything.</p>
        </div>
        <div className="footer-col">
          <h5>Book</h5>
          <ul>
            <li><Link to="/site">Flights</Link></li>
            <li><Link to="/site">Manage Trip</Link></li>
            <li><Link to="/site">Web Check-in</Link></li>
            <li><Link to="/site">Route Alerts</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Support</h5>
          <ul>
            <li><Link to="/site">Request a Call</Link></li>
            <li><Link to="/site">WhatsApp</Link></li>
            <li><Link to="/site">FAQ</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Project</h5>
          <ul>
            <li><Link to="/pr">PR Strategy</Link></li>
            <li><Link to="/deck">Pitch Deck</Link></li>
            <li><Link to="/flashcards">Flashcards</Link></li>
            <li><Link to="/admin">Admin</Link></li>
          </ul>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <div>© 2026 · A Kalvium Simulated Work project by Mohammed Thameem · LPU 12406194</div>
      </div>
    </footer>
  );
}
