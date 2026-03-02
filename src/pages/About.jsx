import ParallaxGallery from "../components/ParallaxGallery"

export default function About() {
  return (
    <main>
      <section className="about-intro">
        <div className="about-intro-text">
          <h1>I'm Cathy — a designer,<br />dancer, and builder</h1>
          <p>
            Ever since I was young, observing human interactions have always piqued my interests.
            From how they communicate, to how they navigated situations — I gained a deep understanding
            of the world through their behavior, leading me to receive a degree in Cognitive Behavioral
            Neuroscience at UC San Diego.
          </p>
        </div>
        <div className="polaroid">
          <div className="polaroid-img" />
          <p className="polaroid-label">Cathy ☺</p>
        </div>
      </section>

      <hr className="about-divider" />

      <section className="about-theory">
        <div className="theory-card" />
        <div className="theory-text">
          <h2>But understanding wasn't enough. I wanted to turn theory → tangible ✦</h2>
          <p>
            Understanding people wasn't enough for me. I didn't just want to study behavior —
            I wanted to shape it, design for it, and build things that could live in the real world.
            That pull led me to NYU, where I'm now studying human-computer interaction and exploring
            how art and technology intersect.
          </p>
        </div>
      </section>

      <hr className="about-divider" />

      <section className="outside-section">
        <h2>Outside of design...</h2>
        <div className="gallery-wrapper">
          <ParallaxGallery />
        </div>
      </section>

      <hr className="about-divider" />

      <section className="learn-section">
        <h2>Learn About Me</h2>
        <div className="learn-layout">
          <div className="experience-list">
            {[
              { icon: "ITP", label: "Design Lab Mentor @ ITP Design Lab" },
              { icon: "AI",  label: "NYU Manus AI Ambassador" },
              { icon: "UXC", label: "Outreach Coordinator @ UX Club" },
              { icon: "UXC", label: "Outreach Coordinator @ UX Club" },
            ].map((item, i) => (
              <div key={i} className="experience-item">
                <div className="experience-icon">{item.icon}</div>
                {item.label}
              </div>
            ))}
          </div>
          <div className="drag-area">
            <div className="drag-placeholder">Drag an experience here</div>
            <div className="drag-preview" />
          </div>
        </div>
      </section>
    </main>
  )
}