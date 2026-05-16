import { useState } from 'react';
import './BookingWidget.css';

const TABS = ['Book', 'Rebook', 'Cancel', 'Ancillary'];
const TRIP_TYPES = [
  { value: 'one_way', label: 'One Way' },
  { value: 'round_trip', label: 'Round Trip' },
  { value: 'armed_forces', label: 'Armed Forces', special: true },
];

export default function BookingWidget() {
  const [activeTab, setActiveTab] = useState('Book');
  const [tripType, setTripType] = useState('one_way');
  const [form, setForm] = useState({
    from: { city: 'Bengaluru', code: 'BLR', airport: 'Kempegowda Intl' },
    to: { city: 'Sindhudurg', code: 'SDW', airport: 'Chipi Airport, Konkan' },
    departDate: 'Sat, 2 May',
    passengers: '1 Adult',
    fareClass: 'Economy',
  });

  function swap() {
    setForm((f) => ({ ...f, from: f.to, to: f.from }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // In production: navigate to /search with these params, hit /api/flights/search etc.
    alert(
      `🛫 Search: ${form.from.code} → ${form.to.code} · ${form.departDate} · ${form.passengers}\n(Demo only — would query /api/flights/search in production)`
    );
  }

  return (
    <div className="booking-wrap">
      <div className="booking-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`booking-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <form className="booking-card" onSubmit={handleSubmit}>
        <div className="trip-options">
          {TRIP_TYPES.map((t) => (
            <label key={t.value} className={`trip-radio ${t.special ? 'special' : ''}`}>
              <input
                type="radio"
                name="trip"
                value={t.value}
                checked={tripType === t.value}
                onChange={(e) => setTripType(e.target.value)}
              />
              {t.label}
            </label>
          ))}
          <a href="#" className="trip-promo" onClick={(e) => e.preventDefault()}>
            + Add Promo Code
          </a>
        </div>

        <div className="booking-grid">
          <div className="booking-field">
            <label>From</label>
            <div className="value">
              {form.from.city} <span className="code">{form.from.code}</span>
            </div>
            <div className="sub">{form.from.airport}</div>
            <button type="button" className="swap" onClick={swap} title="Swap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M8 3L4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4" />
              </svg>
            </button>
          </div>
          <div className="booking-field">
            <label>To</label>
            <div className="value">
              {form.to.city} <span className="code">{form.to.code}</span>
            </div>
            <div className="sub">{form.to.airport}</div>
          </div>
          <div className="booking-field">
            <label>Depart</label>
            <div className="value">{form.departDate}</div>
            <div className="sub">+ Add return</div>
          </div>
          <div className="booking-field">
            <label>Passengers &amp; Class</label>
            <div className="value">{form.passengers}</div>
            <div className="sub">{form.fareClass}</div>
          </div>
          <button type="submit" className="search-btn">
            Search
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
