import { CaseBack } from "../components/CaseStudy"

export default function Venmo({ navigate }) {
  return (
    <main>
      <CaseBack navigate={navigate} />
      <div className="case-header">
        <div className="case-tags">
          <span className="case-tag">User Research</span>
          <span className="case-tag">Fintech</span>
        </div>
        <h1>Venmo Group Split</h1>
        <p className="case-intro">Coming soon.</p>
      </div>
    </main>
  )
}