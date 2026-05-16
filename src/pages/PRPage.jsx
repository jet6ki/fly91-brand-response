/**
 * PRPage — PR strategy document.
 *
 * Renders the 10-section strategy as a long-form React page with
 * sticky table of contents. Each section is its own component for
 * cleaner code organization and easier viva walkthrough.
 */

import { Link } from 'react-router-dom';
import './PRPage.css';

const VOICE_RULES = [
  { num: '01', title: 'Acknowledge emotion first. Always.', body: 'Before procedure, before facts — name what the passenger is feeling. The sentence after that can be a fact. The first sentence cannot.' },
  { num: '02', title: "Explain, don't justify.", body: 'Transparency beats reassurance. Tell passengers what\'s happening — the wind at the airport, the cabin crew briefing — in plain words.' },
  { num: '03', title: 'Commit to a change, not a claim.', body: '"We\'re sorry" is the opening line. "Here\'s what we\'re changing by Monday" is the closing line. Passengers want proof we\'ve learned.' },
  { num: '04', title: 'Never speak over the passenger\'s head.', body: 'Statements that scold the press ("we urge responsible reporting") teach the public we care about coverage more than about people.' },
  { num: '05', title: 'Sign everything with a name.', body: 'No more statements from "Fly91" or "the airline." Every crisis note carries a named human\'s byline.' },
];

const BANNED = [
  { word: '"Malicious"', why: 'Attacks the passenger.' },
  { word: '"Incorrect"', why: 'Use "different from what we saw."' },
  { word: '"Responsible reporting"', why: 'Scolds the audience.' },
  { word: '"Impeccable"', why: 'Self-congratulation during a crisis.' },
  { word: '"Zero compromise"', why: 'Corporate-speak.' },
  { word: '"Standard operating procedures"', why: 'Procedural deflection.' },
  { word: '"As per our policy"', why: 'Hides behind paper.' },
  { word: '"Regrettably"', why: 'A company word, not a person word.' },
  { word: '"Routine"', why: 'Routine for us. Never for the passenger.' },
  { word: '"Inconvenience"', why: 'Too small for most of what we\'re apologising for.' },
  { word: '"Operational reasons"', why: 'A black box. Name the actual cause.' },
  { word: '"The team"', why: 'Faceless. Sign with a person.' },
];

const TARGETS = [
  { label: 'Sentiment', n: '+32', delta: 'NPS · from current baseline', desc: 'NPS rises from regional-airline norm (~-5) to +27 through proactive comms.' },
  { label: 'Response', n: '< 20m', delta: 'Avg first response time on social', desc: 'From current multi-hour norm to under 20 min, via named-human response pods.' },
  { label: 'Recovery', n: '60%', delta: 'Of publicly unhappy flyers · converted', desc: 'Of the 50+ identified detractors in 90 days, 3 in 5 rebook after recovery call.' },
  { label: 'Reach', n: '5M', delta: 'Monthly views on "Flying, Explained"', desc: 'Twelve weekly explainer videos. Month 6: 5M+ cumulative organic views.' },
  { label: 'Crisis', n: '90m', delta: 'Full incident protocol execution', desc: 'From incident start to CEO-signed public statement. Hubballi took 24+ hours.' },
  { label: 'Demand', n: '45k', delta: 'Email / WhatsApp leads via route pages', desc: 'Month 6: 45,000 first-party contacts Fly91 owns — independent of aggregators.' },
];

