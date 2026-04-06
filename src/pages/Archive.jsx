import { useState, useRef } from "react"

const PROJECTS = [
  {
    id: "001",
    title: "ForkTales",
    tagline: "Social recipe platform, community-first",
    category: "Product",
    tags: ["Mobile App", "UX Research", "Interaction Design"],
    description:
      "A community-first recipe platform built around sharing meals and the stories behind them. Designed from early research through to final prototype.",
    color: "#C0553A",
    height: 130,
    target: "forktales",
  },
  {
    id: "002",
    title: "Clinic Catalyst",
    tagline: "Healthtech redesign, patient trust at scale",
    category: "Product",
    tags: ["Healthtech", "AI", "Web Design"],
    description:
      "AI-powered website redesign for a clinical research organization navigating patient trust, regulatory tone, and digital accessibility.",
    color: "#3A60A0",
    height: 115,
    target: "clinic-catalyst",
  },
  {
    id: "003",
    title: "Trader Goes",
    tagline: "Trader Joe's reimagined for mobile",
    category: "Product",
    tags: ["Mobile Concept", "Brand Extension"],
    description:
      "A mobile-first companion app that extends the Trader Joe's experience beyond the store — discovery, lists, and community.",
    color: "#3D7A4A",
    height: 100,
    target: "trader-goes",
  },
  {
    id: "004",
    title: "Venmo Split",
    tagline: "Group payments, rethought from context",
    category: "Product",
    tags: ["Fintech", "Mobile", "UX"],
    description:
      "Redesigning the Venmo group payment flow around shared context and social clarity, not just transactional logic.",
    color: "#5C44A0",
    height: 95,
    target: "venmo",
  },
  {
    id: "005",
    title: "Motion Studies",
    tagline: "Animation as communication",
    category: "Experiment",
    tags: ["Animation", "Interaction"],
    description:
      "Timing, easing, and the physics of attention. An ongoing study of when motion earns its keep and when it doesn't.",
    color: "#A03A3A",
    height: 88,
    target: null,
  },
  {
    id: "006",
    title: "Type as Structure",
    tagline: "Letterforms as spatial system",
    category: "Experiment",
    tags: ["Typography", "Composition"],
    description:
      "Typography treated as spatial element — scale, weight, and contrast as compositional tools rather than content delivery.",
    color: "#9A7A2A",
    height: 82,
    target: null,
  },
]

const SPINE_REST = 78
const SPINE_ACTIVE = 340
const SPINE_GAP = 2

/* ─── Navigation view ───────────────────────── */
function SpineNav({ onSelect, navigate }) {
  const [hovered, setHovered] = useState(null)
  const [labelY, setLabelY] = useState(0)
  const stackRef = useRef(null)

  const handleEnter = (i) => {
    setHovered(i)
    if (stackRef.current) {
      const rect = stackRef.current.getBoundingClientRect()
      let y = rect.top
      for (let j = 0; j < i; j++) y += PROJECTS[j].height + SPINE_GAP
      y += PROJECTS[i].height / 2
      setLabelY(y)
    }
  }

  const handleLeave = () => setHovered(null)

  return (
    <div className="sn-screen">
      {/* Back to portfolio home */}
      <button className="sn-home-btn" onClick={() => navigate("home")}>
        ← home
      </button>

      {/* Category index — left */}
      <div className="sn-cat-index">
        {["Product", "Experiment"].map((cat) => {
          const active = hovered !== null && PROJECTS[hovered].category === cat
          return (
            <span
              key={cat}
              className={`sn-cat-item${active ? " sn-cat-item--on" : ""}`}
            >
              {cat}
            </span>
          )
        })}
      </div>

      {/* Spine stack */}
      <div className="sn-stack" ref={stackRef}>
        {PROJECTS.map((p, i) => {
          const isActive = hovered === i
          const isDim = hovered !== null && !isActive
          return (
            <div
              key={p.id}
              className={[
                "sn-spine",
                isActive ? "sn-spine--on" : "",
                isDim ? "sn-spine--dim" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ backgroundColor: p.color, height: p.height }}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              onClick={() => onSelect(i)}
            >
              <span className="sn-spine-num">{p.id}</span>
            </div>
          )
        })}
      </div>

      {/* Floating label — right of stack */}
      <div
        className={`sn-label${hovered !== null ? " sn-label--visible" : ""}`}
        style={{ top: labelY }}
      >
        {hovered !== null && (
          <>
            <span className="sn-label-title">{PROJECTS[hovered].title}</span>
            <span className="sn-label-tagline">{PROJECTS[hovered].tagline}</span>
            <span className="sn-label-hint">
              {PROJECTS[hovered].target ? "click to open →" : "experiment"}
            </span>
          </>
        )}
      </div>

      {/* Bottom count */}
      <div className="sn-foot">
        {String(PROJECTS.length).padStart(2, "0")}&thinsp;works
      </div>
    </div>
  )
}

/* ─── Detail view ───────────────────────────── */
function SpineDetail({ project, selectedIndex, allProjects, onBack, navigate }) {
  return (
    <div className="sd-screen">
      {/* Left spine column — all projects compressed */}
      <div className="sd-col">
        {allProjects.map((p, i) => (
          <div
            key={p.id}
            className={`sd-strip${i === selectedIndex ? " sd-strip--on" : ""}`}
            style={{ backgroundColor: p.color }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="sd-main">
        <button className="sd-back" onClick={onBack}>
          ← back
        </button>

        {/* Hero — project color fills the upper section */}
        <div className="sd-hero" style={{ backgroundColor: project.color }}>
          <div className="sd-hero-text">
            <span className="sd-hero-id">{project.id}</span>
            <h1 className="sd-hero-title">{project.title}</h1>
          </div>
        </div>

        {/* Metadata strip */}
        <div className="sd-meta">
          <div className="sd-meta-tags">
            {project.tags.map((t) => (
              <span key={t} className="sd-tag">{t}</span>
            ))}
          </div>
          <p className="sd-desc">{project.description}</p>
          <div className="sd-actions">
            {project.target ? (
              <button
                className="sd-cta"
                onClick={() => navigate(project.target)}
              >
                View case study →
              </button>
            ) : (
              <span className="sd-wip">In progress</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Root ──────────────────────────────────── */
export default function Archive({ navigate }) {
  const [view, setView] = useState("nav")
  const [selected, setSelected] = useState(null)

  const handleSelect = (i) => {
    setSelected(i)
    setView("detail")
  }

  const handleBack = () => {
    setSelected(null)
    setView("nav")
  }

  if (view === "detail" && selected !== null) {
    return (
      <SpineDetail
        project={PROJECTS[selected]}
        selectedIndex={selected}
        allProjects={PROJECTS}
        onBack={handleBack}
        navigate={navigate}
      />
    )
  }

  return <SpineNav onSelect={handleSelect} navigate={navigate} />
}
