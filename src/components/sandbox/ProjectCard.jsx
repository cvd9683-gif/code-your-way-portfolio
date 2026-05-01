import { useRef, useState, useCallback } from "react"

// ----------------------------------------------------------------
// Pure card visual. No positioning / no drag.
// - The parent <motion.div> drives position, size, rotation.
// - Clicks are handled by the parent via framer-motion's onTap
//   (onTap doesn't fire after a drag, which keeps drag + click safe).
//
// Props:
//   data      — project object from data/projects.js
//   state     — "normal" | "match" | "dim" | "active"
//               (set by Node mode; other modes always "normal")
//   showHint  — optional text in the top-right corner
// ----------------------------------------------------------------
export default function ProjectCard({ data, state = "normal", showHint }) {
  const ref = useRef(null)
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [hovered, setHovered] = useState(false)

  const onMouseMoveGlow = useCallback((e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }, [])

  return (
    <div
      ref={ref}
      className={`snode snode--card snode--fluid snode--${state}${
        hovered ? " snode--hovered" : ""
      }`}
      style={{
        "--gx": `${glowPos.x}%`,
        "--gy": `${glowPos.y}%`,
        "--accent": data.accent,
      }}
      onMouseMove={onMouseMoveGlow}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="snode-glow" />

      <div className="snode-img" style={{ background: data.bgGradient }}>
        <div
          className="snode-img-shape"
          style={{ backgroundImage: data.bgShape }}
        />
        <div className="snode-img-line" />
        <span className="snode-img-watermark">{data.id.toUpperCase()}</span>
      </div>

      <div className="snode-body">
        <h3 className="snode-title">{data.title}</h3>
        <p className="snode-blurb">{data.blurb}</p>
        <div className="snode-tags">
          {data.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      {showHint && <div className="snode-action-hint">{showHint}</div>}
    </div>
  )
}
