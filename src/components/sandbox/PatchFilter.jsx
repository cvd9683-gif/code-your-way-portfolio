import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { PATCH_FILTERS } from "../../data/projects"
import ProjectCard from "./ProjectCard"

// ----------------------------------------------------------------
// Patch — drag-and-drop connection constellation.
//
// Three columns:
//   [ Bank ]  →  [ Mixing Space ]  →  [ Project Constellation ]
//
// Drag nodes from the bank into the mixing space. Each active node
// fans cables out to every project that carries its tag. Projects
// with more matches sort to the front and get a "strong" emphasis.
//
// Click on a bank node also adds it (accessibility fallback).
// `×` on each active chip removes it. Reset clears the canvas.
// A "view all projects" toggle below exposes everything as a grid.
// ----------------------------------------------------------------

const DRAG_MIME = "application/x-patch-filter"

export default function PatchFilter({ projects, onProjectClick }) {
  const [activeNodes, setActiveNodes] = useState([])
  const [hovering, setHovering] = useState(false)
  const [showAll, setShowAll] = useState(false)

  // ── Selection helpers ──────────────────────────────────────────────
  const add = (label) => {
    setActiveNodes((prev) => (prev.includes(label) ? prev : [...prev, label]))
  }
  const remove = (label) => {
    setActiveNodes((prev) => prev.filter((l) => l !== label))
  }
  const reset = () => setActiveNodes([])

  // ── Score & rank projects ──────────────────────────────────────────
  // score = how many active nodes a project carries.
  // Visible only when score > 0. Sorted by score desc; the top tier
  // (score === maxScore, when maxScore >= 2) is flagged "strong".
  const { visible, maxScore } = useMemo(() => {
    if (activeNodes.length === 0) return { visible: [], maxScore: 0 }
    const scored = projects.map((p) => {
      const score = (p.patchTags || []).filter((t) => activeNodes.includes(t))
        .length
      return { project: p, score }
    })
    const matched = scored.filter((s) => s.score > 0)
    matched.sort((a, b) => b.score - a.score)
    const max = matched.reduce((m, s) => Math.max(m, s.score), 0)
    return { visible: matched, maxScore: max }
  }, [projects, activeNodes])

  // ── Drag-and-drop handlers ─────────────────────────────────────────
  const onBankDragStart = (e, label) => {
    e.dataTransfer.setData(DRAG_MIME, label)
    e.dataTransfer.setData("text/plain", label) // safety fallback
    e.dataTransfer.effectAllowed = "copy"
  }
  const onSpaceDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }
  const onSpaceDragEnter = (e) => {
    e.preventDefault()
    setHovering(true)
  }
  const onSpaceDragLeave = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return
    setHovering(false)
  }
  const onSpaceDrop = (e) => {
    e.preventDefault()
    setHovering(false)
    const label =
      e.dataTransfer.getData(DRAG_MIME) || e.dataTransfer.getData("text/plain")
    if (label && PATCH_FILTERS.includes(label)) add(label)
  }

  // ── Cable geometry ─────────────────────────────────────────────────
  // For each (active node, matching project) pair, draw a bezier from
  // the node chip's port to the project card's port. Re-measure on
  // selection change, projects change, and viewport resize.
  const containerRef = useRef(null)
  const nodePortRefs = useRef({}) // by label
  const projectPortRefs = useRef({}) // by project id
  const [cables, setCables] = useState([])
  const [tick, setTick] = useState(0)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return
    const cRect = container.getBoundingClientRect()

    const next = []
    activeNodes.forEach((label) => {
      const startEl = nodePortRefs.current[label]
      if (!startEl) return
      const sRect = startEl.getBoundingClientRect()
      const sx = sRect.left - cRect.left + sRect.width / 2
      const sy = sRect.top - cRect.top + sRect.height / 2

      visible.forEach(({ project, score }) => {
        if (!project.patchTags?.includes(label)) return
        const endEl = projectPortRefs.current[project.id]
        if (!endEl) return
        const eRect = endEl.getBoundingClientRect()
        const ex = eRect.left - cRect.left + eRect.width / 2
        const ey = eRect.top - cRect.top + eRect.height / 2

        const dx = ex - sx
        const dy = ey - sy
        let d
        if (Math.abs(dx) >= Math.abs(dy)) {
          const cp = Math.max(50, Math.abs(dx) * 0.45)
          d = `M ${sx} ${sy} C ${sx + cp} ${sy}, ${ex - cp} ${ey}, ${ex} ${ey}`
        } else {
          const cp = Math.max(50, Math.abs(dy) * 0.45)
          d = `M ${sx} ${sy} C ${sx} ${sy + cp}, ${ex} ${ey - cp}, ${ex} ${ey}`
        }
        next.push({
          id: `${label}->${project.id}`,
          d,
          strong: score === maxScore && maxScore >= 2,
        })
      })
    })
    setCables(next)
  }, [activeNodes, visible, maxScore, tick])

  useEffect(() => {
    const onResize = () => setTick((t) => t + 1)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return (
    <div className="sb-patch-wrap">
      {/* ── Patch board ── */}
      <div className="sb-patch" ref={containerRef}>
        {/* Cables float above columns and ignore pointer events. */}
        <svg className="sb-patch__cables" aria-hidden>
          <AnimatePresence>
            {cables.map((c) => (
              <motion.path
                key={c.id}
                className={c.strong ? "sb-cable--strong" : "sb-cable"}
                d={c.d}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: c.strong ? 0.95 : 0.5 }}
                exit={{ pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>
        </svg>

        {/* ── Column 1 · Bank ── */}
        <section className="sb-patch__col sb-patch__bank">
          <header className="sb-patch__col-head">
            <span className="sb-patch__col-label">node bank</span>
            <span className="sb-patch__col-hint">drag to mix</span>
          </header>
          <ul className="sb-patch__bank-list">
            {PATCH_FILTERS.map((label) => {
              const isUsed = activeNodes.includes(label)
              return (
                <li key={label}>
                  <button
                    className={`sb-pnode${isUsed ? " sb-pnode--used" : ""}`}
                    draggable={!isUsed}
                    onDragStart={(e) => onBankDragStart(e, label)}
                    onClick={() => add(label)}
                    disabled={isUsed}
                    aria-label={
                      isUsed
                        ? `${label} (already in mixing space)`
                        : `Add ${label}`
                    }
                  >
                    <span className="sb-pnode__grip" aria-hidden>⋮⋮</span>
                    <span className="sb-pnode__label">{label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        {/* ── Column 2 · Mixing space ── */}
        <section
          className={`sb-patch__col sb-patch__space${
            hovering ? " sb-patch__space--hovering" : ""
          }${activeNodes.length === 0 ? " sb-patch__space--empty" : ""}`}
          onDragOver={onSpaceDragOver}
          onDragEnter={onSpaceDragEnter}
          onDragLeave={onSpaceDragLeave}
          onDrop={onSpaceDrop}
        >
          <header className="sb-patch__col-head">
            <span className="sb-patch__col-label">mixing space</span>
            <button
              className="sb-patch__reset"
              onClick={reset}
              disabled={activeNodes.length === 0}
            >
              ↺ reset canvas
            </button>
          </header>

          <div className="sb-patch__space-inner">
            {activeNodes.length === 0 ? (
              <div className="sb-patch__space-placeholder">
                <span className="sb-patch__space-icon" aria-hidden>↧</span>
                drag any node here
                <span className="sb-patch__space-sub">
                  reveal projects connected to your interests
                </span>
              </div>
            ) : (
              <ul className="sb-patch__chips">
                <AnimatePresence>
                  {activeNodes.map((label) => (
                    <motion.li
                      key={label}
                      layout
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.22 }}
                    >
                      <span className="sb-chip">
                        <span className="sb-chip__label">{label}</span>
                        <button
                          className="sb-chip__close"
                          onClick={() => remove(label)}
                          aria-label={`Remove ${label}`}
                        >
                          ×
                        </button>
                        <span
                          className="sb-chip__port"
                          ref={(el) => {
                            if (el) nodePortRefs.current[label] = el
                            else delete nodePortRefs.current[label]
                          }}
                          aria-hidden
                        />
                      </span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </section>

        {/* ── Column 3 · Constellation ── */}
        <section className="sb-patch__col sb-patch__constellation">
          <header className="sb-patch__col-head">
            <span className="sb-patch__col-label">constellation</span>
            <span className="sb-patch__count">
              {activeNodes.length === 0
                ? "drop a node to reveal"
                : `${visible.length} match${visible.length === 1 ? "" : "es"}`}
            </span>
          </header>

          <div className="sb-patch__stars">
            {activeNodes.length === 0 ? (
              <div className="sb-patch__stars-empty">
                projects will appear here
              </div>
            ) : visible.length === 0 ? (
              <div className="sb-patch__stars-empty">
                no projects connect to those nodes yet
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {visible.map(({ project, score }) => {
                  const isStrong = score === maxScore && maxScore >= 2
                  return (
                    <motion.button
                      key={project.id}
                      className={`sb-pcard${isStrong ? " sb-pcard--strong" : ""}`}
                      layout
                      initial={{ opacity: 0, scale: 0.92, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: 10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      onClick={() => onProjectClick?.(project.id)}
                    >
                      <span
                        className="sb-pcard__port"
                        ref={(el) => {
                          if (el) projectPortRefs.current[project.id] = el
                          else delete projectPortRefs.current[project.id]
                        }}
                        aria-hidden
                      />
                      <span className="sb-pcard__score" aria-hidden>
                        {score}/{activeNodes.length}
                      </span>
                      <ProjectCard
                        data={project}
                        state={isStrong ? "active" : "match"}
                        showHint="click to preview"
                      />
                    </motion.button>
                  )
                })}
              </AnimatePresence>
            )}
          </div>
        </section>
      </div>

      {/* ── Fallback: view all projects ── */}
      <div className="sb-patch__all">
        <button
          className="sb-patch__all-toggle"
          onClick={() => setShowAll((s) => !s)}
          aria-expanded={showAll}
        >
          {showAll ? "▴ hide all projects" : "▾ view all projects"}
          <span className="sb-patch__all-count">
            {projects.length} total
          </span>
        </button>

        <AnimatePresence initial={false}>
          {showAll && (
            <motion.div
              key="all-grid"
              className="sb-patch__all-grid-wrap"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
            >
              <div className="sb-patch__all-grid">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    className="sb-patch__all-card"
                    onClick={() => onProjectClick?.(p.id)}
                  >
                    <ProjectCard
                      data={p}
                      state="normal"
                      showHint="click to preview"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
