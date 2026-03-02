import { CaseBack, CaseHeader, Pullquote, SectionLabel, ImageBlock, ImageGrid, FeatureTags, NextSteps } from "../components/CaseStudy"

export default function ForkTales({ navigate }) {
  return (
    <main>
      <CaseBack navigate={navigate} />
      <CaseHeader
        tags={["Social", "Interaction Design", "Mobile"]}
        title="ForkTales"
        intro="A social cooking app that uses daily prompts, team challenges, and shared feasts to turn everyday meals into moments of connection."
        role="Product Designer"
        duration="10 Weeks"
        tools="Figma, Canva"
      />
      <div className="case-hero-image" />

      <section className="case-section">
        <SectionLabel>Context & Role</SectionLabel>
        <h2>Cooking Much Alone</h2>
        <p>ForkTales was born out of a pressing observation: designed for millions, our cooking apps fail to motivate and shared interest in trying together makes cooking effective and more intentional while keeping people on track.</p>
        <p>As the sole product designer, I was responsible for the entire design — from initial sketches and prototypes to high-fidelity screens and the final pitch.</p>
      </section>

      <Pullquote>How might cooking <em>feel</em> different if it were treated as a shared experience, not a solo task?</Pullquote>

      <section className="case-section">
        <SectionLabel>Design Focus</SectionLabel>
        <h2>Three Design Pillars</h2>
        <div className="case-feature-grid">
          <div className="case-feature"><h3>Playful</h3><p>Cooking feels lighter when it's framed as a game. Prompts, streaks, and celebratory moments make the routine feel special.</p></div>
          <div className="case-feature"><h3>Shared</h3><p>Team challenges and ingredient sharing create genuine social rituals around food.</p></div>
          <div className="case-feature"><h3>Rewarded</h3><p>Progress is visible. Completing challenges earns points and unlocks community recognition.</p></div>
        </div>
      </section>

      <section className="case-section">
        <SectionLabel>Key Features</SectionLabel>
        <h2>Feature 1: Cooking Prompts</h2>
        <FeatureTags tags={["Notification Design", "Daily Engagement"]} />
        <p>Daily prompts serve as a gentle nudge that pulls you out of your usual rotation. They feel more like a friend texting "hey, try this tonight" than a reminder from an app.</p>
        <ImageBlock />

        <h2 style={{ marginTop: "var(--space-lg)" }}>Feature 2: Team Assignment & Home Feed</h2>
        <FeatureTags tags={["Social Design", "Community"]} />
        <p>After downloading, users are assigned to real teams and brought into an existing shared kitchen where they feel like they're joining something already in motion.</p>
        <ImageBlock />

        <h2 style={{ marginTop: "var(--space-lg)" }}>Feature 3: Team Feasts</h2>
        <FeatureTags tags={["Social", "Ritual", "Community"]} />
        <p>Users cook the same dish at the same time and bring their results to a virtual feast. The app celebrates the attempt, not just the outcome.</p>
        <ImageBlock />
      </section>

      <section className="case-outcome">
        <SectionLabel>Outcome & Reflection</SectionLabel>
        <p>ForkTales taught me that cooking is a deeply social act that technology had mostly turned into a solo one. It reinforced my belief in designing systems that encourage people rather than optimize them.</p>
        <ImageBlock sm />
        <NextSteps items={[
          "Explore how team dynamics shift when group sizes vary (2 vs. 8 people)",
          "Test whether prompts work better as push notifications or in-app moments",
          "Add dietary accommodations to ensure accessibility for all team members",
          "Build out official advisor connections so teams can get professional guidance",
        ]} />
      </section>
    </main>
  )
}