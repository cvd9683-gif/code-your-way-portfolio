import { useState, useEffect } from "react"
import Home from "./pages/Home"
import About from "./pages/About"
import Sandbox from "./pages/Sandbox"
import Archive from "./pages/Archive"
import ForkTales from "./pages/ForkTales"
import ClinicCatalyst from "./pages/ClinicCatalyst"
import TraderGoes from "./pages/TraderGoes"
import Venmo from "./pages/Venmo"
import Nav from "./components/Nav"
import PlusGridBackground from "./components/PlusGridBackground"
import "./index.css"

export default function App() {
  const [page, setPage] = useState("home")

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "") || "home"
      setPage(hash)
      window.scrollTo(0, 0)
    }
    handleHash()
    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  }, [])

  const navigate = (p) => { window.location.hash = p }

  const pages = {
    home: <Home navigate={navigate} />,
    about: <About />,
    sandbox: <Sandbox navigate={navigate} />,
    archive: <Archive navigate={navigate} />,
    forktales: <ForkTales navigate={navigate} />,
    "clinic-catalyst": <ClinicCatalyst navigate={navigate} />,
    "trader-goes": <TraderGoes navigate={navigate} />,
    venmo: <Venmo navigate={navigate} />,
  }

  return (
    <>
      {/* Fixed full-page plus grid behind everything */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <PlusGridBackground />
      </div>

      {/* All page content sits on top */}
      <div style={{ position: "relative", zIndex: 1 }} className="page-frame">
        <Nav page={page} />
        {pages[page] || pages["home"]}
      </div>
    </>
  )
}