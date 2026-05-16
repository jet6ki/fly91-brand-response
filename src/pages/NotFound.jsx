import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      textAlign: 'center',
      background: 'linear-gradient(135deg, var(--teal-pale), white)',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--orange)', letterSpacing: '0.15em', marginBottom: 20 }}>404 · OFF COURSE</div>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 300, color: 'var(--teal-dark)', marginBottom: 16, letterSpacing: '-0.03em' }}>
        We've diverted.<br /><em style={{ color: 'var(--teal)' }}>You're not where you meant to be.</em>
      </h1>
      <p style={{ fontSize: 17, color: 'var(--ink-muted)', maxWidth: '50ch', marginBottom: 32 }}>
        The page you tried to land on doesn't exist. Captain's discretion — let's head back to the cover.
      </p>
      <Link to="/" className="btn btn-primary">Back to the cover →</Link>
    </div>
  );
}
