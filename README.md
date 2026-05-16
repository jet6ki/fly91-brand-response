# Fly91 — Brand Response & Communication Package

A hand-built proposal for Fly91 (India's regional airline) by **Mohammed Thameem** (Lovely Professional University, 12406194), developed during the Kalvium Simulated Work program.

The project diagnoses Fly91's public communication failure following the Hubballi diversion incident on April 20, 2026 (Flight IC 3401), and packages a multi-channel response across web, PR, AI media, and pitch artifacts — all governed by one principle: **transparency over reassurance**.

The final package was shared directly with Mr. Manoj Chacko, CEO of Fly91, who personally acknowledged the work.

---

## 📦 What's inside

| Route | What it is |
|-------|-----------|
| `/` | The cover landing page — letter to the CEO + every deliverable on one screen |
| `/site` | A redesigned Fly91 homepage matching their actual brand palette |
| `/pr` | A 10-section PR strategy document including the Hubballi rewrite |
| `/deck` | An 8-slide "system at a glance" pitch deck |
| `/flashcards` | An 8-card swipeable pitch summary |
| `/media` | The 45-second explainer video + Telentir voice demo audio |

---

## 🛠️ Tech stack

- **Pure HTML, CSS, and JavaScript** — no frameworks, no build step
- **SVG** with SMIL `animateMotion` for the live flight tracker
- **CSS Custom Properties** for the design-token system
- **Google Fonts:** Manrope (sans-serif, substituting Fly91's licensed Duplet) and Fraunces (display serif)
- **Veo 3.1** for AI-generated video clips
- **Gemini TTS** for warm-voice narration
- **Gemini Image** for the custom editorial passenger image

---

## 🚀 Deployment

Hosted on Vercel as a static site. Folder structure:

```
public/
├── index.html          (cover page)
├── site/index.html     (redesigned homepage)
├── pr/index.html       (PR strategy doc)
├── deck/index.html     (pitch deck)
├── flashcards/index.html (pitch flashcards)
└── media/
    ├── atr-wing-clouds.mp4
    ├── cabin-passenger.mp4
    └── telentir-delay-call.wav
```

No build step. Vercel serves `public/` directly.

---

## 🎯 The governing rule

**Transparency over reassurance.** Acknowledge emotion first, then explain. Never lead with procedure.

Every artifact in this package follows that pattern.

---

## 📝 License

Hand-built for educational purposes. Not affiliated with Fly91 / Just Udo Aviation Pvt Ltd.
All Fly91 brand references used respectfully and with no commercial intent.

Mohammed Thameem · Lovely Professional University · April 2026
