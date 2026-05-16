/**
 * HomePage — the cover letter / package landing page.
 *
 * Personal-letter style page addressed to Fly91's CEO. Links to each of
 * the six deliverables and plays the video + audio inline.
 */

import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home">
      {/* Header */}
      <header className="home-header">
        <div className="wrap-narrow">
          <div className="meta-strip">
            <Link to="/" className="logo" aria-label="Fly91">
              <span className="logo-fly">FLY</span>
              <span className="logo-91">91</span>
              <span className="logo-dot" />
            </Link>
            <span className="date-line">APRIL 2026</span>
          </div>
          <div className="salutation">Dear Mr. Chacko,</div>
          <h1>
            Hubballi wasn't a <em>safety</em> problem.<br />
            It was a <span>communication</span> one.
          </h1>
          <div className="ref-line">
            <span>Re: Flight IC 3401 · April 20, 2026</span>
            <span>From: Mohammed Thameem</span>
          </div>
        </div>
      </header>

      {/* Letter body */}
      <section className="letter">
        <div className="wrap-narrow">
          <p>This is going to read a little out of nowhere, so please bear with me. I'm Thameem — a student at Lovely Professional University. I'm not writing as a consultant, and I'm not trying to tell you how to run your airline.</p>
          <p>But I saw the Hubballi news last week, and as a nervous flyer myself, something about it stuck with me. Not the diversion — <strong>your captain made the right call</strong>. Holding for weather, choosing to divert, bringing everyone back safely. That was judgement, and I could see it from the outside.</p>
          <p>What stuck with me was the three-and-a-half hours of silence in the cabin, and then the public statement afterwards that called the passenger accounts <em>"incorrect, malicious"</em> and urged <em>"responsible reporting."</em> As a passenger reading that, it felt like the exact moment an airline could have said something human and didn't.</p>
          <p>I work with a small team on <strong>Telentir</strong>, which is an AI voice-support system for airlines. But instead of pitching it at you, I spent the weekend building a few things that try to show what the other side of that gap could look like — if "explain, don't defend" became the rule.</p>
          <p>Everything's below. No agenda. I just wanted to share it with you — that's all.</p>
          <div className="letter-divider" />
        </div>
      </section>

      {/* Deliverables */}
      <section className="deliverables">
        <div className="wrap-narrow">
          <div className="section-eyebrow">What I built</div>
          <h2 className="section-title">Six things. <em>Each stands alone.</em></h2>
          <p className="section-sub">All built this past week. Open any one that interests you — they're independent, so you can stop wherever. The tightest version is #6 (under a minute).</p>

          <Link to="/site" className="deliv-card highlight">
            <div className="deliv-num">01</div>
            <div className="deliv-body">
              <h3>A redesigned <em>fly91.in</em>.</h3>
              <p>Your existing palette, modernized components, booking-widget-first structure preserved. Live flight tracker with real animated aircraft, visible Telentir support surface with multilingual callback form, example SEO route page (Bengaluru → Sindhudurg).</p>
              <div className="deliv-meta">
                <span className="tag">React + Express</span>
                <span>Your palette · live tracker · Telentir surface</span>
              </div>
            </div>
            <div className="open">Open <span>→</span></div>
          </Link>

          <div className="deliv-card">
            <div className="deliv-num">02</div>
            <div className="deliv-body">
              <h3>"Why your plane <em>circled</em>."</h3>
              <p>A 45-second AI-generated explainer — emotion first, then explanation. The first drop of what could be a weekly "Flying, Explained" series. Plays below.</p>
              <div className="deliv-meta">
                <span className="tag orange">Video · 45s</span>
                <span>Generated with Veo 3.1 + Gemini TTS</span>
              </div>
            </div>
            <div className="open">Watch below</div>
            <div className="inline-video">
              <video controls preload="metadata" playsInline>
                <source src="/media/atr-wing-clouds.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          <div className="deliv-card dark">
            <div className="deliv-num">03</div>
            <div className="deliv-body">
              <h3>A Telentir <em>reassurance call</em>.</h3>
              <p>A ground-delay scenario, recorded. Warm female voice, calm, unhurried. This is the tone I wish the cabin had heard that afternoon. Plays below.</p>
              <div className="deliv-meta">
                <span className="tag">Voice AI · 55s</span>
                <span>1 of 3 scripts (pre-flight · delay · post-flight)</span>
              </div>
            </div>
            <div className="open">Play below</div>
            <div className="inline-audio">
              <audio controls preload="none">
                <source src="/media/telentir-delay-call.wav" type="audio/wav" />
              </audio>
            </div>
          </div>

          <Link to="/pr" className="deliv-card">
            <div className="deliv-num">04</div>
            <div className="deliv-body">
              <h3>A PR strategy <em>document</em>.</h3>
              <p>Ten sections. The Hubballi statement diagnosed line-by-line and rewritten side-by-side. Five voice rules. A 90-minute incident protocol. Customer-recovery playbook. An 8-minute read.</p>
              <div className="deliv-meta">
                <span className="tag">10 sections</span>
                <span>~8-min read</span>
              </div>
            </div>
            <div className="open">Read <span>→</span></div>
          </Link>

          <Link to="/deck" className="deliv-card">
            <div className="deliv-num">05</div>
            <div className="deliv-body">
              <h3>A system-at-a-glance <em>deck</em>.</h3>
              <p>Eight slides. Hook → diagnosis → the shift → the three-layer system → what I built → the before/after. Arrow keys to navigate.</p>
              <div className="deliv-meta">
                <span className="tag">8 slides</span>
                <span>For the quickest skim</span>
              </div>
            </div>
            <div className="open">Open deck <span>→</span></div>
          </Link>

          <Link to="/flashcards" className="deliv-card">
            <div className="deliv-num">06</div>
            <div className="deliv-body">
              <h3>Pitch <em>flashcards</em>.</h3>
              <p>The same narrative as the deck, one card at a time — swipeable, mobile-first. Under 90 seconds. Probably the tightest version of everything here.</p>
              <div className="deliv-meta">
                <span className="tag yellow">8 cards</span>
                <span>If you only have a minute</span>
              </div>
            </div>
            <div className="open">Flick through <span>→</span></div>
          </Link>
        </div>
      </section>

      {/* Sign-off */}
      <section className="signoff">
        <div className="wrap-narrow">
          <div className="signoff-mark">— The point, if there is one —</div>
          <h2>If any of it is useful, <em>amazing</em>.<br />If not, no worries.</h2>
          <p>Hubballi wasn't a flight that went wrong. It was a conversation that didn't happen. The distance between what was said in that cabin and what could have been said is small — and I think, buildable.</p>
          <p>Thank you for what Fly91 is already doing for the India that bigger jets skip. It matters. That's why any of this mattered enough to build.</p>

          <div className="signature">
            <div className="sig-name">Mohammed Thameem</div>
            <div className="sig-affil">Lovely Professional University · 12406194</div>
            <div className="sig-location">India · April 2026</div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="wrap-narrow">
          <span>A hand-built proposal</span>
          <span>·</span>
          <span>Not affiliated with Fly91</span>
          <span>·</span>
          <span>No obligation</span>
        </div>
      </footer>
    </div>
  );
}
