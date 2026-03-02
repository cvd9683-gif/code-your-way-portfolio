export function CaseBack({ navigate }) {
  return (
    <button className="case-back" onClick={() => navigate("home")}>
      ← Back to work
    </button>
  )
}

export function CaseHeader({ tags, title, intro, role, duration, tools }) {
  return (
    <div className="case-header">
      <div className="case-tags">
        {tags.map((t) => <span key={t} className="case-tag">{t}</span>)}
      </div>
      <h1>{title}</h1>
      <p className="case-intro">{intro}</p>
      <div className="case-header-meta">
        <div className="case-meta-group">
          <span className="case-meta-label">Role</span>
          <span className="case-meta-value">{role}</span>
        </div>
        <div className="case-meta-group">
          <span className="case-meta-label">Duration</span>
          <span className="case-meta-value">{duration}</span>
        </div>
        <div className="case-meta-group">
          <span className="case-meta-label">Tools</span>
          <span className="case-meta-value">{tools}</span>
        </div>
      </div>
    </div>
  )
}

export function Pullquote({ children }) {
  return (
    <div className="case-pullquote">
      <p>{children}</p>
    </div>
  )
}

export function SectionLabel({ children }) {
  return <p className="case-section-label">{children}</p>
}

export function ImageBlock({ sm }) {
  return <div className={`case-image-block${sm ? " case-image-sm" : ""}`} />
}

export function ImageGrid({ children }) {
  return <div className="case-image-grid">{children}</div>
}

export function Step({ num, title, children }) {
  return (
    <div className="case-step">
      <span className="case-step-num">{num} —</span>
      <div className="case-step-body">
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  )
}

export function FeatureTags({ tags }) {
  return (
    <div className="feature-tags">
      {tags.map((t) => <span key={t} className="feature-tag">{t}</span>)}
    </div>
  )
}

export function NextSteps({ items }) {
  return (
    <div style={{ marginTop: "var(--space-lg)" }}>
      <SectionLabel>Next Steps</SectionLabel>
      <ul className="next-steps-list">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  )
}