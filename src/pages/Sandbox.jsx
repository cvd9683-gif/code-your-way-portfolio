import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { PROJECTS } from "../data/projects"
import ProjectCard from "../components/sandbox/ProjectCard"
import PreviewPanel from "../components/sandbox/PreviewPanel"
import LayoutSwitcher from "../components/sandbox/LayoutSwitcher"
import FreeformIntro from "../components/sandbox/FreeformIntro"
import VisualBrowse from "../components/sandbox/VisualBrowse"
import { computeTargets } from "../components/sandbox/layoutLogic"

// ----------------------------------------------------------------
// Sandbox — two modes, one shared project set.
//
//   freeform — open canvas. Drag cards, pan background, click a card
//              to open the full-screen overlay preview.
//   browse   — the organized archive. Switch between theme / type /
//              year; cards rearrange in place.
//
// Preview behavior is identical in both modes (PreviewPanel overlay).
// ----------------------------------------------------------------

const MODE_DESCRIPTIONS = {
  freeform: "open canvas · drag cards · pan background",
  browse: "three views · rearrange cards in place",
}

const CARD_SPRING = { type: "spring", stiffness: 180, damping: 26, mass: 0.85 }
const MIN_W = 180
const MIN_H = 160
const CLICK_THRESHOLD = 5

