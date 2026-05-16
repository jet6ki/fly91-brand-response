/**
 * DeckPage — 8-slide pitch deck.
 *
 * Demonstrates React state management for a presentation context:
 * useState for currentSlide, useEffect for keyboard listeners, touch
 * gesture handling, and a parent-message channel for embed contexts.
 */

import { useState, useEffect, useCallback } from 'react';
import './DeckPage.css';

const SLIDES = [
  {
    id: 1, theme: 'light',
    eyebrow: 'A proposal for Fly91',
    titleParts: ['The airline that', { em: 'explains everything.' }],
    body: 'A Passenger Confidence System — built around one rule: transparency beats reassurance, always.',
    footer: ['Comms · Content · Support · Recovery', 'April 2026'],
  },
  {
    id: 2, theme: 'dark',
    eyebrow: 'April 20, 2026',
    badge: 'Flight IC 3401 · Hyderabad → Hubballi',
    titleParts: ['22 passengers held in the air for ', { em: 'three and a half hours,' }, ' with nothing said in the cabin they could hold on to.'],
    stats: [
      { n: '70m', l: 'Held above Hubballi' },
      { n: '2', l: 'Diversions · BLR then back' },
      { n: '24h+', l: "To Fly91's response" },
      { n: '0', l: '"sorry" appeared' },
    ],
  },
  {
    id: 3, theme: 'light',
    eyebrow: 'The diagnosis',
    quote: '"The claims are incorrect and malicious. We urge responsible reporting. Standard operating procedure. Impeccable safety record. Zero compromise on safety."',
    quoteAttrib: 'Fly91 public statement · April 20',
    missing: ['Zero mention of the passengers.', 'Zero acknowledgement that it was frightening.', 'Zero promise of what changes.'],
    titleParts: ['This wasn\'t a ', { em: 'safety failure.' }, ' It was a ', { em: 'communication failure.' }],
    body: 'The aircraft was fine. The crew was competent. The decision to hold and divert was the right one. What broke was the conversation.',
  },
  {
    id: 4, theme: 'light',
    eyebrow: 'The one rule that changes everything',
    titleParts: ['Transparency, ', { em: 'not' }, ' reassurance.'],
    shift: {
      old: { label: 'Most airlines', title: '"Don\'t worry. Everything is safe."', desc: 'Reassurance spoken at the passenger. Abstract. Defensive. Invites the question: what are you hiding?' },
      new: { label: 'Fly91', title: '"Here\'s exactly what\'s happening."', desc: 'Explanation spoken to the passenger. Specific. Honest. Removes fear by removing the unknown.' },
    },
  },
  {
    id: 5, theme: 'dark',
    eyebrow: 'The system, three layers deep',
    titleParts: ['The ', { em: 'Passenger Confidence System.' }],
    layers: [
      { num: 'Layer 01', title: 'Demand', desc: 'Capture the passengers you don\'t have yet. SEO route pages that rank for "cheapest flight to Sindhudurg" — and convert searchers to leads.', tags: ['SEO route pages', 'Lead capture', 'WhatsApp alerts'] },
      { num: 'Layer 02', title: 'Trust', desc: 'Fly91 becomes the airline that explains everything. "Flying, Explained" content that teaches, not reassures.', tags: ['Weekly videos', 'ATR explainers', 'Testimonials'] },
      { num: 'Layer 03', title: 'Support', desc: 'Telentir voice AI calls passengers — before, during delays, after. No hold queues, no "as per policy."', tags: ['Pre-flight calls', 'Delay calls', 'Recovery calls'] },
    ],
  },
  {
    id: 6, theme: 'light',
    eyebrow: "What's in this package",
    titleParts: ['Five deliverables. ', { em: 'Already built.' }],
    body: 'Not a plan to build. Click any one of these and you\'ll see the actual artifact.',
    built: [
      { num: '01', title: 'A new Fly91 homepage', desc: 'Design-forward, warm, editorial. Includes a live route page with lead capture.', tag: 'Webpage' },
      { num: '02', title: '"Why your plane circled"', desc: '45-second video explainer. The opening shot of a weekly "Flying, Explained" series.', tag: 'Video + audio' },
      { num: '03', title: 'Telentir voice demo', desc: 'A real recording of the ground-delay reassurance call. Three scripts total.', tag: 'Audio · 3 scripts' },
      { num: '04', title: 'PR strategy package', desc: 'Hubballi rewrite, 5 voice rules, 90-min protocol, "Flying, Explained" campaign, recovery plan.', tag: '10-section doc' },
    ],
  },
  {
    id: 7, theme: 'light',
    eyebrow: 'Hubballi, rewritten',
    titleParts: ['Same facts. ', { em: 'A different airline altogether.' }],
    ba: {
      old: ['"The claims being circulated about Flight IC 3401 are incorrect and malicious."', '"The diversion was a standard operating procedure due to adverse weather. Our crew is highly trained and our safety record is impeccable."', '"We urge responsible reporting of facts."'],
      new: ['"Yesterday, our flight took three and a half hours instead of one. That was a frightening afternoon for the 22 people on board. We\'re sorry."', '"Where we failed you was in the cabin. We didn\'t tell you enough, often enough, in language that sounded human. That is on us."', '"From next week: flight-deck updates every 10 minutes, and a call from our team to every passenger within an hour of landing. Manoj Chacko, CEO."'],
    },
  },
  {
    id: 8, theme: 'dark',
    eyebrow: 'What happens next',
    titleParts: ['Hubballi wasn\'t a flight that went wrong. ', { em: "It was a conversation that never happened." }],
    body: 'Fix the conversation, and Fly91 stops being the airline that defended its procedure. Starts being the airline that explained everything.',
    cta: [
      { label: 'Step 01', v: '30-minute call. We walk through the micro-site, the video, and the voice demo, live.' },
      { label: 'Step 02', v: 'Plug Telentir in properly. Integrate voice support on your real stack.' },
      { label: 'Step 03', v: 'Launch "Flying, Explained." First video in the calendar: next Monday.' },
    ],
  },
];

