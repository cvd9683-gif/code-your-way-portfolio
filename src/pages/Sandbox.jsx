import { useState, useEffect, useRef, useCallback } from "react"

const WORLD_W = 4000
const WORLD_H = 3000

const EXPERIMENTS = [
  {
    id: "001",
    title: "Motion Studies",
    annotation: "Timing, easing, and the physics of attention",
    detail: "An exploration of how motion communicates intent — the difference between instant and animated, snap and flow.",
    tags: ["animation", "interaction"],
    x: 1580, y: 1200,
    rot: -2.5,
  },
  {
    id: "002",
    title: "Type as Structure",
    annotation: "When letterforms become the layout",
    detail: "Typography treated as spatial element rather than content — scale, weight, and contrast as compositional tools.",
    tags: ["typography", "layout"],
    x: 2260, y: 860,
    rot: 1.2,
  },
  {
    id: "003",
    title: "Color Systems",
    annotation: "Generative palettes from constrained rules",
    detail: "Programmatic approaches to color that maintain aesthetic coherence while allowing variation and surprise.",
    tags: ["color", "generative"],
    x: 2780, y: 1400,
    rot: -1.8,
  },
  {
    id: "004",
    title: "Interface Concepts",
    annotation: "What if navigation felt like touch?",
    detail: "Spatial, gesture-driven interfaces that borrow from the physical — drag, throw, catch, hold.",
    tags: ["ux", "interaction"],
    x: 1880, y: 1880,
    rot: 2.0,
  },
  {
    id: "005",
    title: "Data Landscapes",
    annotation: "Turning numbers into terrain",
    detail: "Abstract visualization where the goal is intuition, not precision — emotional data display over analytical clarity.",
    tags: ["data", "visual"],
    x: 2520, y: 2060,
    rot: -0.8,
  },
  {
    id: "006",
    title: "Cursor Work",
    annotation: "The pointer as performer",
    detail: "Experiments treating the cursor as an active design element — magnetic, weighted, theatrical.",
    tags: ["interaction", "cursor"],
    x: 1260, y: 1580,
    rot: 1.8,
  },
  {
    id: "007",
    title: "Canvas Studies",
    annotation: "Generative mark-making systems",
    detail: "Canvas API explorations — noise fields, particle systems, and procedural drawing machines.",
    tags: ["canvas", "generative"],
    x: 2100, y: 1300,
    rot: -3.2,
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
    startX: 0,
    startY: 0,
    panX: 0,
    panY: 0,
    velX: 0,
    velY: 0,
    lastX: 0,
    lastY: 0,
    rafId: null,
    momentum: false,
  })

  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [hoveredId, setHoveredId] = useState(null)
  const [initialized, setInitialized] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const initX = vw / 2 - WORLD_W / 2
    const initY = vh / 2 - WORLD_H / 2
    stateRef.current.panX = initX
    stateRef.current.panY = initY
    setPan({ x: initX, y: initY })

    // Delay class apply so CSS transition fires
    const initTimer = setTimeout(() => setInitialized(true), 60)
    const hintTimer = setTimeout(() => setShowHint(false), 4200)
    return () => {
      clearTimeout(initTimer)
      clearTimeout(hintTimer)
    }
  }, [])

  const updateCoords = useCallback((panX, panY) => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    setCoords({
      x: Math.round(vw / 2 - panX - WORLD_W / 2),
      y: Math.round(vh / 2 - panY - WORLD_H / 2),
    })
  }, [])

  const animateMomentum = useCallback(() => {
    const s = stateRef.current
    if (!s.momentum) return
    s.velX *= 0.92
    s.velY *= 0.92
    s.panX += s.velX
    s.panY += s.velY
    setPan({ x: s.panX, y: s.panY })
    updateCoords(s.panX, s.panY)
    if (Math.abs(s.velX) < 0.15 && Math.abs(s.velY) < 0.15) {
      s.momentum = false
      return
    }
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
    if (e.target.closest("button, a")) return
    const s = stateRef.current
    s.isDragging = true
    s.momentum = false
    if (s.rafId) { cancelAnimationFrame(s.rafId); s.rafId = null }
    s.startX = e.clientX - s.panX
    s.startY = e.clientY - s.panY
    s.lastX = e.clientX
    s.lastY = e.clientY
    s.velX = 0
    s.velY = 0
    if (containerRef.current) containerRef.current.style.cursor = "grabbing"
  }, [])

  const onMouseMove = useCallback((e) => {
    const s = stateRef.current
    if (!s.isDragging) return
    s.velX = e.clientX - s.lastX
    s.velY = e.clientY - s.lastY
    s.lastX = e.clientX
    s.lastY = e.clientY
    s.panX = e.clientX - s.startX
    s.panY = e.clientY - s.startY
    setPan({ x: s.panX, y: s.panY })
    updateCoords(s.panX, s.panY)
  }, [updateCoords])

  // Touch support
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onTouchStart = (e) => {
      const touch = e.touches[0]
      const s = stateRef.current
      s.isDragging = true
      s.momentum = false
      if (s.rafId) { cancelAnimationFrame(s.rafId); s.rafId = null }
      s.startX = touch.clientX - s.panX
      s.startY = touch.clientY - s.panY
      s.lastX = touch.clientX
      s.lastY = touch.clientY
      s.velX = 0
      s.velY = 0
    }

    const onTouchMove = (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      const s = stateRef.current
      if (!s.isDragging) return
      s.velX = touch.clientX - s.lastX
      s.velY = touch.clientY - s.lastY
      s.lastX = touch.clientX
      s.lastY = touch.clientY
      s.panX = touch.clientX - s.startX
      s.panY = touch.clientY - s.startY
      setPan({ x: s.panX, y: s.panY })
      updateCoords(s.panX, s.panY)
    }

    const onTouchEnd = () => {
      const s = stateRef.current
      s.isDragging = false
      if (Math.abs(s.velX) > 0.4 || Math.abs(s.velY) > 0.4) {
        s.momentum = true
        s.rafId = requestAnimationFrame(animateMomentum)
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const s = stateRef.current
      s.momentum = false
      if (s.rafId) cancelAnimationFrame(s.rafId)
      if (containerRef.current) containerRef.current.style.cursor = ""
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="sandbox-container"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      {/* HUD — top bar */}
      <div className="sandbox-hud-top">
        <button className="sandbox-back" onClick={() => navigate("home")}>
          ← exit
        </button>
        <span className="sandbox-label-hud">SANDBOX</span>
        <span className="sandbox-coords">
          X&thinsp;{fmtCoord(coords.x)}&emsp;Y&thinsp;{fmtCoord(coords.y)}
        </span>
      </div>

      {/* Bottom count */}
      <div className="sandbox-hud-bottom">
        <span className="sandbox-count">
          {String(EXPERIMENTS.length).padStart(2, "0")} experiments in field
        </span>
      </div>

      {/* Drag hint */}
      <div className={`sandbox-hint${showHint ? "" : " sandbox-hint--hidden"}`}>
        drag to explore
      </div>

      {/* The pannable world */}
      <div
        className={`sandbox-world${initialized ? " sandbox-world--visible" : ""}`}
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
        {/* World center crosshair lines */}
        <div
          className="sandbox-axis sandbox-axis--h"
          style={{ top: WORLD_H / 2 }}
        />
        <div
          className="sandbox-axis sandbox-axis--v"
          style={{ left: WORLD_W / 2 }}
        />

        {/* Origin dot */}
        <div
          className="sandbox-origin-dot"
          style={{ left: WORLD_W / 2, top: WORLD_H / 2 }}
        />

        {/* Large faint field label */}
        <div
          className="sandbox-field-label"
          style={{ left: WORLD_W / 2, top: WORLD_H / 2 }}
        >
          FIELD
        </div>

        {/* Experiment fragments */}
        {EXPERIMENTS.map((exp) => {
          const active = hoveredId === exp.id
          return (
            <div
              key={exp.id}
              className={`sandbox-fragment${active ? " sandbox-fragment--active" : ""}`}
              style={{
                left: exp.x,
                top: exp.y,
                transform: `rotate(${exp.rot}deg)`,
              }}
              onMouseEnter={() => {
                if (!stateRef.current.isDragging) setHoveredId(exp.id)
              }}
              onMouseLeave={() => setHoveredId(null)}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <span className="sandbox-frag-id">{exp.id}</span>
              <h3 className="sandbox-frag-title">{exp.title}</h3>
              <p className="sandbox-frag-annotation">{exp.annotation}</p>
              <div className="sandbox-frag-tags">
                {exp.tags.map((t) => <span key={t}>{t}</span>)}
              </div>
              <p className="sandbox-frag-detail">{exp.detail}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