export default function Sandbox({ navigate }) {
  const [mode, setMode] = useState("freeform")
  const [previewId, setPreviewId] = useState(null)

  // Freeform persistent card state.
  const [freeformOffsets, setFreeformOffsets] = useState({})
  const [freeformSizes, setFreeformSizes] = useState(() => {
    const m = {}
    PROJECTS.forEach((p) => {
      m[p.id] = { w: p.freeform.w, h: p.freeform.h }
    })
    return m
  })

  // Freeform resize
  const resizeRef = useRef(null)
  const [resizingId, setResizingId] = useState(null)

  // Freeform canvas pan
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStartRef = useRef(null)

  // Press-vs-drag detection for card preview
  const pressRef = useRef(null)
  const [isPressing, setIsPressing] = useState(false)

  const [viewport, setViewport] = useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 1440,
    h: typeof window !== "undefined" ? window.innerHeight : 900,
  }))

  useEffect(() => {
    const onResize = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // ── Freeform resize ─────────────────────────────────────────────────
  useEffect(() => {
    if (!resizingId) return
    const onMove = (e) => {
      const r = resizeRef.current
      if (!r) return
      const dx = e.clientX - r.startX
      const dy = e.clientY - r.startY
      setFreeformSizes((prev) => ({
        ...prev,
        [r.id]: {
          w: Math.max(MIN_W, r.startW + dx),
          h: Math.max(MIN_H, r.startH + dy),
        },
      }))
    }
    const onUp = () => {
      resizeRef.current = null
      setResizingId(null)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [resizingId])

  const startResize = useCallback(
    (id, e) => {
      e.stopPropagation()
      const cur = freeformSizes[id] ?? { w: 280, h: 260 }
      resizeRef.current = {
        id,
        startX: e.clientX,
        startY: e.clientY,
        startW: cur.w,
        startH: cur.h,
      }
      setResizingId(id)
    },
    [freeformSizes],
  )

  // ── Freeform canvas pan ─────────────────────────────────────────────
  useEffect(() => {
    if (!isPanning) return
    const onMove = (e) => {
      const s = panStartRef.current
      if (!s) return
      setPanOffset({
        x: s.baseX + (e.clientX - s.startX),
        y: s.baseY + (e.clientY - s.startY),
      })
    }
    const onUp = () => {
      panStartRef.current = null
      setIsPanning(false)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [isPanning])

  const startPan = useCallback(
    (e) => {
      if (mode !== "freeform") return
      if (e.target !== e.currentTarget) return
      panStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        baseX: panOffset.x,
        baseY: panOffset.y,
      }
      setIsPanning(true)
    },
    [mode, panOffset],
  )

  // ── Click-vs-drag for freeform card preview ─────────────────────────
  useEffect(() => {
    if (!isPressing) return
    const onMove = (e) => {
      const s = pressRef.current
      if (!s || s.dragged) return
      const dx = Math.abs(e.clientX - s.x)
      const dy = Math.abs(e.clientY - s.y)
      if (dx > CLICK_THRESHOLD || dy > CLICK_THRESHOLD) s.dragged = true
    }
    const onUp = () => {
      const s = pressRef.current
      pressRef.current = null
      setIsPressing(false)
      if (!s) return
      if (!s.dragged) setPreviewId(s.id)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [isPressing])

  const onCardPointerDown = useCallback((id, e) => {
    pressRef.current = { id, x: e.clientX, y: e.clientY, dragged: false }
    setIsPressing(true)
  }, [])

  const onCardDragStart = useCallback(() => {
    const s = pressRef.current
    if (s) s.dragged = true
  }, [])

  // ── Card targets (Freeform only) ────────────────────────────────────
  const targets = useMemo(
    () =>
      computeTargets(mode, PROJECTS, viewport.w, viewport.h, {
        freeformOffsets,
        freeformSizes,
      }),
    [mode, viewport.w, viewport.h, freeformOffsets, freeformSizes],
  )

  // ── Mode change cleanup ────────────────────────────────────────────
  const handleModeChange = (next) => {
    setPreviewId(null)
    setMode(next)
  }

  // ── Freeform drag commit ───────────────────────────────────────────
  const commitFreeformDrag = useCallback((id, info) => {
    setFreeformOffsets((prev) => {
      const cur = prev[id] ?? { dx: 0, dy: 0 }
      return {
        ...prev,
        [id]: { dx: cur.dx + info.offset.x, dy: cur.dy + info.offset.y },
      }
    })
  }, [])

  const wrapOffset = mode === "freeform" ? panOffset : { x: 0, y: 0 }

  // Escape dismiss for preview.
  useEffect(() => {
    if (!previewId) return
    const onKey = (e) => {
      if (e.key === "Escape") setPreviewId(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [previewId])

  const previewProject = PROJECTS.find((p) => p.id === previewId)

  return (
    <div
      className={`sb-container sb-container--${mode}${
        mode === "freeform" && isPanning ? " sb-container--panning" : ""
      }`}
      onPointerDown={startPan}
    >
      {/* ── Top HUD ── */}
      <div className="sandbox-hud-top">
        <button className="sandbox-back" onClick={() => navigate("home")}>
          ← exit
        </button>
        <LayoutSwitcher mode={mode} onChange={handleModeChange} />
        <span className="sb-mode-desc">{MODE_DESCRIPTIONS[mode]}</span>
      </div>

      {/* ── Bottom HUD ── */}
      <div className="sandbox-hud-bottom">
        <span className="sandbox-count">
          {String(PROJECTS.length).padStart(2, "0")} projects
        </span>
      </div>

      {/* ── Freeform: shared card stage ── */}
      {mode === "freeform" && (
        <div className="sb-stage">
          <motion.div
            className="sb-pan-wrap"
            animate={{ x: wrapOffset.x, y: wrapOffset.y }}
            transition={
              isPanning
                ? { duration: 0 }
                : { type: "spring", stiffness: 260, damping: 30 }
            }
          >
            <AnimatePresence>
              <FreeformIntro viewport={viewport} />
            </AnimatePresence>

            {PROJECTS.map((p, i) => {
              const t = targets[p.id]
              if (!t) return null
              const isResizing = resizingId === p.id
              return (
                <motion.div
                  key={p.id}
                  className="sb-card-wrap"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "auto",
                  }}
                  drag={!isResizing}
                  dragMomentum={false}
                  dragElastic={0}
                  onPointerDown={(e) => onCardPointerDown(p.id, e)}
                  onDragStart={onCardDragStart}
                  onDragEnd={(e, info) => commitFreeformDrag(p.id, info)}
                  initial={{
                    x: t.x,
                    y: t.y,
                    width: t.w,
                    height: t.h,
                    rotate: t.rot,
                    scale: 0.94,
                    opacity: 0,
                    zIndex: t.z,
                  }}
                  animate={{
                    x: t.x,
                    y: t.y,
                    width: t.w,
                    height: t.h,
                    rotate: t.rot,
                    scale: t.scale,
                    opacity: t.opacity,
                    zIndex: t.z,
                  }}
                  transition={
                    isResizing
                      ? { duration: 0 }
                      : { ...CARD_SPRING, delay: i * 0.03 }
                  }
                >
                  <ProjectCard data={p} state="normal" showHint="click to preview" />
                  <div
                    className="sb-resize"
                    onPointerDown={(e) => startResize(p.id, e)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Resize card"
                  />
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      )}

      {/* ── Browse: organized view ── */}
      {mode === "browse" && (
        <VisualBrowse
          projects={PROJECTS}
          onProjectClick={(id) => setPreviewId(id)}
        />
      )}

      {/* ── Shared preview overlay ── */}
      <AnimatePresence>
        {previewProject && (
          <PreviewPanel
            project={previewProject}
            onClose={() => setPreviewId(null)}
            onMore={(route) => {
              setPreviewId(null)
              navigate(route)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
