/**
 * Telentir support widget.
 *
 * Posts callback requests to POST /api/callbacks. The Express endpoint
 * validates input, persists to MongoDB, and queues for the voice AI to
 * place an outbound call within ~2 minutes.
 *
 * Form state is local. On submit, useMutation handles the POST and
 * shows success/error states.
 */

import { useState } from 'react';
import { useMutation } from '../../hooks/useApi.js';
import { api } from '../../api/client.js';
import './TelentirWidget.css';

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳' },
  { code: '+971', flag: '🇦🇪' },
  { code: '+1', flag: '🇺🇸' },
];

const REASONS = [
  { value: '', label: 'Pick what you need help with' },
  { value: 'delay_or_schedule_change', label: 'Delay or schedule change' },
  { value: 'first_time_flying', label: 'First-time flying questions' },
  { value: 'rebook_or_cancel', label: 'Rebook or cancel' },
  { value: 'incident_followup', label: 'Something happened on my flight' },
  { value: 'other', label: 'Other' },
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी (Hindi)' },
  { value: 'mr', label: 'मराठी (Marathi)' },
  { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { value: 'te', label: 'తెలుగు (Telugu)' },
  { value: 'ml', label: 'മലയാളം (Malayalam)' },
];

export default function TelentirWidget() {
  const [form, setForm] = useState({
    countryCode: '+91',
    phoneNumber: '',
    reason: '',
    language: 'en',
    flightNumber: '',
  });

  const { mutate, loading, error, success, data } = useMutation((body) => api.post('/callbacks', body));

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.phoneNumber || !form.reason) return;
    try {
      await mutate(form);
      setForm({ countryCode: '+91', phoneNumber: '', reason: '', language: 'en', flightNumber: '' });
    } catch (err) {
      // useMutation handles error state; just prevent throw
    }
  }

  return (
    <section className="telentir-section" id="telentir">
      <div className="wrap">
        <div className="telentir-header">
          <div className="section-eyebrow orange">Support reimagined</div>
          <h2>AI voice support that <span>actually calls you back.</span></h2>
          <p>We partnered with Telentir to build a voice AI that picks up in under 2 minutes — in six Indian languages — and handles everything from first-time-flyer nerves to rebooking during a delay. No hold music. No "as per policy."</p>
        </div>

        <div className="telentir-main">
          <div className="telentir-scenarios">
            <span className="eyebrow"><span className="dot" />Four moments, one system</span>
            <h3>We call. You don't wait.</h3>
            <p>Most airline support kicks in after something has gone wrong. Ours starts before you fly — and shows up in the exact moments you'd want a human.</p>

            <ul className="scenario-list">
              <li className="scenario">
                <div className="scenario-icon">📅</div>
                <span className="scenario-when">Night before</span>
                <span className="scenario-what">A short call walking through your flight, your aircraft, and what to expect on board.</span>
              </li>
              <li className="scenario">
                <div className="scenario-icon">⏰</div>
                <span className="scenario-when">If delayed</span>
                <span className="scenario-what">We call you — not the other way — with the cause, the new time, and what to do.</span>
              </li>
              <li className="scenario">
                <div className="scenario-icon">✓</div>
                <span className="scenario-when">After you land</span>
                <span className="scenario-what">A quick check-in if your flight was bumpy, delayed, or diverted — plus a real person if needed.</span>
              </li>
              <li className="scenario">
                <div className="scenario-icon">📞</div>
                <span className="scenario-when">Anytime</span>
                <span className="scenario-what">Rebooking, cancellations, refunds — handled in under a minute, or escalated to a human.</span>
              </li>
            </ul>
          </div>

          <form className="telentir-widget-wrap" onSubmit={handleSubmit}>
            <div className="telentir-badge">
              POWERED BY <span className="telentir-badge-logo">TELENTIR</span>
            </div>
            <div className="widget-top">
              <div className="widget-status"><span className="dot" /> Voice support online</div>
              <span className="widget-callback-time">2 min callback</span>
            </div>

            <div className="widget-head">Want us to call you?</div>
            <p className="widget-sub">Leave a number and a question. You'll hear back in under 2 minutes — in your language.</p>

            {success && (
              <div className="success-banner">
                ✓ {data?.message || "We'll call you back in under 2 minutes."}
              </div>
            )}

            {error && (
              <div className="error-banner">
                {error.message}
              </div>
            )}

            <div className="widget-form">
              <div className="widget-input-row">
                <select value={form.countryCode} onChange={(e) => update('countryCode', e.target.value)}>
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  placeholder="98XXX XXXXX"
                  pattern="[0-9]{6,15}"
                  value={form.phoneNumber}
                  onChange={(e) => update('phoneNumber', e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
              <select value={form.reason} onChange={(e) => update('reason', e.target.value)} required>
                {REASONS.map((r) => (
                  <option key={r.value} value={r.value} disabled={r.value === ''}>{r.label}</option>
                ))}
              </select>
              <select value={form.language} onChange={(e) => update('language', e.target.value)}>
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="widget-cta" disabled={loading || !form.phoneNumber || !form.reason}>
              {loading ? 'Submitting…' : '📞 Request a Call'}
            </button>
            <div className="widget-note">Posts to /api/callbacks · stored in MongoDB · queued for the voice agent</div>
          </form>
        </div>
      </div>
    </section>
  );
}
