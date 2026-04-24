import { motion } from "framer-motion"

// ----------------------------------------------------------------
// Compact segmented control for switching between sandbox modes.
// Layout system matches the mono/caps HUD language already used
// elsewhere in the sandbox. Active indicator is a sliding pill
// using framer-motion's shared layoutId for smooth transit.
// ----------------------------------------------------------------

const MODES = [
  { id: "freeform", label: "Freeform" },
  { id: "browse", label: "Browse" },
]

export default function LayoutSwitcher({ mode, onChange }) {
  return (
    <div className="sb-switcher" role="tablist" aria-label="Layout mode">
      {MODES.map((m) => {
        const active = m.id === mode
        return (
          <button
            key={m.id}
            role="tab"
            aria-selected={active}
            className={`sb-switcher__item${
              active ? " sb-switcher__item--active" : ""
            }`}
            onClick={() => onChange(m.id)}
          >
            {active && (
              <motion.span
                layoutId="sb-switcher-indicator"
                className="sb-switcher__indicator"
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
              />
            )}
            <span className="sb-switcher__label">{m.label}</span>
          </button>
        )
      })}
    </div>
  )
}
