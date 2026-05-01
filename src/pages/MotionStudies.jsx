import { useState, useEffect } from "react"

/* ─────────────────────────────────────────────────────────────
   Motion Studies — Visual Case Study
   A deliberately sparse, spatial case study page.
   No heavy columns or cards — just large type, color blocks,
   and breathing room.
───────────────────────────────────────────────────────────── */

const SECTIONS = [
  {
    id: "obs",
    label: "01 — Observation",
    heading: "Motion has grammar.",
    body: "Every animated transition carries an implicit message. Abrupt snaps signal danger or decision. Long eases signal depth or importance. Overshoot signals life.",
    visual: "bars",
    bg: "#0a0a0a",
    accent: "#a0a0a0",
  },
  {
    id: "exp",
    label: "02 — Experiment",
    heading: "The 200ms rule.",
    body: "Below 200ms, motion is invisible to the conscious eye but still felt. Above 600ms, it reads as loading. The sweet spot lives in between — where interfaces breathe.",
    visual: "rings",
    bg: "#0c0c10",
    accent: "#8888cc",
  },
  {
    id: "prin",
    label: "03 — Principle",
    heading: "Easing is emotion.",
    body: "ease-in = effort. ease-out = release. ease-in-out = breath. Spring = life. The physics of attention is borrowed directly from the physical world.",
    visual: "curve",
    bg: "#0a100c",
    accent: "#88aa88",
  },
]

export default function MotionStudies({ navigate }) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="sp-page">
      {/* Fixed back button */}
      <button
        className={`sp-back${scrollY > 80 ? " sp-back--visible" : ""}`}
        onClick={() => navigate("sandbox")}
      >
        ← sandbox
      </button>

      {/* ── Hero ── */}
      <section className="sp-hero">
        <div className="sp-hero-bg">
          <BarsVisual count={9} />
        </div>
        <div className="sp-hero-content">
          <div className="sp-hero-meta">
            <span>2024</span>
            <span>Interaction Research</span>
            <span>Animation · Physics · Easing</span>
          </div>
          <h1 className="sp-hero-title">Motion<br />Studies</h1>
          <p className="sp-hero-sub">
            An investigation into how motion communicates intent.
          </p>
        </div>
      </section>

      {/* ── Overview ── */}
      <section className="sp-overview">
        <div className="sp-overview-inner">
          <span className="sp-label">Overview</span>
          <p className="sp-overview-text">
            The space between snap and flow — how timing shapes trust,
            how easing carries meaning, how the invisible physics of a
            digital object tells us whether to <em>fear</em> it or <em>follow</em> it.
          </p>
        </div>
      </section>

      {/* ── Alternating sections ── */}
      {SECTIONS.map((s, i) => (
        <section
          key={s.id}
          className={`sp-section${i % 2 === 1 ? " sp-section--flip" : ""}`}
          style={{ "--accent": s.accent }}
        >
          <div className="sp-section-visual" style={{ background: s.bg }}>
            {s.visual === "bars" && <BarsVisual count={6} />}
            {s.visual === "rings" && <RingsVisual />}
            {s.visual === "curve" && <CurveVisual />}
          </div>
          <div className="sp-section-text">
            <span className="sp-label">{s.label}</span>
            <h2 className="sp-section-heading">{s.heading}</h2>
            <p className="sp-section-body">{s.body}</p>
          </div>
        </section>
      ))}

      {/* ── Interaction moments ── */}
      <section className="sp-moments">
        <div className="sp-moments-inner">
          <span className="sp-label">Interaction Moments</span>
          <h2 className="sp-moments-heading">
            Three frames<br />that matter.
          </h2>
          <div className="sp-moments-grid">
            {[
              { n: "01", title: "The Anticipation", note: "The 40ms before movement begins — when the object telegraphs its intent." },
              { n: "02", title: "The Release", note: "Ease-out. The natural decay of energy. The moment an interface exhales." },
              { n: "03", title: "The Settle", note: "Spring overshoot. The 8px that says: this is alive, not calculated." },
            ].map((m) => (
              <div key={m.n} className="sp-moment-card">
                <span className="sp-moment-num">{m.n}</span>
                <h3 className="sp-moment-title">{m.title}</h3>
                <p className="sp-moment-note">{m.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <div className="sp-footer">
        <button className="sp-footer-back" onClick={() => navigate("sandbox")}>
          ← Return to Sandbox
        </button>
        <span className="sp-footer-label">SANDBOX — Motion Studies</span>
      </div>
    </div>
  )
}

/* ── Inline SVG/CSS visuals ── */

function BarsVisual({ count = 6 }) {
  const heights = [55, 80, 40, 95, 65, 45, 72, 88, 50].slice(0, count)
  return (
    <div className="sp-vis-bars">
      {heights.map((h, i) => (
        <div
          key={i}
          className="sp-vis-bar"
          style={{
            height: `${h}%`,
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </div>
  )
}

function RingsVisual() {
  return (
    <div className="sp-vis-rings">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="sp-vis-ring"
          style={{
            width: `${i * 22}%`,
            height: `${i * 22}%`,
            animationDelay: `${(i - 1) * 0.25}s`,
          }}
        />
      ))}
    </div>
  )
}

function CurveVisual() {
  return (
    <div className="sp-vis-curve">
      <svg viewBox="0 0 500 260" preserveAspectRatio="xMidYMid meet">
        {/* ease-out: decelerating curve */}
        <path
          d="M 40 200 C 80 200, 180 60, 460 55"
          stroke="rgba(160,160,160,0.5)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="4 4"
        />
        {/* spring overshoot */}
        <path
          d="M 40 200 C 100 200, 200 40, 300 50 S 380 80, 420 52 S 450 58, 460 55"
          stroke="rgba(200,200,200,0.8)"
          strokeWidth="1.5"
          fill="none"
        />
        {/* axis */}
        <line x1="40" y1="200" x2="460" y2="200" stroke="rgba(80,80,80,0.4)" strokeWidth="1" />
        <line x1="40" y1="40" x2="40" y2="210" stroke="rgba(80,80,80,0.4)" strokeWidth="1" />
        {/* labels */}
        <text x="46" y="218" fontSize="10" fill="rgba(100,100,100,0.7)" fontFamily="monospace">0ms</text>
        <text x="440" y="218" fontSize="10" fill="rgba(100,100,100,0.7)" fontFamily="monospace">t</text>
        <text x="44" y="52" fontSize="10" fill="rgba(100,100,100,0.7)" fontFamily="monospace">1</text>
      </svg>
    </div>
  )
}
