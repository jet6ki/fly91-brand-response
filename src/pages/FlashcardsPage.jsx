/**
 * FlashcardsPage — 8-card swipeable pitch summary.
 *
 * Mobile-first card stack. Demonstrates touch gesture state and CSS-driven
 * card transitions in React.
 */

import { useState, useEffect } from 'react';
import './FlashcardsPage.css';

const CARDS = [
  {
    n: 1, theme: 'light',
    eyebrow: '01 / 08 · Who I am',
    tag: 'The opening',
    title: 'A proposal for Fly91.',
    body: ['I\'m a college student, not a consultant. I work with a small team on Telentir — an AI voice-support system.', 'This is a hand-built package. No agenda.'],
  },
  {
    n: 2, theme: 'light',
    eyebrow: '02 / 08 · Diagnosis',
    tag: 'April 20 · IC 3401', tagColor: 'orange',
    title: 'Not a safety problem. A communication one.',
    body: ['Your captain made the right call — held for weather, diverted, got everyone home. The silence in the cabin and the tone afterwards is what stuck.'],
    stats: [{ n: '70m', l: 'Held' }, { n: '22', l: 'Pax' }, { n: '0', l: '"Sorry"' }],
  },
  {
    n: 3, theme: 'dark',
    eyebrow: '03 / 08 · The rule',
    tag: 'One idea', tagColor: 'yellow',
    title: 'Transparency beats reassurance.',
    body: ['Most airlines say "don\'t worry, everything is safe." Fly91 could say "here\'s exactly what\'s happening." One removes fear by removing information. The other removes fear by removing the unknown.'],
  },
  {
    n: 4, theme: 'light',
    eyebrow: '04 / 08 · Built it #1',
    tag: 'Webpage',
    title: 'A homepage reskin.',
    body: ['Your existing palette. Booking-widget-first structure. Live flight tracker, Telentir support surface, testimonials, subtle first-time-flyer helper.'],
    list: ['Teal + yellow + deep teal (from your CSS)', 'Working booking search', 'Live flight tracker with animated flights', 'Routes + "Why Fly91" + newsroom'],
  },
  {
    n: 5, theme: 'light',
    eyebrow: '05 / 08 · Built it #2',
    tag: 'Video · 45s', tagColor: 'orange',
    title: '"Why your plane circled."',
    body: ['A short explainer, AI-generated, in the tone I think lands. The first drop of a "Flying, Explained" series — content commitment bigger airlines won\'t make.'],
    preview: { label: 'Sample line', title: '"Circling isn\'t an emergency. It\'s a decision not to land until it\'s right."' },
  },
  {
    n: 6, theme: 'light',
    eyebrow: '06 / 08 · Built it #3',
    tag: 'Voice demo', tagColor: 'dark',
    title: 'A Telentir reassurance call.',
    body: ['Ground-delay scenario, recorded. This is the tone IC 3401 should have had. Plus two supporting scripts.'],
    preview: { label: 'First 10 seconds', title: '"Hi, this is Sana from Fly91. First — I know a delay is the last thing you want to hear. I\'m sorry we\'re making you wait."', dark: true },
  },
  {
    n: 7, theme: 'light',
    eyebrow: '07 / 08 · Built it #4',
    tag: 'PR doc',
    title: 'A PR package — with the rewrite.',
    body: ['The Hubballi statement rewritten in your voice, side-by-side with the original. Plus a short playbook: tone rules, incident protocol, customer recovery plan.'],
    list: ['Hubballi statement rewritten — CEO-signed', '5 voice rules', '90-minute incident response protocol', '"Flying, Explained" campaign breakdown', 'Customer recovery for unhappy flyers'],
  },
  {
    n: 8, theme: 'dark',
    eyebrow: '08 / 08 · No agenda',
    tag: 'The end', tagColor: 'yellow',
    title: 'If it\'s useful, amazing.',
    body: ['If not — no worries. I just wanted to make sure it got seen.', 'I\'m not trying to tell you how to run your airline. I just saw Hubballi as a nervous flyer and thought: the distance between what happened in that cabin and what could have happened is small. And buildable.'],
    sig: { name: '— Mohammed Thameem', affil: 'Lovely Professional University · India · April 2026' },
  },
];

export default function FlashcardsPage() {
  const [current, setCurrent] = useState(0);
  const total = CARDS.length;

  function go(i) {
    if (i < 0 || i >= total || i === current) return;
    setCurrent(i);
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); go(current + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [current]);

  useEffect(() => {
    let startX = 0;
    function onStart(e) { startX = e.touches[0].clientX; }
    function onEnd(e) {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) {
        if (dx > 0) go(current - 1); else go(current + 1);
      }
    }
    document.addEventListener('touchstart', onStart);
    document.addEventListener('touchend', onEnd);
    return () => {
      document.removeEventListener('touchstart', onStart);
      document.removeEventListener('touchend', onEnd);
    };
  }, [current]);

  const card = CARDS[current];

  return (
    <div className="flashcards-stage">
      <div className="hint">
        <span>← Swipe or use arrow keys →</span>
      </div>

      <div className="deck-container">
        <div key={card.n} className={`card ${card.theme}`}>
          <div className="card-head">
            <span className="card-num">{card.eyebrow}</span>
            {card.tag && <span className={`card-tag ${card.tagColor || ''}`}>{card.tag}</span>}
          </div>
          <div className="card-body">
            <h1>{card.title}</h1>
            {card.body && card.body.map((p, i) => <p key={i}>{p}</p>)}
            {card.stats && (
              <div className="stats">
                {card.stats.map((s) => (
                  <div className="stat" key={s.l}>
                    <span className="v">{s.n}</span>
                    <span className="l">{s.l}</span>
                  </div>
                ))}
              </div>
            )}
            {card.list && (
              <ul className="card-list">
                {card.list.map((l) => <li key={l}>→ {l}</li>)}
              </ul>
            )}
            {card.preview && (
              <div className={`preview-box ${card.preview.dark ? 'dark' : ''}`}>
                <div className="preview-label">{card.preview.label}</div>
                <div className="preview-title">{card.preview.title}</div>
              </div>
            )}
            {card.sig && (
              <div className="sig">
                <div className="sig-name">{card.sig.name}</div>
                <div className="sig-affil">{card.sig.affil}</div>
              </div>
            )}
          </div>
          <div className="card-foot">
            <span className="logo-mini">FLY<span>91</span></span>
            <span>{String(current + 1).padStart(2, '0')} of {String(total).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      <div className="controls">
        <button onClick={() => go(current - 1)} disabled={current === 0} aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="dots">
          {CARDS.map((_, i) => (
            <button key={i} className={`dot ${i === current ? 'active' : ''}`} onClick={() => go(i)} aria-label={`Card ${i + 1}`} />
          ))}
        </div>
        <span className="counter">{String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        <button onClick={() => go(current + 1)} disabled={current === total - 1} aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
    </div>
  );
}