export default function DeckPage() {
  const [current, setCurrent] = useState(0);
  const total = SLIDES.length;

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, total - 1)), [total]);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);
  const goTo = useCallback((i) => { if (i >= 0 && i < total) setCurrent(i); }, [total]);

  // Keyboard nav
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      if (e.key === 'Escape') { window.parent.postMessage({ type: 'close-fullscreen' }, '*'); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [next, prev]);

  // Parent message bridge for embed contexts
  useEffect(() => {
    function onMessage(e) {
      if (e.data?.type === 'navigate') {
        if (e.data.direction === 'next') next();
        else if (e.data.direction === 'prev') prev();
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [next, prev]);

  // Touch swipe
  useEffect(() => {
    let startX = 0;
    function onStart(e) { startX = e.touches[0].clientX; }
    function onEnd(e) {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) {
        if (dx > 0) prev(); else next();
      }
    }
    document.addEventListener('touchstart', onStart);
    document.addEventListener('touchend', onEnd);
    return () => {
      document.removeEventListener('touchstart', onStart);
      document.removeEventListener('touchend', onEnd);
    };
  }, [next, prev]);

  const slide = SLIDES[current];
  const isDark = slide.theme === 'dark';

  return (
    <div className={`deck ${isDark ? 'dark' : 'light'}`}>
      <div key={slide.id} className="deck-slide">
        <div className="deck-slide-meta">
          <span className="slide-num">
            {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <span className="deck-logo">
            <span className="logo-fly">FLY</span><span className="logo-91">91</span>
          </span>
        </div>

        <div className="deck-inner">
          {slide.eyebrow && <div className="deck-eyebrow">{slide.eyebrow}</div>}
          {slide.badge && <div className="deck-badge">{slide.badge}</div>}

          {slide.titleParts && (
            <h1 className="deck-title">
              {slide.titleParts.map((part, i) =>
                typeof part === 'string' ? <span key={i}>{part}</span> : <em key={i}>{part.em}</em>
              )}
            </h1>
          )}

          {slide.body && <p className="deck-body">{slide.body}</p>}

          {slide.stats && (
            <div className="deck-stats">
              {slide.stats.map((s) => (
                <div className="deck-stat" key={s.l}>
                  <div className="deck-stat-num">{s.n}</div>
                  <div className="deck-stat-label">{s.l}</div>
                </div>
              ))}
            </div>
          )}

          {slide.quote && (
            <blockquote className="deck-quote">
              {slide.quote}
              <cite>— {slide.quoteAttrib}</cite>
            </blockquote>
          )}

          {slide.missing && (
            <div className="deck-missing">
              {slide.missing.map((m) => <p key={m}>{m}</p>)}
            </div>
          )}

          {slide.shift && (
            <div className="deck-shift">
              <div className="shift-col old">
                <div className="shift-label">{slide.shift.old.label}</div>
                <h3>{slide.shift.old.title}</h3>
                <p>{slide.shift.old.desc}</p>
              </div>
              <div className="shift-arrow">→</div>
              <div className="shift-col new">
                <div className="shift-label">{slide.shift.new.label}</div>
                <h3>{slide.shift.new.title}</h3>
                <p>{slide.shift.new.desc}</p>
              </div>
            </div>
          )}

          {slide.layers && (
            <div className="deck-layers">
              {slide.layers.map((l) => (
                <div className="deck-layer" key={l.title}>
                  <div className="layer-num">{l.num}</div>
                  <h3>{l.title}</h3>
                  <p>{l.desc}</p>
                  <div className="layer-tags">
                    {l.tags.map((t) => <span key={t}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {slide.built && (
            <div className="deck-built">
              {slide.built.map((b) => (
                <div className="built-card" key={b.num}>
                  <div className="built-num">{b.num}</div>
                  <h4>{b.title}</h4>
                  <p>{b.desc}</p>
                  <span className="built-tag">{b.tag}</span>
                </div>
              ))}
            </div>
          )}

          {slide.ba && (
            <div className="deck-ba">
              <div className="ba-col old">
                <div className="ba-label">What Fly91 said · April 20</div>
                {slide.ba.old.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <div className="ba-col new">
                <div className="ba-label">What Fly91 should have said</div>
                {slide.ba.new.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          )}

          {slide.cta && (
            <div className="deck-cta">
              {slide.cta.map((c) => (
                <div className="cta-col" key={c.label}>
                  <div className="cta-label">{c.label}</div>
                  <div className="cta-v">{c.v}</div>
                </div>
              ))}
            </div>
          )}

          {slide.footer && (
            <div className="deck-footer">
              {slide.footer.map((f) => <span key={f}>{f}</span>)}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <button className="nav-arrow left" onClick={prev} disabled={current === 0} aria-label="Previous">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button className="nav-arrow right" onClick={next} disabled={current === total - 1} aria-label="Next">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
      </button>

      <div className="dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={`dot ${i === current ? 'active' : ''}`} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>

      <div className="counter">
        {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>
    </div>
  );
}
