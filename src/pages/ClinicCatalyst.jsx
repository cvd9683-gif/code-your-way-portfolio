import { CaseBack, CaseHeader, Pullquote, SectionLabel, ImageBlock, ImageGrid, Step, NextSteps } from "../components/CaseStudy"

export default function ClinicCatalyst({ navigate }) {
  return (
    <main>
      <CaseBack navigate={navigate} />
      <CaseHeader
        tags={["Web Design", "AI Healthtech", "B2B"]}
        title="Clinic Catalyst Website"
        intro="A website designed to clearly introduce and communicate a medical AI platform for clinics, investors, and clinical stakeholders."
        role="Product Design, Inc."
        duration="6 Weeks"
        tools="Figma"
      />
      <div className="case-hero-image" />

      <section className="case-section">
        <SectionLabel>Context & Role</SectionLabel>
        <h2>Meet Clinic Catalyst</h2>
        <p>Clinic Catalyst is an AI-powered platform designed to reduce administrative burden for clinics and streamline interactions between clinics and hospitals.</p>
        <p>I joined the team of startup designers tasked with designing a marketing website. The challenge was communicating their identity to a wide range of audiences — from clinicians to investors.</p>
      </section>

      <Pullquote>In healthcare and investor settings, unclear storytelling can make strong products feel less trustworthy.</Pullquote>

      <section className="case-section">
        <SectionLabel>Design Approach</SectionLabel>
        <Step num="01" title="Competitor Analysis">
          I started by reviewing available website options to identify product and healthcare tech competitors, breaking them down into common structural patterns.
        </Step>
        <ImageBlock />
        <Step num="02" title="Refining the Message Structure">
          Working alongside the founders, I organized the platform's message into a clear narrative arc with each section serving a specific communication purpose.
        </Step>
        <ImageBlock />
        <Step num="03" title="Wireframing & Modular Design">
          I developed and evolved wireframes focusing on flexibility — 5 module types that could be maintained and used even as technology changes.
        </Step>
        <ImageBlock />
        <Step num="04" title="Visual Direction & Iteration">
          The visual direction intentionally bridged clinical credibility with approachability, developing a language that felt both recognizable and memorable.
        </Step>
        <ImageBlock />
        <Step num="05" title="Motion & Storytelling">
          I explored animation patterns and micro-interactions that guide users through the platform's value proposition without overwhelming them.
        </Step>
        <ImageGrid>
          <ImageBlock sm />
          <ImageBlock sm />
        </ImageGrid>
      </section>

      <section className="case-outcome">
        <SectionLabel>Outcome</SectionLabel>
        <p>The result was a purpose-built experience for medical and clinical healthcare content. Clinic Catalyst now has a visual voice with components that bring the visual language to life.</p>
        <NextSteps items={[
          "Explore interactive prototype testing with clinical stakeholders",
          "Develop component library documentation for the broader design team",
          "Test content hierarchy with investors vs. clinical audience segments",
        ]} />
      </section>
    </main>
  )
}