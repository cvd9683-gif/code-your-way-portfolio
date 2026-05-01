import { useRef, useState, useCallback, useEffect } from "react"

export default function ProjectNode({
  data,
  pos,
  onDragStart,
  onDrag,
  onDragEnd,
  onResize,
  onExpand,
  navigate,
  isDragging,
}) {
  const nodeRef = useRef(null)
  const dragRef = useRef({ active: false, startCX: 0, startCY: 0, startX: 0, startY: 0 })
  const resizeRef = useRef({ active: false, startW: 0, startH: 0, startCX: 0, startCY: 0 })
  const clickTimerRef = useRef(null)
  const hasDraggedRef = useRef(false)

  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [hovered, setHovered] = useState(false)

  // Track cursor inside node for contained glow
  const onMouseMoveGlow = useCallback((e) => {
    if (!nodeRef.current) return
    const rect = nodeRef.current.getBoundingClientRect()
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }, [])

  // Global mouse move / up for drag + resize
  useEffect(() => {
    const onMove = (e) => {
      if (dragRef.current.active) {
        const dx = e.clientX - dragRef.current.startCX
        const dy = e.clientY - dragRef.current.startCY
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDraggedRef.current = true
        onDrag(data.id, dragRef.current.startX + dx, dragRef.current.startY + dy)
      }
      if (resizeRef.current.active) {
        const dx = e.clientX - resizeRef.current.startCX
        const dy = e.clientY - resizeRef.current.startCY
        onResize(
          data.id,
          Math.max(180, resizeRef.current.startW + dx),
          Math.max(150, resizeRef.current.startH + dy),
        )
      }
    }
    const onUp = () => {
      if (dragRef.current.active) {
        dragRef.current.active = false
        onDragEnd(data.id)
      }
      resizeRef.current.active = false
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [data.id, onDrag, onDragEnd, onResize])

  const onMouseDown = useCallback(
    (e) => {
      if (e.button !== 0) return
      if (e.target.closest(".snode-resize")) return
      e.stopPropagation()
      hasDraggedRef.current = false
      dragRef.current = {
        active: true,
        startCX: e.clientX,
        startCY: e.clientY,
        startX: pos.x,
        startY: pos.y,
      }
      onDragStart(data.id)
    },
    [data.id, pos.x, pos.y, onDragStart],
  )

  const onClick = useCallback(() => {
    if (hasDraggedRef.current) return
    if (clickTimerRef.current) {
      // double-click → navigate
      clearTimeout(clickTimerRef.current)
      clickTimerRef.current = null
      if (data.route) navigate(data.route)
    } else {
      // single-click → expand overlay (after short delay to catch dbl)
      clickTimerRef.current = setTimeout(() => {
        clickTimerRef.current = null
        onExpand(data.id)
      }, 220)
    }
  }, [data.id, data.route, navigate, onExpand])

  const onResizeMouseDown = useCallback(
    (e) => {
      e.stopPropagation()
      e.preventDefault()
      resizeRef.current = {
        active: true,
        startW: pos.w,
        startH: pos.h,
        startCX: e.clientX,
        startCY: e.clientY,
      }
    },
    [pos.w, pos.h],
  )

  return (
    <div
      ref={nodeRef}
      className={`snode${isDragging ? " snode--dragging" : ""}${hovered ? " snode--hovered" : ""}`}
      style={{
        left: pos.x,
        top: pos.y,
        width: pos.w,
        height: pos.h,
        transform: `rotate(${data.rot}deg)`,
        "--gx": `${glowPos.x}%`,
        "--gy": `${glowPos.y}%`,
        "--accent": data.accent,
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMoveGlow}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Contained glow — clipped by overflow:hidden on .snode */}
      <div className="snode-glow" />

      {/* Abstract image block */}
      <div
        className="snode-img"
        style={{ background: data.bgGradient }}
      >
        <div className="snode-img-shape" style={{ backgroundImage: data.bgShape }} />
        <div className="snode-img-line" />
        <span className="snode-img-watermark">{data.id.toUpperCase()}</span>
      </div>

      {/* Text body */}
      <div className="snode-body">
        <h3 className="snode-title">{data.title}</h3>
        <p className="snode-blurb">{data.blurb}</p>
        <div className="snode-tags">
          {data.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      {/* Hover hint */}
      <div className="snode-action-hint">
        {data.route ? "click · ×2 to open" : "click to preview"}
      </div>

      {/* Resize corner */}
      <div className="snode-resize" onMouseDown={onResizeMouseDown} />
    </div>
  )
}
