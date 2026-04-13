import { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import ProjectNode from "../components/ProjectNode"

const WORLD_W = 5000
const WORLD_H = 4000
const ALIGN_THRESH = 22 // px — magnetic snap zone

const PROJECTS = [
  {
    id: "forktales",
    route: "forktales",
    title: "ForkTales",
    blurb: "Social cooking app where daily prompts and team feasts turn meals into shared rituals.",
    tags: ["Mobile", "Social", "Interaction"],
    x: 1360, y: 1220, w: 290, h: 265,
    rot: -1.5,
    accent: "#c8a96e",
    bgGradient: "linear-gradient(140deg, #1e160a 0%, #2c1e0f 45%, #1a1208 100%)",
    bgShape: "radial-gradient(ellipse 65% 50% at 72% 30%, rgba(200,169,110,0.28) 0%, transparent 70%)",
  },
  {
    id: "clinic-catalyst",
    route: "clinic-catalyst",
    title: "ClinicCatalyst",
    blurb: "Clinical workflow tool designed around the real rhythms of care teams.",
    tags: ["Health", "Systems", "UX"],
    x: 2100, y: 870, w: 290, h: 265,
    rot: 1.2,
    accent: "#6ec8b8",
    bgGradient: "linear-gradient(140deg, #08181a 0%, #0f2224 45%, #061416 100%)",
    bgShape: "radial-gradient(ellipse 50% 70% at 28% 62%, rgba(110,200,184,0.25) 0%, transparent 70%)",
  },
  {
    id: "trader-goes",
    route: "trader-goes",
    title: "TraderGoes",
    blurb: "Emotional intelligence layer for retail investing — think before you tap.",
    tags: ["Fintech", "Behavioral"],
    x: 2760, y: 1300, w: 290, h: 265,
    rot: -0.8,
    accent: "#c86e9a",
    bgGradient: "linear-gradient(140deg, #180e14 0%, #240e1c 45%, #120a10 100%)",
    bgShape: "radial-gradient(ellipse 70% 45% at 52% 68%, rgba(200,110,154,0.23) 0%, transparent 70%)",
  },
  {
    id: "venmo",
    route: "venmo",
    title: "Venmo Redesign",
    blurb: "Rethinking social payments for Gen Z — cleaner, clearer, more human.",
    tags: ["Fintech", "Mobile", "Social"],
    x: 1680, y: 1800, w: 290, h: 265,
    rot: 2.0,
    accent: "#6e9ac8",
    bgGradient: "linear-gradient(140deg, #0a0e18 0%, #0e1426 45%, #080c18 100%)",
    bgShape: "radial-gradient(ellipse 60% 60% at 40% 38%, rgba(110,154,200,0.25) 0%, transparent 70%)",
  },
  {
    id: "motion-studies",
    route: "motion-studies",
    title: "Motion Studies",
    blurb: "Timing, easing, and the physics of attention in interface design.",
    tags: ["Animation", "Interaction"],
    x: 2440, y: 1820, w: 265, h: 250,
    rot: -2.5,
    accent: "#a0a0a0",
    bgGradient: "linear-gradient(140deg, #0e0e0e 0%, #1c1c1c 50%, #0a0a0a 100%)",
    bgShape: "radial-gradient(ellipse 80% 35% at 50% 50%, rgba(160,160,160,0.14) 0%, transparent 70%)",
  },
  {
    id: "cursor-work",
    route: null,
    title: "Cursor Work",
    blurb: "The pointer as performer — magnetic, weighted, theatrical.",
    tags: ["Interaction", "Cursor"],
    x: 3060, y: 940, w: 255, h: 250,
    rot: 1.8,
    accent: "#b8a0d4",
    bgGradient: "linear-gradient(140deg, #100a18 0%, #1c1228 45%, #0c0810 100%)",
    bgShape: "radial-gradient(ellipse 55% 55% at 60% 40%, rgba(184,160,212,0.22) 0%, transparent 70%)",
  },
]

function fmtCoord(n) {
  const sign = n >= 0 ? "+" : "−"
  return `${sign}${Math.abs(n).toString().padStart(4, "0")}`
}

export default function Sandbox({ navigate }) {
  const containerRef = useRef(null)
  const stateRef = useRef({
    isDragging: false,
    startX: 0, startY: 0,
    panX: 0, panY: 0,
    velX: 0, velY: 0,
    lastX: 0, lastY: 0,
    rafId: null, momentum: false,
  })

  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [initialized, setInitialized] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [expandedId, setExpandedId] = useState(null)
  const [draggingId, setDraggingId] = useState(null)
  const [guides, setGuides] = useState({ h: null, v: null })

  // Node positions live here so we can do cross-node alignment
  const [nodePos, setNodePos] = useState(() => {
    const m = {}
    PROJECTS.forEach((p) => { m[p.id] = { x: p.x, y: p.y, w: p.w, h: p.h } })
    return m
  })

  // ── Canvas pan ──────────────────────────────────────────────
  useEffect(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const ix = vw / 2 - WORLD_W / 2
    const iy = vh / 2 - WORLD_H / 2
    stateRef.current.panX = ix
    stateRef.current.panY = iy
    setPan({ x: ix, y: iy })
    const t1 = setTimeout(() => setInitialized(true), 60)
    const t2 = setTimeout(() => setShowHint(false), 4500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const updateCoords = useCallback((px, py) => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    setCoords({
      x: Math.round(vw / 2 - px - WORLD_W / 2),
      y: Math.round(vh / 2 - py - WORLD_H / 2),
    })
  }, [])

  const animateMomentum = useCallback(() => {
    const s = stateRef.current
    if (!s.momentum) return
    s.velX *= 0.92; s.velY *= 0.92
    s.panX += s.velX; s.panY += s.velY
    setPan({ x: s.panX, y: s.panY })
    updateCoords(s.panX, s.panY)
    if (Math.abs(s.velX) < 0.15 && Math.abs(s.velY) < 0.15) { s.momentum = false; return }
    s.rafId = requestAnimationFrame(animateMomentum)
  }, [updateCoords])

  const stopDrag = useCallback(() => {
    const s = stateRef.current
    if (!s.isDragging) return
    s.isDragging = false
    if (containerRef.current) containerRef.current.style.cursor = ""
    if (Math.abs(s.velX) > 0.4 || Math.abs(s.velY) > 0.4) {
      s.momentum = true
      s.rafId = requestAnimationFrame(animateMomentum)
    }
  }, [animateMomentum])

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    if (e.target.closest(".snode")) return
    if (e.target.closest("button, a")) return
    const s = stateRef.current
    s.isDragging = true; s.momentum = false
    if (s.rafId) { cancelAnimationFrame(s.rafId); s.rafId = null }
    s.startX = e.clientX - s.panX; s.startY = e.clientY - s.panY
    s.lastX = e.clientX; s.lastY = e.clientY
    s.velX = 0; s.velY = 0
    if (containerRef.current) containerRef.current.style.cursor = "grabbing"
  }, [])

  const onMouseMove = useCallback((e) => {
    const s = stateRef.current
    if (!s.isDragging) return
    s.velX = e.clientX - s.lastX; s.velY = e.clientY - s.lastY
    s.lastX = e.clientX; s.lastY = e.clientY
    s.panX = e.clientX - s.startX; s.panY = e.clientY - s.startY
    setPan({ x: s.panX, y: s.panY })
    updateCoords(s.panX, s.panY)
  }, [updateCoords])

  // Touch support
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onTouchStart = (e) => {
      const t = e.touches[0]; const s = stateRef.current
      s.isDragging = true; s.momentum = false
      if (s.rafId) { cancelAnimationFrame(s.rafId); s.rafId = null }
      s.startX = t.clientX - s.panX; s.startY = t.clientY - s.panY
      s.lastX = t.clientX; s.lastY = t.clientY
      s.velX = 0; s.velY = 0
    }
    const onTouchMove = (e) => {
      e.preventDefault()
      const t = e.touches[0]; const s = stateRef.current
      if (!s.isDragging) return
      s.velX = t.clientX - s.lastX; s.velY = t.clientY - s.lastY
      s.lastX = t.clientX; s.lastY = t.clientY
      s.panX = t.clientX - s.startX; s.panY = t.clientY - s.startY
      setPan({ x: s.panX, y: s.panY })
      updateCoords(s.panX, s.panY)
    }
    const onTouchEnd = () => {
      const s = stateRef.current; s.isDragging = false
      if (Math.abs(s.velX) > 0.4 || Math.abs(s.velY) > 0.4) {
        s.momentum = true; s.rafId = requestAnimationFrame(animateMomentum)
      }
    }
    el.addEventListener("touchstart", onTouchStart, { passive: false })
    el.addEventListener("touchmove", onTouchMove, { passive: false })
    el.addEventListener("touchend", onTouchEnd)
    return () => {
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchmove", onTouchMove)
      el.removeEventListener("touchend", onTouchEnd)
    }
  }, [animateMomentum, updateCoords])

  useEffect(() => {
    return () => {
      const s = stateRef.current; s.momentum = false
      if (s.rafId) cancelAnimationFrame(s.rafId)
    }
  }, [])

  // ── Node drag callbacks ──────────────────────────────────────
  const handleNodeDragStart = useCallback((id) => {
    setDraggingId(id)
    const s = stateRef.current
    s.momentum = false
    if (s.rafId) { cancelAnimationFrame(s.rafId); s.rafId = null }
  }, [])

  const handleNodeDrag = useCallback(
    (id, nx, ny) => {
      // Magnetic alignment — check edges/centers of all other nodes
      const others = PROJECTS.filter((p) => p.id !== id)
      let sx = nx, sy = ny
      let guideH = null, guideV = null

      const cur = nodePos[id]
      const w = cur.w, h = cur.h
      const cx = nx + w / 2, cy = ny + h / 2

      others.forEach((other) => {
        const op = nodePos[other.id]
        const ow = op.w, oh = op.h

        // Horizontal (y) snaps: top↔top, center↔center, bottom↔bottom
        const hSnaps = [
          [ny, op.y],
          [cy, op.y + oh / 2],
          [ny + h, op.y + oh],
        ]
        hSnaps.forEach(([mine, theirs]) => {
          if (Math.abs(mine - theirs) < ALIGN_THRESH) {
            sy += (theirs - mine) * 0.6
            guideH = theirs
          }
        })

        // Vertical (x) snaps: left↔left, center↔center, right↔right
        const vSnaps = [
          [nx, op.x],
          [cx, op.x + ow / 2],
          [nx + w, op.x + ow],
        ]
        vSnaps.forEach(([mine, theirs]) => {
          if (Math.abs(mine - theirs) < ALIGN_THRESH) {
            sx += (theirs - mine) * 0.6
            guideV = theirs
          }
        })
      })

      setGuides({ h: guideH, v: guideV })
      setNodePos((prev) => ({ ...prev, [id]: { ...prev[id], x: sx, y: sy } }))
    },
    [nodePos],
  )

  const handleNodeDragEnd = useCallback((id) => {
    setDraggingId(null)
    setGuides({ h: null, v: null })
  }, [])

  const handleNodeResize = useCallback((id, w, h) => {
    setNodePos((prev) => ({ ...prev, [id]: { ...prev[id], w, h } }))
  }, [])

  const expandedProject = PROJECTS.find((p) => p.id === expandedId)

  return (
    <div
      ref={containerRef}
      className="sandbox-container"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      {/* ── HUD top ── */}
      <div className="sandbox-hud-top">
        <button className="sandbox-back" onClick={() => navigate("home")}>
          ← exit
        </button>
        <span className="sandbox-label-hud">SANDBOX</span>
        <span className="sandbox-coords">
          X&thinsp;{fmtCoord(coords.x)}&emsp;Y&thinsp;{fmtCoord(coords.y)}
        </span>
      </div>

      {/* ── HUD bottom ── */}
      <div className="sandbox-hud-bottom">
        <span className="sandbox-count">
          {String(PROJECTS.length).padStart(2, "0")} projects in field
        </span>
      </div>

      {/* ── Drag hint ── */}
      <div className={`sandbox-hint${showHint ? "" : " sandbox-hint--hidden"}`}>
        drag canvas to explore&ensp;·&ensp;click nodes to preview
      </div>

      {/* ── Pannable world ── */}
      <div
        className={`sandbox-world${initialized ? " sandbox-world--visible" : ""}`}
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
        {/* Crosshairs */}
        <div className="sandbox-axis sandbox-axis--h" style={{ top: WORLD_H / 2 }} />
        <div className="sandbox-axis sandbox-axis--v" style={{ left: WORLD_W / 2 }} />
        <div
          className="sandbox-origin-dot"
          style={{ left: WORLD_W / 2, top: WORLD_H / 2 }}
        />

        {/* Watermark */}
        <div
          className="sandbox-field-label"
          style={{ left: WORLD_W / 2, top: WORLD_H / 2 }}
        >
          SANDBOX
        </div>

        {/* Magnetic alignment guides */}
        {guides.h !== null && (
          <div className="sandbox-guide sandbox-guide--h" style={{ top: guides.h }} />
        )}
        {guides.v !== null && (
          <div className="sandbox-guide sandbox-guide--v" style={{ left: guides.v }} />
        )}

        {/* Project nodes */}
        {PROJECTS.map((project) => (
          <ProjectNode
            key={project.id}
            data={project}
            pos={nodePos[project.id]}
            onDragStart={handleNodeDragStart}
            onDrag={handleNodeDrag}
            onDragEnd={handleNodeDragEnd}
            onResize={handleNodeResize}
            onExpand={setExpandedId}
            navigate={navigate}
            isDragging={draggingId === project.id}
          />
        ))}
      </div>

      {/* ── Expanded overlay ── */}
      <AnimatePresence>
        {expandedProject && (
          <motion.div
            className="snode-overlay-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setExpandedId(null)}
          >
            <motion.div
              className="snode-overlay-panel"
              style={{ "--accent": expandedProject.accent }}
              initial={{ y: 28, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 18, opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Hero image block */}
              <div
                className="snode-overlay-hero"
                style={{ background: expandedProject.bgGradient }}
              >
                <div
                  className="snode-overlay-bg-shape"
                  style={{ backgroundImage: expandedProject.bgShape }}
                />
                <span className="snode-overlay-hero-num">
                  {String(PROJECTS.indexOf(expandedProject) + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Info */}
              <div className="snode-overlay-info">
                <div className="snode-overlay-tags">
                  {expandedProject.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <h2 className="snode-overlay-title">{expandedProject.title}</h2>
                <p className="snode-overlay-blurb">{expandedProject.blurb}</p>

                <div className="snode-overlay-actions">
                  {expandedProject.route && (
                    <button
                      className="snode-overlay-cta"
                      onClick={() => {
                        setExpandedId(null)
                        navigate(expandedProject.route)
                      }}
                    >
                      View Case Study →
                    </button>
                  )}
                  <button
                    className="snode-overlay-close"
                    onClick={() => setExpandedId(null)}
                  >
                    close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
