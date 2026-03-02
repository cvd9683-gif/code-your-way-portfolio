import { CaseBack, CaseHeader, Pullquote, SectionLabel, ImageBlock, ImageGrid, FeatureTags, NextSteps } from "../components/CaseStudy"

export default function TraderGoes({ navigate }) {
  return (
    <main>
      <CaseBack navigate={navigate} />
      <CaseHeader
        tags={["Product Design", "Mobile App", "UX Research"]}
        title="Trader Goe's"
        intro="A mobile app concept focused on faster grocery planning, discovery, and delivery for Trader Joe's shoppers."
        role="Product Designer"
        duration="3 Weeks"
        tools="Figma"
      />
      <div className="case-hero-image" />

      <section className="case-section">
        <SectionLabel>Context & Role</SectionLabel>
        <h2>Grocery Shopping, Simplified</h2>
        <p>Trader Joe's has always been an experience — the products, the culture, the discovery. But without a dedicated app, shopping could feel disjointed.</p>
        <p>As the sole product designer, I led feature concept research, user interview synthesis, low-fidelity wireframes, and validated design decisions in the final deliverable.</p>
      </section>

      <Pullquote>How might Trader Joe's app extend the in-store experience to better support planning, discovery, and convenience?</Pullquote>

      <section className="case-section">
        <SectionLabel>Design Focus</SectionLabel>
        <p>I prioritized speed, flexibility, and content discovery while staying true to the brand's playful, community-driven feel.</p>
        <ImageGrid>
          <ImageBlock sm />
          <ImageBlock sm />
          <ImageBlock sm />
          <ImageBlock sm />
        </ImageGrid>
      </section>

      <section className="case-section">
        <SectionLabel>Key Features</SectionLabel>
        <h2>Feature 1: Recipe Discovery & Filters</h2>
        <FeatureTags tags={["Product Discovery", "Navigation Design"]} />
        <p>Users can browse recipes using quick tag-based filters that map to mood topics and preferences, making it easier to decide what to cook and buy in a single flow.</p>
        <ImageBlock />

        <h2 style={{ marginTop: "var(--space-lg)" }}>Feature 2: Integrate Podcast Experience</h2>
        <FeatureTags tags={["Participating", "Social Integration"]} />
        <p>Trader Joe's podcast content built directly into the app with a listening bar that stays accessible while users browse products or check out.</p>
        <ImageBlock />

        <h2 style={{ marginTop: "var(--space-lg)" }}>Feature 3: Live Order Tracking</h2>
        <FeatureTags tags={["Trust Building", "Core Service"]} />
        <p>Real-time order status and delivery tracking helps users feel confident and have a clearer picture of when groceries will arrive.</p>
        <ImageBlock />
      </section>

      <section className="case-outcome">
        <SectionLabel>Outcome & Reflection</SectionLabel>
        <p>The final result combines delivery, planning and podcasts into one experience. The project pushed me to design within a strong brand identity while staying accessible to new customers.</p>
        <ImageBlock />
        <NextSteps items={[
          "Explore more robust features and interactions to be tested with potential users",
          "Continue to find user needs and test more features that fit their lifestyle",
        ]} />
      </section>
    </main>
  )
}