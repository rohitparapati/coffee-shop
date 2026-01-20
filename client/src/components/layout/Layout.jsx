import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../../styles/layout.css";

export default function Layout() {
  return (
    <div className="appShell">
      <a className="skipLink" href="#main">
        Skip to content
      </a>

      <Navbar />

      <main id="main" className="mainContent" tabIndex={-1}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
