import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ProjectCard from "./ProjectCard"

// ----------------------------------------------------------------
// VisualBrowse — the organized browsing mode of the sandbox.
//
// All projects are always visible. The user switches between views
// (theme / type / year) and cards rearrange into different groupings
// with smooth motion. No shuffle, no filter-out: it's a rearrangement
// tool, not a reduction tool.
//
// Clicking a project card opens the same full-screen PreviewPanel
// used in Freeform, via the onProjectClick callback.
// ----------------------------------------------------------------

const VIEWS = [
  { id: "theme", label: "theme" },
  { id: "type", label: "type" },
  { id: "year", label: "year" },
]

const THEME_LABELS = {
  social: "Social & human",
  systems: "Systems & logic",
  experiment: "Experiments & play",
}

const TYPE_LABELS = {
  app: "Apps",
  experiment: "Experiments",
}

function groupBy(projects, view) {
  if (view === "theme") {
    const order = ["social", "systems", "experiment"]
    return order
      .map((k) => ({
        key: k,
        label: THEME_LABELS[k],
        items: projects.filter((p) => p.theme === k),
      }))
      .filter((g) => g.items.length)
  }
  if (view === "type") {
    const order = ["app", "experiment"]
    return order
      .map((k) => ({
        key: k,
        label: TYPE_LABELS[k],
        items: projects.filter((p) => p.type === k),
      }))
      .filter((g) => g.items.length)
  }
  if (view === "year") {
    const sorted = [...projects].sort(
      (a, b) => Number(b.year) - Number(a.year),
    )
    return [{ key: "timeline", label: "Timeline", items: sorted }]
  }
  return []
}

export default function VisualBrowse({ projects, onProjectClick }) {
  const [view, setView] = useState("theme")
  const groups = groupBy(projects, view)

  return (
    <div className="sb-browse">
      <header className="sb-browse__intro">
        <div className="sb-browse__head">
          <span className="sb-browse__kicker">browse the archive</span>
          <h1 className="sb-browse__title">
            Six projects. Three ways to look at them.
          </h1>
          <span className="sb-browse__sub">
            switch views · cards rearrange
          </span>
        </div>
        <div className="sb-browse__views" role="tablist" aria-label="Views">
          {VIEWS.map((v) => {
            const active = v.id === view
            return (
              <button
                key={v.id}
                role="tab"
                aria-selected={active}
                className={`sb-browse__view${
                  active ? " sb-browse__view--active" : ""
                }`}
                onClick={() => setView(v.id)}
                type="button"
              >
                {active && (
                  <motion.span
                    layoutId="sb-browse-view-indicator"
                    className="sb-browse__view-indicator"
                    transition={{
                      type: "spring",
                      stiffness: 340,
                      damping: 30,
                    }}
                  />
                )}
                <span className="sb-browse__view-label">{v.label}</span>
              </button>
            )
          })}
        </div>
      </header>

      <div className="sb-browse__surface">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {view === "year"
              ? groups.map((g) => (
                  <TimelineGroup
                    key={g.key}
                    label={g.label}
                    items={g.items}
                    onProjectClick={onProjectClick}
                  />
                ))
              : groups.map((g, i) => (
                  <GridGroup
                    key={g.key}
                    label={g.label}
                    items={g.items}
                    onProjectClick={onProjectClick}
                    stagger={i * 0.08}
                  />
                ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function GridGroup({ label, items, onProjectClick, stagger = 0 }) {
  return (
    <motion.section
      className="sb-browse__group"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: stagger,
        ease: [0.2, 0.8, 0.2, 1],
      }}
    >
      <div className="sb-browse__group-label">
        <span>{label}</span>
        <span className="sb-browse__group-count">
          {String(items.length).padStart(2, "0")} ·{" "}
          {items.length === 1 ? "project" : "projects"}
        </span>
      </div>
      <div className="sb-browse__grid">
        {items.map((p, i) => (
          <motion.button
            key={p.id}
            className="sb-browse__card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: stagger + i * 0.06,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            onClick={() => onProjectClick(p.id)}
            aria-label={`Open ${p.title} preview`}
            type="button"
          >
            <ProjectCard
              data={p}
              state="normal"
              showHint="click to preview"
            />
          </motion.button>
        ))}
      </div>
    </motion.section>
  )
}

function TimelineGroup({ label, items, onProjectClick }) {
  return (
    <motion.section
      className="sb-browse__group"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="sb-browse__group-label">
        <span>{label}</span>
        <span className="sb-browse__group-count">latest first</span>
      </div>
      <div className="sb-browse__timeline">
        {items.map((p, i) => (
          <motion.button
            key={p.id}
            className="sb-browse__row"
            style={{ borderLeftColor: p.accent, "--card-accent": p.accent }}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: i * 0.06,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            onClick={() => onProjectClick(p.id)}
            aria-label={`Open ${p.title} preview`}
            type="button"
          >
            <span
              className="sb-browse__row-year"
              style={{ color: p.accent }}
            >
              {p.year}
            </span>
            <div className="sb-browse__row-body">
              <h3 className="sb-browse__row-title">{p.title}</h3>
              <p className="sb-browse__row-blurb">{p.blurb}</p>
              <div className="sb-browse__row-tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.section>
  )
}
