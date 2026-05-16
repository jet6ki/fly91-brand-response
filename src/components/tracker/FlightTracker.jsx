/**
 * Live flight tracker.
 *
 * Polls GET /api/flights/live every 60 seconds. The Express endpoint
 * returns flights currently in-air, boarding, or scheduled for the
 * next few hours from MongoDB. While the page is in the background,
 * polling pauses to save API quota.
 */

import { useApi } from '../../hooks/useApi.js';
import { api } from '../../api/client.js';
import { useEffect, useState } from 'react';
import './FlightTracker.css';

// Fallback static data — shown if the API is unreachable or the DB hasn't been seeded yet
const FALLBACK_FLIGHTS = [
  { _id: 'f1', flightNumber: 'IC 1401', fromCode: 'HYD', toCode: 'HBX', aircraft: 'ATR 72-600', status: 'in_air', arrivalTime: new Date(Date.now() + 20 * 60000).toISOString() },
  { _id: 'f2', flightNumber: 'IC 2108', fromCode: 'BLR', toCode: 'SDW', aircraft: 'ATR 72-600', status: 'in_air', arrivalTime: new Date(Date.now() + 50 * 60000).toISOString() },
  { _id: 'f3', flightNumber: 'IC 3301', fromCode: 'GOX', toCode: 'AGX', gate: 'Gate 3 · Mopa', status: 'boarding', departureTime: new Date(Date.now() + 15 * 60000).toISOString() },
  { _id: 'f4', flightNumber: 'IC 1378', fromCode: 'GOX', toCode: 'PNQ', status: 'delayed', delayMinutes: 45, departureTime: new Date(Date.now() + 70 * 60000).toISOString() },
  { _id: 'f5', flightNumber: 'IC 4021', fromCode: 'HYD', toCode: 'VGA', status: 'landed', arrivalTime: new Date(Date.now() - 15 * 60000).toISOString() },
  { _id: 'f6', flightNumber: 'IC 2205', fromCode: 'PNQ', toCode: 'JLG', gate: 'Gate 7 · Pune', status: 'scheduled', departureTime: new Date(Date.now() + 105 * 60000).toISOString() },
  { _id: 'f7', flightNumber: 'IC 3402', fromCode: 'SSE', toCode: 'GOX', aircraft: 'ATR 72-600', status: 'in_air', arrivalTime: new Date(Date.now() + 20 * 60000).toISOString() },
];

const DESTINATIONS = [
  { code: 'GOX', city: 'Goa', x: 240, y: 330, hub: true, sublabel: 'Hub' },
  { code: 'BLR', city: 'Bengaluru', x: 315, y: 330 },
  { code: 'HYD', city: 'Hyderabad', x: 360, y: 220, active: true },
  { code: 'SDW', city: 'Sindhudurg', x: 245, y: 360 },
  { code: 'PNQ', city: 'Pune', x: 280, y: 260 },
  { code: 'JLG', city: 'Jalgaon', x: 280, y: 180 },
  { code: 'SSE', city: 'Solapur', x: 300, y: 260 },
  { code: 'HBX', city: 'Hubballi', x: 310, y: 310, active: true },
  { code: 'VGA', city: 'Vijayawada', x: 410, y: 260 },
  { code: 'RJA', city: 'Rajahmundry', x: 430, y: 300 },
  { code: 'AGX', city: 'Agatti', x: 190, y: 395, sublabel: 'Lakshadweep' },
];

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function statusLabel(flight) {
  switch (flight.status) {
    case 'in_air': return 'In the air';
    case 'boarding': return 'Boarding';
    case 'scheduled': return 'Scheduled';
    case 'landed': return 'Landed';
    case 'delayed': return `Delayed · ${flight.delayMinutes || 0}m`;
    case 'cancelled': return 'Cancelled';
    case 'diverted': return 'Diverted';
    default: return flight.status;
  }
}

function statusClass(status) {
  switch (status) {
    case 'in_air': return 'air';
    case 'boarding': case 'scheduled': return 'schedule';
    case 'landed': return 'landed';
    case 'delayed': case 'cancelled': case 'diverted': return 'delay';
    default: return 'schedule';
  }
}

