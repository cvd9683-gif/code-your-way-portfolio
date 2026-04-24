// ----------------------------------------------------------------
// Pure functions that compute card target positions for Freeform mode.
// Browse mode renders cards via its own component (VisualBrowse) and
// does not use the shared card stage.
//
// Each target: { x, y, w, h, rot, scale, opacity, z }
// Coordinates are absolute within the fixed-viewport sandbox container.
// ----------------------------------------------------------------

export function computeFreeformTargets(projects, vw, vh, offsets, sizes) {
  const cx = vw / 2
  const cy = vh / 2 + 10

  const out = {}
  projects.forEach((p) => {
    const f = p.freeform
    const off = offsets?.[p.id] ?? { dx: 0, dy: 0 }
    const sz = sizes?.[p.id] ?? { w: f.w, h: f.h }
    out[p.id] = {
      x: cx + f.dx + off.dx - sz.w / 2,
      y: cy + f.dy + off.dy - sz.h / 2,
      w: sz.w,
      h: sz.h,
      rot: f.rot,
      scale: 1,
      opacity: 1,
      z: 1,
    }
  })
  return out
}

// Kept for parity with existing callers, dispatches only freeform now.
export function computeTargets(mode, projects, vw, vh, state) {
  if (mode === "freeform") {
    return computeFreeformTargets(
      projects,
      vw,
      vh,
      state.freeformOffsets,
      state.freeformSizes,
    )
  }
  return {}
}
