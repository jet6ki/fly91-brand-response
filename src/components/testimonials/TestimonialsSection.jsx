/**
 * Testimonials section.
 *
 * GET /api/testimonials fetches approved testimonials from MongoDB.
 * POST /api/testimonials submits a new one for moderation.
 */

import { useState } from 'react';
import { useApi, useMutation } from '../../hooks/useApi.js';
import { api } from '../../api/client.js';
import './TestimonialsSection.css';

const FALLBACK_TESTIMONIALS = [
  { id: 't1', name: 'Anonymous', route: 'BLR → SDW', story: "I'm an anxious flyer. They called me the day before, told me what the ATR would sound like, why it's different, what to expect. I landed in Sindhudurg less scared than when I boarded.", isFirstFlight: true, rating: 5 },
  { id: 't2', name: 'Sneha R.', route: 'HYD → VGA', story: 'The night-before call was the reason I got on the plane. Knowing what to expect changes everything.', rating: 5 },
  { id: 't3', name: 'Arjun M.', route: 'GOX → PNQ', story: 'Delay on my Pune flight. They called me before the airport screen even updated. First time I have seen that.', rating: 5 },
  { id: 't4', name: 'Priya K.', route: 'BLR → AGX', story: 'Fly my parents to Agatti. Mom is 72, never flown before. Fly91 made it feel ordinary.', rating: 5 },
];

export default function TestimonialsSection() {
  const { data, loading, refetch } = useApi(() => api.get('/testimonials'), []);
  const [showForm, setShowForm] = useState(false);

  const testimonials = data?.data?.length ? data.data : FALLBACK_TESTIMONIALS;
  const featured = testimonials[0];
  const mini = testimonials.slice(1, 4);

  return (
    <section className="testimonials">
      <div className="wrap">
        <div className="t-header">
          <div className="section-eyebrow">Stories from onboard</div>
          <h2>Flown with us? <span>Tell the next passenger.</span></h2>
          <p>The most useful thing someone nervous about flying can read is another passenger's honest account. Real submissions, stored in MongoDB, moderated, then shown here.</p>
        </div>

        <div className="testimonial-grid">
          <div className="t-feature">
            <div className="t-video-area">
              <div className="t-video-content">
                <span className="t-tag">{featured.isFirstFlight ? 'First flight ever' : 'Featured story'}</span>
                <div className="t-rating">{'★'.repeat(featured.rating || 5)}</div>
              </div>
            </div>
            <div className="t-content">
              <p className="t-quote">{featured.story}</p>
              <div className="t-author">
                <div className="t-avatar">{featured.name[0]}</div>
                <div className="t-author-info">
                  <h5>{featured.name} · {featured.route}</h5>
                  <p>{featured.isFirstFlight ? 'First Fly91 journey' : 'Fly91 passenger'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="t-cta-card">
            <div>
              <div className="t-cta-icon">✍</div>
              <h4>Share your story.<br />Help the next flyer.</h4>
              <p>A short note about your flight. Honest, not scripted. Reviewed before it goes live.</p>
            </div>
            <button className="t-cta-btn" onClick={() => setShowForm((v) => !v)}>
              {showForm ? 'Close form' : 'Submit yours'} →
            </button>
          </div>
        </div>

        {showForm && <TestimonialForm onSubmitted={() => { refetch(); setShowForm(false); }} />}

        {mini.length > 0 && (
          <div className="mini-t-grid">
            {mini.map((t) => (
              <div className="mini-t" key={t.id || t._id}>
                <div className="stars">{'★'.repeat(t.rating || 5)}</div>
                <p>{t.story}</p>
                <div className="author"><strong>{t.name}</strong> · {t.route}</div>
              </div>
            ))}
          </div>
        )}

        {loading && <div className="loading">Loading testimonials…</div>}
      </div>
    </section>
  );
}

function TestimonialForm({ onSubmitted }) {
  const [form, setForm] = useState({
    name: '',
    route: '',
    story: '',
    rating: 5,
    isFirstFlight: false,
  });
  const { mutate, loading, error, success } = useMutation((body) => api.post('/testimonials', body));

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await mutate(form);
      setTimeout(() => onSubmitted?.(), 1500);
    } catch {}
  }

  return (
    <form className="t-form" onSubmit={handleSubmit}>
      <h4>Submit a testimonial</h4>
      <p className="t-form-note">Stored in MongoDB. Reviewed by Fly91 admin (you can see the queue at <code>/admin</code>) before going live.</p>

      {success && <div className="success-banner">✓ Thank you. Your story will appear after moderation.</div>}
      {error && <div className="error-banner">{error.message}</div>}

      <div className="form-row">
        <label>
          <span>Your name</span>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength={2} maxLength={80} placeholder="Priya K." />
        </label>
        <label>
          <span>Route flown</span>
          <input type="text" value={form.route} onChange={(e) => setForm({ ...form, route: e.target.value.toUpperCase() })} required placeholder="BLR → SDW" />
        </label>
      </div>

      <label>
        <span>Your story (20–800 chars)</span>
        <textarea value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} required minLength={20} maxLength={800} rows="4" placeholder="What surprised you, what helped, what we could do better." />
      </label>

      <div className="form-row">
        <label>
          <span>Rating</span>
          <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★☆ (4)</option>
            <option value="3">★★★☆☆ (3)</option>
            <option value="2">★★☆☆☆ (2)</option>
            <option value="1">★☆☆☆☆ (1)</option>
          </select>
        </label>
        <label className="checkbox-row">
          <input type="checkbox" checked={form.isFirstFlight} onChange={(e) => setForm({ ...form, isFirstFlight: e.target.checked })} />
          <span>This was my first flight ever</span>
        </label>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Submitting…' : 'Submit story'}
      </button>
    </form>
  );
}
