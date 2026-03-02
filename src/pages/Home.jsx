const projects = [
  { id: "venmo", tags: "User Research • Fintech", title: "Venmo Group Split" },
  { id: "trader-goes", tags: "Mobile App • Grocery Delivery", title: "Trader Goe's" },
  { id: "forktales", tags: "Social • Interaction Design", title: "ForkTales" },
  { id: "clinic-catalyst", tags: "Web Design • AI Healthtech", title: "Clinic Catalyst" },
]

export default function Home({ navigate }) {
  return (
    <main>
      <section id="hero">
        <h1>Cathy Doss</h1>
        <p className="hero-subtitle">
          Product designer rooted in human understanding <sup>(01)</sup> &amp; delight <sup>(02)</sup>
        </p>
      </section>

      <section id="work">
        <h2>[ Selected Work ]</h2>
        <ul className="work-grid">
          {projects.map((p) => (
            <li key={p.id} onClick={() => navigate(p.id)} style={{ cursor: "pointer" }}>
              <article>
                <div className="project-image" />
                <p className="project-tags">{p.tags}</p>
                <h3>{p.title}</h3>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}