export default function PRPage() {
  return (
    <div className="pr-page">
      <header className="pr-header">
        <div className="wrap-narrow">
          <Link to="/" className="pr-back">← Back to package</Link>
          <div className="pr-meta">
            <span className="logo-fly">FLY</span><span className="logo-91">91</span>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-soft)', letterSpacing: '0.1em' }}>COMMS & PR STRATEGY · APRIL 2026</span>
          </div>
          <h1>The airline that <em>explains everything.</em></h1>
          <p className="pr-lede">Seven shifts in how Fly91 talks to passengers — starting with the Hubballi rewrite, ending with the customers we still have time to win back.</p>
        </div>
      </header>

      <main className="wrap-narrow pr-main">
        <Section id="diagnostic" eyebrow="01 · Diagnostic" title="Fly91's Hubballi statement. Read line by line.">
          <p className="pr-lede-2">On April 20, Flight IC 3401 held for an hour over Hubballi, diverted to Bengaluru, and eventually returned. The plane was safe. The statement that followed was not.</p>
          <DiagCard tag="Phrase 1" original='"The claims are incorrect and malicious."' diagnosis='Opens by attacking the passengers who lived through it. "Malicious" is a word you use about an enemy.' />
          <DiagCard tag="Phrase 2" original='"We urge responsible reporting."' diagnosis='Scolds the media and everyone sharing passenger videos. Teaches that Fly91\'s first instinct in a crisis is to tell people to behave.' />
          <DiagCard tag="Phrase 3" original='"Standard operating procedure. Diversions are routine."' diagnosis="Technically true. Humanly deaf. Routine for us. Never routine for them." />
          <DiagCard tag="What's missing" original="Not a single 'we're sorry.' Not a single 'we hear you.' Not a single 'that was frightening for you.'" diagnosis="The statement was addressed to regulators and press. It was not addressed to the 22 people it was about." green />
        </Section>

        <Section id="rewrite" eyebrow="02 · The rewrite" title="The statement Fly91 should have issued.">
          <p>Same facts. But ordered around the passenger, not around the procedure.</p>
          <div className="rewrite-grid">
            <div className="rewrite-col old">
              <h4>What Fly91 said · April 20</h4>
              <p>"The claims being circulated about Flight IC 3401 are incorrect and malicious. There was no technical snag on the aircraft."</p>
              <p>"The diversion to Bengaluru was a standard operating procedure due to adverse weather. Our crew is highly trained and our safety record is impeccable. Zero compromise on safety."</p>
              <p>"The turbulence was brief and within normal pre-monsoon conditions. We urge responsible reporting of facts."</p>
            </div>
            <div className="rewrite-col new">
              <h4>What Fly91 should have said</h4>
              <p>"Yesterday, our flight from Hyderabad to Hubballi took three and a half hours instead of one. That was a frightening afternoon for the 22 people on board. We're sorry."</p>
              <p>"The weather near Hubballi closed in before we could land. Our captain held above the airport for as long as it was safe, then made the call to divert to Bengaluru. That's the decision we wanted her to make. It's also the decision that kept you in the air far longer than we promised."</p>
              <p>"Where we failed you was in the cabin. We didn't tell you enough, often enough, in language that sounded human. That is on us — not on the weather, not on the crew, not on the aircraft."</p>
              <p>"From next week, every Fly91 flight that holds or diverts will have two things: a short update from the flight deck every ten minutes, and a call from our team to every passenger within an hour of landing."</p>
              <p>"— Manoj Chacko, CEO, Fly91"</p>
            </div>
          </div>
        </Section>

        <Section id="rules" eyebrow="03 · Voice rules" title="Five rules, every word we write.">
          <div className="rules-grid">
            {VOICE_RULES.map((r) => (
              <div className="rule" key={r.num}>
                <div className="rule-num">Rule {r.num}</div>
                <h5>{r.title}</h5>
                <p>{r.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="ban" eyebrow="04 · The ban list" title="Words Fly91 doesn't use anymore.">
          <div className="banned-grid">
            {BANNED.map((b) => (
              <div className="banned-word" key={b.word}>
                <span className="strike">{b.word}</span>
                <span className="why">{b.why}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="targets" eyebrow="05 · Six-month targets" title="What 'it worked' looks like.">
          <div className="targets-grid">
            {TARGETS.map((t) => (
              <div className="target" key={t.label}>
                <div className="target-label">{t.label}</div>
                <div className="target-num">{t.n}</div>
                <div className="target-delta">{t.delta}</div>
                <p>{t.desc}</p>
              </div>
            ))}
          </div>
        </Section>
      </main>

      <footer className="pr-footer">
        <div className="wrap-narrow">
          <p>Hubballi wasn't a flight that went wrong. <em>It was a conversation that never happened.</em></p>
          <Link to="/" className="btn btn-primary">← Back to package</Link>
        </div>
      </footer>
    </div>
  );
}

function Section({ id, eyebrow, title, children }) {
  return (
    <section className="pr-section" id={id}>
      <div className="pr-section-eyebrow">{eyebrow}</div>
      <h2 className="pr-section-title">{title}</h2>
      {children}
    </section>
  );
}

function DiagCard({ tag, original, diagnosis, green }) {
  return (
    <div className="diag-card">
      <span className={`diag-tag ${green ? 'green' : ''}`}>{tag}</span>
      <div className={`diag-original ${green ? 'green' : ''}`}>{original}</div>
      <div className="diag-diagnosis"><strong>The diagnosis:</strong> {diagnosis}</div>
    </div>
  );
}
