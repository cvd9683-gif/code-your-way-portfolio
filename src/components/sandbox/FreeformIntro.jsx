import { motion } from "framer-motion"

// ----------------------------------------------------------------
// FreeformIntro — a small, casual intro that anchors the sandbox.
//
// Lives inside the pan-wrap so it moves with the canvas (not a fixed
// hero). The title is rendered as segmented letter boxes that stagger
// in; the blurb fades in below. Pointer-events are disabled so users
// can pan right through the intro without catching on it.
// ----------------------------------------------------------------

const TITLE = "SANDBOX"
const BLURB = [
  "this is my sandbox.",
  "a space for experiments, playful ideas, and small creative explorations.",
  "drag things around, mess with it, make it yours.",
]

export default function FreeformIntro({ viewport }) {
  return (
    <motion.div
      className="sb-intro-anchor"
      style={{ left: viewport.w / 2, top: viewport.h / 2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      aria-hidden="true"
    >
      <div className="sb-intro">
        <h1 className="sb-intro__title">
          {TITLE.split("").map((c, i) => (
            <motion.span
              key={i}
              className="sb-intro__letter"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.5,
                ease: [0.2, 0.8, 0.2, 1],
                delay: 0.15 + i * 0.065,
              }}
            >
              {c}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="sb-intro__blurb"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.2, 0.8, 0.2, 1],
            delay: 0.15 + TITLE.length * 0.065 + 0.1,
          }}
        >
          {BLURB.map((line, i) => (
            <span key={i} className="sb-intro__line">
              {line}
            </span>
          ))}
        </motion.p>
      </div>
    </motion.div>
  )
}
