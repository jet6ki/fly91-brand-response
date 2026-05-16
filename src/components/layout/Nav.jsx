import { Link, NavLink } from 'react-router-dom';
import './Nav.css';

const navItems = [
  { to: '/site', label: 'Book' },
  { to: '/site#tracker', label: 'Flight Status', hash: '#tracker' },
  { to: '/deck', label: 'Pitch Deck' },
  { to: '/flashcards', label: 'Flashcards' },
  { to: '/pr', label: 'PR Strategy' },
  { to: '/admin', label: 'Admin' },
];

export default function Nav({ variant = 'default' }) {
  return (
    <nav className={`main-nav main-nav--${variant}`}>
      <div className="wrap nav-inner">
        <Link to="/" className="logo">
          <span className="logo-fly">FLY</span>
          <span className="logo-91">91</span>
          <span className="logo-dot" />
        </Link>
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.to + (item.hash || '')}>
              <NavLink
                to={item.to}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
