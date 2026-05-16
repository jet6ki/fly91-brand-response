/**
 * AdminPage — the MERN admin dashboard.
 *
 * This is the heart of the MERN story for the viva: a real React UI
 * authenticating against the Express API, fetching from MongoDB,
 * and mutating data through state-managed forms.
 *
 * Three tabs:
 *   1. Callbacks — Telentir voice support queue (PATCH to mark complete)
 *   2. Testimonials moderation — approve/reject pending stories
 *   3. Recovery pipeline — track unhappy customers through the 4-step framework
 *
 * Auth is a simple bearer token (ADMIN_TOKEN env var). Token is held in
 * memory only; not persisted to localStorage to keep the demo simple
 * and avoid teaching bad practices.
 */

import { useState, useEffect, useCallback } from 'react';
import { api, withAuth } from '../api/client.js';
import './AdminPage.css';

const TABS = [
  { id: 'callbacks', label: 'Callbacks', icon: '📞' },
  { id: 'testimonials', label: 'Testimonials', icon: '✍' },
  { id: 'recovery', label: 'Recovery', icon: '♻' },
  { id: 'docs', label: 'API docs', icon: '📚' },
];

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState('callbacks');

  function tryAuth(e) {
    e.preventDefault();
    if (token.length >= 4) setAuthed(true);
  }

  if (!authed) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <h2>Fly91 Admin</h2>
          <p>Enter the admin token to manage callbacks, testimonials, and recovery cases.</p>
          <form onSubmit={tryAuth}>
            <label>
              <span>Admin token</span>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ADMIN_TOKEN env var value"
                autoFocus
              />
            </label>
            <button type="submit" className="btn btn-primary">Sign in</button>
          </form>
          <p className="login-hint">
            Set in the server's env: <code>ADMIN_TOKEN=...</code>. Sent as
            <code>Authorization: Bearer &lt;token&gt;</code> on every admin request.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-brand">
            <span className="logo-fly">FLY</span>
            <span className="logo-91">91</span>
            <span className="admin-tag">ADMIN</span>
          </div>
          <button className="signout-btn" onClick={() => { setAuthed(false); setToken(''); }}>
            Sign out
          </button>
        </div>
        <div className="admin-tabs-row">
          <div className="admin-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`admin-tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                <span className="admin-tab-icon">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="admin-main">
        {tab === 'callbacks' && <CallbacksTab token={token} />}
        {tab === 'testimonials' && <TestimonialsTab token={token} />}
        {tab === 'recovery' && <RecoveryTab token={token} />}
        {tab === 'docs' && <DocsTab />}
      </main>
    </div>
  );
}

/* ============= CALLBACKS TAB ============= */

