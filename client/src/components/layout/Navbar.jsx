import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/navbar.css";

const links = [
  { to: "/", label: "Home" },
  { to: "/offers", label: "Offers" },
  { to: "/menu", label: "Menu" },
  { to: "/reserve", label: "Reserve a Table" },
  { to: "/location", label: "Location" },
  { to: "/contact", label: "Contact Us" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="navWrap">
      <nav className="navBar container" aria-label="Primary">
        <NavLink to="/" className="brand" aria-label="Go to Home">
          <span className="brandDot" aria-hidden="true" />
          <span className="brandText">Aurora Coffee</span>
        </NavLink>

        <button
          className="hamburger"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="hamburgerLine" />
          <span className="hamburgerLine" />
          <span className="hamburgerLine" />
        </button>

        <div className="navLinks desktopOnly">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                isActive ? "navLink active" : "navLink"
              }
            >
              {l.label}
            </NavLink>
          ))}

          <NavLink to="/admin" className="navLink adminPill">
            Admin
          </NavLink>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={open ? "mobileMenu open" : "mobileMenu"}
      >
        <div className="mobileMenuInner container">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                isActive ? "mobileLink active" : "mobileLink"
              }
            >
              {l.label}
            </NavLink>
          ))}

          <NavLink to="/admin" className="mobileLink adminPill">
            Admin
          </NavLink>
        </div>
      </div>
    </header>
  );
}