export default function FlightTracker() {
  const { data, loading, error, refetch } = useApi(() => api.get('/flights/live'), []);
  const [usingFallback, setUsingFallback] = useState(false);

  // Poll every 60 seconds, pause when tab hidden
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === 'visible') refetch();
    };
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    if (error) setUsingFallback(true);
  }, [error]);

  const flights = error || !data?.data?.length ? FALLBACK_FLIGHTS : data.data;
  const lastUpdate = data?.lastUpdated ? new Date(data.lastUpdated) : new Date();

  return (
    <section className="tracker-section" id="tracker">
      <div className="wrap">
        <div className="tracker-header">
          <div>
            <span className="tracker-live-tag">
              <span className="dot" />
              {usingFallback ? 'Demo data · seed DB to go live' : 'Live · Updated every 60 seconds'}
            </span>
            <h2>Where Fly91 is <span>flying right now.</span></h2>
            <p>Track any flight, see every aircraft in the sky. Real-time data from the Express API, persisted in MongoDB.</p>
          </div>
          <button onClick={refetch} className="refresh-btn" disabled={loading}>
            {loading ? 'Refreshing…' : `Refresh · ${formatTime(lastUpdate.toISOString())}`}
          </button>
        </div>

        <div className="tracker-box">
          <div className="tracker-map">
            <svg viewBox="0 0 600 520" preserveAspectRatio="xMidYMid meet" className="tracker-svg">
              {/* India silhouette */}
              <path
                d="M 230 80 Q 280 72 340 88 Q 390 100 430 128 Q 470 160 480 210 Q 485 260 475 305 Q 465 350 440 390 Q 410 430 370 455 Q 330 475 290 465 Q 255 450 225 420 Q 195 380 180 330 Q 170 275 175 220 Q 185 155 210 110 Q 220 90 230 80 Z"
                fill="rgba(6, 177, 186, 0.05)"
                stroke="rgba(0, 56, 71, 0.2)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Flight paths */}
              <g fill="none">
                <path id="pathHYDtoHBX" d="M 360 220 Q 330 260 310 310" stroke="#FF6D35" strokeWidth="1.8" strokeDasharray="6 3" opacity="0.85" />
                <path id="pathBLRtoSDW" d="M 315 330 Q 280 322 245 335" stroke="#FF6D35" strokeWidth="1.8" strokeDasharray="6 3" opacity="0.85" />
                <path d="M 240 330 Q 215 360 190 395" stroke="#06B1BA" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.45" />
                <path d="M 360 220 Q 395 230 430 240" stroke="#06B1BA" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.45" />
              </g>

              {/* Destination nodes */}
              {DESTINATIONS.map((d) => (
                <g key={d.code} className="node">
                  <circle
                    cx={d.x}
                    cy={d.y}
                    r={d.hub ? 10 : d.active ? 9 : 7}
                    fill={d.hub ? 'rgba(250, 182, 0, 0.2)' : d.active ? 'rgba(255, 109, 53, 0.3)' : 'rgba(6, 177, 186, 0.25)'}
                    className={`pulse-ring ${d.active ? 'pulse-fast' : d.hub ? 'pulse-slow' : ''}`}
                  />
                  <circle
                    cx={d.x}
                    cy={d.y}
                    r={d.hub ? 8 : 5}
                    fill={d.hub ? '#FAB600' : d.active ? '#FF6D35' : '#06B1BA'}
                    stroke="white"
                    strokeWidth={d.hub ? '2' : '1.5'}
                  />
                  <text
                    x={d.x + (d.hub ? 0 : 10)}
                    y={d.y + (d.hub ? 25 : 4)}
                    textAnchor={d.hub ? 'middle' : 'start'}
                    fill="#003847"
                    fontFamily="Manrope, sans-serif"
                    fontSize={d.hub ? '11' : '10'}
                    fontWeight={d.hub ? '700' : '600'}
                  >
                    {d.hub ? `${d.code} · ${d.city}` : d.code}
                  </text>
                  {d.sublabel && !d.hub && (
                    <text x={d.x} y={d.y + 32} textAnchor="middle" fill="#7E7E7E" fontFamily="Manrope, sans-serif" fontSize="8" fontWeight="500">{d.sublabel}</text>
                  )}
                </g>
              ))}

              {/* Animated planes */}
              <g fill="#FF6D35" stroke="white" strokeWidth="0.5">
                <polygon points="-6,-3 6,0 -6,3 -3,0" opacity="0.95">
                  <animateMotion dur="8s" repeatCount="indefinite" rotate="auto">
                    <mpath href="#pathHYDtoHBX" />
                  </animateMotion>
                </polygon>
                <polygon points="-6,-3 6,0 -6,3 -3,0" opacity="0.95">
                  <animateMotion dur="6.5s" repeatCount="indefinite" rotate="auto" begin="2s">
                    <mpath href="#pathBLRtoSDW" />
                  </animateMotion>
                </polygon>
              </g>
            </svg>

            <div className="tracker-legend">
              <div className="legend-row"><span className="legend-dot hub" />Hub</div>
              <div className="legend-row"><span className="legend-dot active" />Active flight</div>
              <div className="legend-row"><span className="legend-dot idle" />Destination</div>
            </div>
          </div>

          <div className="tracker-list">
            <div className="tracker-list-header">
              <h4>Live Flights</h4>
              <span className="count">{flights.length} active</span>
            </div>

            {loading && !data && <div className="tracker-loading">Loading flights from API…</div>}

            {flights.map((flight) => (
              <div className="flight-row" key={flight._id || flight.flightNumber}>
                <div className="flight-row-top">
                  <span className="flight-num">{flight.flightNumber}</span>
                  <span className={`flight-status ${statusClass(flight.status)}`}>
                    {statusLabel(flight)}
                  </span>
                </div>
                <div className="flight-route">
                  {flight.fromCode} <span className="arrow">→</span> {flight.toCode}
                </div>
                <div className="flight-meta">
                  <span>{flight.aircraft || flight.gate || 'ATR 72-600'}</span>
                  <span>
                    {flight.status === 'in_air' || flight.status === 'landed' ? 'arr' : 'dep'}{' '}
                    {formatTime(flight.arrivalTime || flight.departureTime)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
