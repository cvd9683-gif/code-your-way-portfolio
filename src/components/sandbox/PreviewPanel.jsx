import { motion } from "framer-motion"

// ----------------------------------------------------------------
// Full-screen overlay preview. Opens when a card is clicked
// (not dragged). The canvas remains faintly visible behind a
// translucent backdrop so the user still feels anchored in the
// sandbox. Includes a "More →" action that routes to the project
// page, plus a close control + backdrop-click to dismiss.
//
// Props:
//   project   — project data
//   onClose   — () => void
//   onMore    — (route) => void
// ----------------------------------------------------------------

export default function PreviewPanel({ project, onClose, onMore }) {
  if (!project) return null

  return (
    <motion.div
      className="sb-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
    >
      <motion.div
        className="sb-overlay__panel"
        style={{ "--accent": project.accent }}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sb-overlay-title"
      >
        <div
          className="sb-overlay__hero"
          style={{ background: project.bgGradient }}
        >
          <div
            className="sb-overlay__shape"
            style={{ backgroundImage: project.bgShape }}
          />
          <div className="sb-overlay__hero-line" />
          <span className="sb-overlay__id">{project.id.toUpperCase()}</span>
          <button
            className="sb-overlay__close"
            onClick={onClose}
            aria-label="Close preview"
          >
            ×
          </button>
        </div>

        <div className="sb-overlay__body">
          <div className="sb-overlay__meta">
            <span className="sb-overlay__kicker">preview</span>
            <div className="sb-overlay__tags">
              {project.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>

          <h2 id="sb-overlay-title" className="sb-overlay__title">
            {project.title}
          </h2>

          <p className="sb-overlay__blurb">{project.blurb}</p>

          <div className="sb-overlay__actions">
            {project.route ? (
              <button
                className="sb-overlay__more"
                onClick={() => onMore(project.route)}
              >
                More →
              </button>
            ) : (
              <span className="sb-overlay__more sb-overlay__more--disabled">
                no page yet
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
