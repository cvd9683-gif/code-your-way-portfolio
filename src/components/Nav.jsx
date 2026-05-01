export default function Nav({ page }) {
  return (
    <header>
      <nav>
        <ul>
          <li><a href="#home" className={page === "home" ? "active" : ""}>Home</a></li>
          <li><a href="#sandbox" className={page === "sandbox" ? "active" : ""}>Sandbox</a></li>
          <li><a href="#about" className={page === "about" ? "active" : ""}>About</a></li>
          <li><a href="#contact" className="nav-contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  )
}