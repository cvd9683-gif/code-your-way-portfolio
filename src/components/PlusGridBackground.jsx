import { useEffect, useRef } from "react"

export default function PlusGridBackground({
  gridSpacing = 28,
  plusSize = 14,
  backgroundColor = "transparent",
  baseColor = "#1F1F1F",
  influenceRadius = 84,
  lerpSpeed = 0.08,
  magnetStrength = 10,
}) {
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const stateRef = useRef({
    mouse: { x: -9999, y: -9999 },
    rotations: {},
    offsets: {},
    rafId: 0,
    running: false,
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrapper || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const s = stateRef.current

    const setSize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = wrapper.offsetWidth
      const h = wrapper.offsetHeight
      if (!w || !h) return
      s.width = w
      s.height = h
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      if (!s.running) return
      const W = s.width
      const H = s.height
      if (!W || !H) { s.rafId = requestAnimationFrame(draw); return }

      const mx = s.mouse.x
      const my = s.mouse.y

      ctx.clearRect(0, 0, W, H)

      const cols = Math.ceil(W / gridSpacing) + 1
      const rows = Math.ceil(H / gridSpacing) + 1
      const offsetX = (W % gridSpacing) / 2
      const offsetY = (H % gridSpacing) / 2

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cx = offsetX + col * gridSpacing
          const cy = offsetY + row * gridSpacing
          const key = col + "," + row

          const dx = mx - cx
          const dy = my - cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          const proximity = Math.max(0, 1 - dist / influenceRadius)

          // rotation
          const angleToMouse = Math.atan2(dy, dx) + Math.PI / 4
          const weightedTarget = proximity > 0 ? angleToMouse * proximity : 0
          if (s.rotations[key] === undefined) s.rotations[key] = 0
          let current = s.rotations[key]
          let delta = weightedTarget - current
          while (delta > Math.PI) delta -= Math.PI * 2
          while (delta < -Math.PI) delta += Math.PI * 2
          s.rotations[key] = current + delta * lerpSpeed

          // magnetic offset
          const norm = dist > 0 ? dist : 1
          const targetOX = proximity > 0 ? (dx / norm) * proximity * magnetStrength : 0
          const targetOY = proximity > 0 ? (dy / norm) * proximity * magnetStrength : 0
          if (!s.offsets[key]) s.offsets[key] = { x: 0, y: 0 }
          s.offsets[key].x += (targetOX - s.offsets[key].x) * lerpSpeed
          s.offsets[key].y += (targetOY - s.offsets[key].y) * lerpSpeed

          const halfArm = plusSize / 2
          ctx.save()
          ctx.translate(cx + s.offsets[key].x, cy + s.offsets[key].y)
          ctx.rotate(s.rotations[key])
          ctx.strokeStyle = baseColor
          ctx.lineWidth = 1.5
          ctx.lineCap = "round"
          ctx.beginPath()
          ctx.moveTo(-halfArm, 0)
          ctx.lineTo(halfArm, 0)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(0, -halfArm)
          ctx.lineTo(0, halfArm)
          ctx.stroke()
          ctx.restore()
        }
      }

      s.rafId = requestAnimationFrame(draw)
    }

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      s.mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onMouseLeave = () => { s.mouse = { x: -9999, y: -9999 } }

    const ro = new ResizeObserver(() => setSize())
    ro.observe(wrapper)
    setSize()
    s.running = true
    s.rafId = requestAnimationFrame(draw)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseleave", onMouseLeave)

    return () => {
      s.running = false
      cancelAnimationFrame(s.rafId)
      ro.disconnect()
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [gridSpacing, plusSize, backgroundColor, baseColor, influenceRadius, lerpSpeed, magnetStrength])

  return (
    <div ref={wrapperRef} style={{ width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  )
}