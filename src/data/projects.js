// ----------------------------------------------------------------
// Shared project data for the sandbox.
// One source of truth used by both modes (Freeform + Browse).
//
// Per-project fields:
//   id, route, title, blurb      — identity / copy
//   tags                         — small display tags on the card
//   keywords                     — tags used for filtering / grouping
//   accent, bgGradient, bgShape  — visual theme
//   freeform                     — scatter position & size in Freeform mode
//   theme, type, year            — metadata surfaced in Visual Browse
// ----------------------------------------------------------------

export const PROJECTS = [
  {
    id: "forktales",
    route: "forktales",
    title: "ForkTales",
    blurb:
      "Social cooking app where daily prompts and team feasts turn meals into shared rituals.",
    tags: ["Mobile", "Social", "Interaction"],
    keywords: ["interaction", "play", "emotion", "storytelling"],
    accent: "#c8a96e",
    bgGradient:
      "linear-gradient(140deg, #1e160a 0%, #2c1e0f 45%, #1a1208 100%)",
    bgShape:
      "radial-gradient(ellipse 65% 50% at 72% 30%, rgba(200,169,110,0.28) 0%, transparent 70%)",
    freeform: { dx: -720, dy: -180, w: 290, h: 260, rot: -3.4 },
    theme: "social",
    type: "app",
    year: "2024",
  },
  {
    id: "clinic-catalyst",
    route: "clinic-catalyst",
    title: "ClinicCatalyst",
    blurb:
      "Clinical workflow tool designed around the real rhythms of care teams.",
    tags: ["Health", "Systems", "UX"],
    keywords: ["health", "systems", "research", "interaction"],
    accent: "#6ec8b8",
    bgGradient:
      "linear-gradient(140deg, #08181a 0%, #0f2224 45%, #061416 100%)",
    bgShape:
      "radial-gradient(ellipse 50% 70% at 28% 62%, rgba(110,200,184,0.25) 0%, transparent 70%)",
    freeform: { dx: 30, dy: -430, w: 290, h: 260, rot: 2.1 },
    theme: "systems",
    type: "app",
    year: "2024",
  },
  {
    id: "trader-goes",
    route: "trader-goes",
    title: "TraderGoes",
    blurb:
      "Emotional intelligence layer for retail investing — think before you tap.",
    tags: ["Fintech", "Behavioral"],
    keywords: ["ai", "systems", "emotion", "research"],
    accent: "#c86e9a",
    bgGradient:
      "linear-gradient(140deg, #180e14 0%, #240e1c 45%, #120a10 100%)",
    bgShape:
      "radial-gradient(ellipse 70% 45% at 52% 68%, rgba(200,110,154,0.23) 0%, transparent 70%)",
    freeform: { dx: 760, dy: 80, w: 290, h: 260, rot: -1.5 },
    theme: "systems",
    type: "app",
    year: "2023",
  },
  {
    id: "venmo",
    route: "venmo",
    title: "Venmo Redesign",
    blurb:
      "Rethinking social payments for Gen Z — cleaner, clearer, more human.",
    tags: ["Fintech", "Mobile", "Social"],
    keywords: ["interaction", "visual", "systems", "storytelling"],
    accent: "#6e9ac8",
    bgGradient:
      "linear-gradient(140deg, #0a0e18 0%, #0e1426 45%, #080c18 100%)",
    bgShape:
      "radial-gradient(ellipse 60% 60% at 40% 38%, rgba(110,154,200,0.25) 0%, transparent 70%)",
    freeform: { dx: -460, dy: 280, w: 290, h: 260, rot: 3.2 },
    theme: "social",
    type: "app",
    year: "2023",
  },
  {
    id: "motion-studies",
    route: "motion-studies",
    title: "Motion Studies",
    blurb:
      "Timing, easing, and the physics of attention in interface design.",
    tags: ["Animation", "Interaction"],
    keywords: ["interaction", "visual", "play", "speculative"],
    accent: "#a0a0a0",
    bgGradient:
      "linear-gradient(140deg, #0e0e0e 0%, #1c1c1c 50%, #0a0a0a 100%)",
    bgShape:
      "radial-gradient(ellipse 80% 35% at 50% 50%, rgba(160,160,160,0.14) 0%, transparent 70%)",
    freeform: { dx: 390, dy: 340, w: 265, h: 248, rot: -3 },
    theme: "experiment",
    type: "experiment",
    year: "2025",
  },
  {
    id: "cursor-work",
    route: null,
    title: "Cursor Work",
    blurb: "The pointer as performer — magnetic, weighted, theatrical.",
    tags: ["Interaction", "Cursor"],
    keywords: ["interaction", "play", "physical", "installation"],
    accent: "#b8a0d4",
    bgGradient:
      "linear-gradient(140deg, #100a18 0%, #1c1228 45%, #0c0810 100%)",
    bgShape:
      "radial-gradient(ellipse 55% 55% at 60% 40%, rgba(184,160,212,0.22) 0%, transparent 70%)",
    freeform: { dx: 840, dy: -320, w: 255, h: 248, rot: 2.6 },
    theme: "experiment",
    type: "experiment",
    year: "2025",
  },
]