function CallbacksTab({ token }) {
  const [callbacks, setCallbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const path = filter === 'all' ? '/callbacks' : `/callbacks?status=${filter}`;
      const res = await api.get(path, withAuth(token));
      setCallbacks(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, filter]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id, status) {
    try {
      await api.patch(`/callbacks/${id}`, { status }, withAuth(token));
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2>Callback queue</h2>
          <p>Telentir voice support requests. Mark as completed once the call is placed.</p>
        </div>
        <div className="filter-pills">
          {['pending', 'in_progress', 'completed', 'all'].map((f) => (
            <button
              key={f}
              className={`pill ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="loading-state">Loading from MongoDB…</div>}
      {error && <div className="error-state">⚠ {error}</div>}

      {!loading && !error && callbacks.length === 0 && (
        <div className="empty-state">
          <p>No callbacks in the <strong>{filter}</strong> queue.</p>
          <p className="empty-hint">Submit one from the live site at <code>/site</code> → "Request a Call" — it'll appear here in real time.</p>
        </div>
      )}

      {callbacks.length > 0 && (
        <div className="callbacks-list">
          {callbacks.map((cb) => (
            <div key={cb._id} className={`callback-card status-${cb.status}`}>
              <div className="cb-top">
                <div className="cb-meta">
                  <span className="cb-phone">{cb.countryCode} {cb.phoneNumber}</span>
                  <span className={`cb-status status-${cb.status}`}>{cb.status.replace('_', ' ')}</span>
                </div>
                <span className="cb-time">{new Date(cb.createdAt).toLocaleString('en-IN')}</span>
              </div>
              <div className="cb-body">
                <span className="cb-reason">{cb.reason.replace(/_/g, ' ')}</span>
                <span className="cb-lang">· {cb.languageName || cb.language}</span>
                {cb.flightNumber && <span className="cb-flight">· {cb.flightNumber}</span>}
              </div>
              {cb.status === 'pending' && (
                <div className="cb-actions">
                  <button onClick={() => updateStatus(cb._id, 'in_progress')} className="btn-action">Start call</button>
                  <button onClick={() => updateStatus(cb._id, 'failed')} className="btn-action danger">Mark failed</button>
                </div>
              )}
              {cb.status === 'in_progress' && (
                <div className="cb-actions">
                  <button onClick={() => updateStatus(cb._id, 'completed')} className="btn-action primary">✓ Mark completed</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============= TESTIMONIALS TAB ============= */

function TestimonialsTab({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const path = filter === 'all' ? '/testimonials/admin' : `/testimonials/admin?status=${filter}`;
      const res = await api.get(path, withAuth(token));
      setItems(res.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, filter]);

  useEffect(() => { load(); }, [load]);

  async function moderate(id, status) {
    try {
      await api.patch(`/testimonials/${id}`, { status }, withAuth(token));
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2>Testimonial moderation</h2>
          <p>Passenger-submitted stories. Approved testimonials appear publicly on the redesigned site.</p>
        </div>
        <div className="filter-pills">
          {['pending', 'approved', 'rejected', 'all'].map((f) => (
            <button key={f} className={`pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {loading && <div className="loading-state">Loading…</div>}
      {error && <div className="error-state">⚠ {error}</div>}

      {!loading && items.length === 0 && (
        <div className="empty-state">
          <p>No testimonials in the <strong>{filter}</strong> queue.</p>
          <p className="empty-hint">Submit one from the site's testimonials section to see it appear here.</p>
        </div>
      )}

      <div className="t-mod-list">
        {items.map((t) => (
          <div key={t._id} className={`t-mod-card status-${t.status}`}>
            <div className="t-mod-top">
              <div>
                <strong>{t.name}</strong>
                {t.route && <span className="t-mod-route">{t.route}</span>}
                {t.isFirstFlight && <span className="t-mod-tag">First flight</span>}
                <span className={`t-mod-status status-${t.status}`}>{t.status}</span>
              </div>
              <span className="t-mod-time">{new Date(t.createdAt).toLocaleString('en-IN')}</span>
            </div>
            <p className="t-mod-story">{t.story}</p>
            <div className="t-mod-meta">
              <span className="t-mod-rating">{'★'.repeat(t.rating || 5)}</span>
            </div>
            {t.status === 'pending' && (
              <div className="t-mod-actions">
                <button className="btn-action primary" onClick={() => moderate(t._id, 'approved')}>✓ Approve</button>
                <button className="btn-action danger" onClick={() => moderate(t._id, 'rejected')}>✗ Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============= RECOVERY TAB ============= */

function RecoveryTab({ token }) {
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [casesRes, statsRes] = await Promise.all([
        api.get('/recovery', withAuth(token)),
        api.get('/recovery/stats', withAuth(token)),
      ]);
      setCases(casesRes.data || []);
      setStats(statsRes.data || {});
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const stages = ['identified', 'reached_out', 'repair_offered', 'converted', 'lost'];

  async function advance(id, stage) {
    try {
      await api.patch(`/recovery/${id}`, { stage }, withAuth(token));
      load();
    } catch (err) { alert(err.message); }
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2>Customer recovery pipeline</h2>
          <p>Unhappy customers progressed through the four-step framework: identify → reach → repair → convert.</p>
        </div>
      </div>

      <div className="pipeline-stats">
        {stages.map((s) => (
          <div key={s} className="pipeline-stat">
            <div className="pipeline-stat-count">{stats[s] || 0}</div>
            <div className="pipeline-stat-label">{s.replace('_', ' ')}</div>
          </div>
        ))}
      </div>

      {loading && <div className="loading-state">Loading…</div>}
      {error && <div className="error-state">⚠ {error}</div>}

      {!loading && cases.length === 0 && (
        <div className="empty-state">
          <p>No recovery cases logged yet.</p>
          <p className="empty-hint">
            Cases are created via <code>POST /api/recovery</code> when a vocal complaint is spotted on social.
            In production, this would be tied to a social-listening webhook.
          </p>
        </div>
      )}

      <div className="recovery-grid">
        {cases.map((c) => (
          <div key={c._id} className="recovery-card">
            <div className="r-top">
              <strong>{c.passengerName}</strong>
              <span className="r-source">{c.source} · {new Date(c.incidentDate).toLocaleDateString('en-IN')}</span>
            </div>
            <p className="r-complaint">{c.complaint}</p>
            <div className="r-stage">
              <span className={`r-stage-pill stage-${c.stage}`}>{c.stage.replace('_', ' ')}</span>
            </div>
            {c.stage !== 'converted' && c.stage !== 'lost' && (
              <div className="r-actions">
                <select onChange={(e) => advance(c._id, e.target.value)} defaultValue="">
                  <option value="" disabled>Advance to…</option>
                  {stages.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============= DOCS TAB ============= */

function DocsTab() {
  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2>API documentation</h2>
          <p>All endpoints exposed by the Express backend. Public endpoints don't need auth; admin endpoints require <code>Authorization: Bearer &lt;ADMIN_TOKEN&gt;</code>.</p>
        </div>
      </div>

      <div className="docs-grid">
        <ApiDoc method="GET" path="/api" desc="Health check + endpoint listing" />
        <ApiDoc method="GET" path="/api/health" desc="Server + DB connection status" />
        <ApiDoc method="POST" path="/api/callbacks" desc="Submit a Telentir callback request (public)" />
        <ApiDoc method="GET" path="/api/callbacks?status=pending" desc="List callbacks (admin)" admin />
        <ApiDoc method="PATCH" path="/api/callbacks/:id" desc="Update callback status (admin)" admin />
        <ApiDoc method="POST" path="/api/testimonials" desc="Submit testimonial for moderation (public)" />
        <ApiDoc method="GET" path="/api/testimonials" desc="List approved testimonials (public)" />
        <ApiDoc method="GET" path="/api/testimonials/admin" desc="List all testimonials (admin)" admin />
        <ApiDoc method="PATCH" path="/api/testimonials/:id" desc="Approve/reject testimonial (admin)" admin />
        <ApiDoc method="GET" path="/api/flights/live" desc="Live flight tracker data (public, polled every 60s)" />
        <ApiDoc method="POST" path="/api/flights/seed" desc="Seed flight data (admin, run once)" admin />
        <ApiDoc method="POST" path="/api/recovery" desc="Log unhappy customer (admin)" admin />
        <ApiDoc method="GET" path="/api/recovery" desc="List recovery cases (admin)" admin />
        <ApiDoc method="GET" path="/api/recovery/stats" desc="Pipeline counts by stage (admin)" admin />
        <ApiDoc method="PATCH" path="/api/recovery/:id" desc="Advance case through pipeline (admin)" admin />
        <ApiDoc method="POST" path="/api/route-alerts" desc="Subscribe to route updates (public)" />
        <ApiDoc method="GET" path="/api/route-alerts" desc="List alert subscriptions (admin)" admin />
      </div>
    </div>
  );
}

function ApiDoc({ method, path, desc, admin }) {
  return (
    <div className="api-doc">
      <div className="api-line">
        <span className={`api-method method-${method.toLowerCase()}`}>{method}</span>
        <span className="api-path">{path}</span>
        {admin && <span className="api-admin">admin</span>}
      </div>
      <p className="api-desc">{desc}</p>
    </div>
  );
}
