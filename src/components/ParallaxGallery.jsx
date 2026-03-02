import { useState, useEffect, useRef } from "react"

const V_W = 180, V_H = 240
const H_W = 270, H_H = 180

// Layout matches wireframe: top row (4 landscape), middle cluster, bottom row
const SLOTS = [
  // TOP ROW — left to right
  { id: 1,  o: "h", x: 22, y: 22, d: 0.012, src: `${import.meta.env.BASE_URL}images/IMG_1613.JPG` },         // coffee/food
  { id: 2,  o: "h", x: 38, y: 18, d: 0.022, src: `${import.meta.env.BASE_URL}images/R1-07774-016A.JPG` },    // beach running
  { id: 3,  o: "h", x: 56, y: 18, d: 0.016, src: `${import.meta.env.BASE_URL}images/IMG_1718.jpeg` },        // chihuly glass
  { id: 4,  o: "h", x: 73, y: 22, d: 0.028, src: `${import.meta.env.BASE_URL}images/DSC_6862.JPG` },         // three girls

  // MIDDLE CLUSTER
  { id: 5,  o: "v", x: 32, y: 52, d: 0.030, src: `${import.meta.env.BASE_URL}images/IMG_0689.JPG` },         // DJ graffiti train
  { id: 6,  o: "v", x: 44, y: 55, d: 0.020, src: `${import.meta.env.BASE_URL}images/100_0517_2.JPG` },       // barcelona rooftop
  { id: 7,  o: "h", x: 61, y: 50, d: 0.018, src: `${import.meta.env.BASE_URL}images/IMG_0575.jpeg` },        // concert red

  // BOTTOM ROW
  { id: 8,  o: "h", x: 21, y: 74, d: 0.014, src: `${import.meta.env.BASE_URL}images/R1-07774-005A.JPG` },    // SF coastline
  { id: 9,  o: "v", x: 38, y: 78, d: 0.025, src: `${import.meta.env.BASE_URL}images/IMG_0454.jpeg` },        // sunset lake
  { id: 10, o: "v", x: 56, y: 76, d: 0.032, src: `${import.meta.env.BASE_URL}images/KitKat_studio_Bharatanatyam-303.jpg` }, // dancer
  { id: 11, o: "v", x: 70, y: 68, d: 0.020, src: `${import.meta.env.BASE_URL}images/IMG_2916.png` },         // yosemite
]

export default function ParallaxGallery() {
  const mouseRef = useRef({ x: 0, y: 0 })
  const smoothRef = useRef({ x: 0, y: 0 })
  const [offsets, setOffsets] = useState(SLOTS.map(() => ({ x: 0, y: 0 })))
  const rafRef = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = {
        x: e.clientX - window.innerWidth / 2,
        y: e.clientY - window.innerHeight / 2,
      }
    }
    window.addEventListener("mousemove", onMove)

    const lerp = (a, b, t) => a + (b - a) * t
    const scale = (20 / 100) * 30

    const tick = () => {
      smoothRef.current.x = lerp(smoothRef.current.x, mouseRef.current.x, 0.04)
      smoothRef.current.y = lerp(smoothRef.current.y, mouseRef.current.y, 0.04)
      setOffsets(
        SLOTS.map((s) => ({
          x: smoothRef.current.x * s.d * scale,
          y: smoothRef.current.y * s.d * scale,
        }))
      )
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {SLOTS.map((s, i) => {
        const w = s.o === "v" ? V_W : H_W
        const h = s.o === "v" ? V_H : H_H
        const { x: ox, y: oy } = offsets[i]
        return (
          <div
            key={s.id}
            style={{
              position: "absolute",
              left: `calc(${s.x}% - ${w / 2}px)`,
              top: `calc(${s.y}% - ${h / 2}px)`,
              width: w,
              height: h,
              transform: `translate(${ox}px, ${oy}px)`,
              willChange: "transform",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <img
              src={s.src}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        )
      })}
    </div>
  )
}