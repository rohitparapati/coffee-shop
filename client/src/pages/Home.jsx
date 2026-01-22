import { Link } from "react-router-dom";
import "../styles/home.css";
import { featuredCoffees } from "../data/featuredCoffees";
import { useReveal } from "../hooks/useReveal";

function RevealSection({ children }) {
  const { ref, isVisible } = useReveal();
  return (
    <div ref={ref} className={isVisible ? "reveal visible" : "reveal"}>
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div className="container">
      {/* HERO */}
      <section className="hero" aria-label="Coffee shop hero">
        <div className="heroBg" aria-hidden="true" />
        <div className="heroInner">
          <div className="heroKicker">
            <span aria-hidden="true">☕</span>
            <span>Fresh roasts • Cozy vibes • Fast service</span>
          </div>

          <h1 className="heroTitle">Aurora Coffee</h1>

          <p className="heroSub">
            A modern neighborhood coffee spot for espresso lovers, cold brew
            fans, and pastry hunters. Simple menu, great taste, calm atmosphere.
          </p>

          <div className="heroActions">
            <Link to="/menu" className="btn btnPrimary">
              View Menu
            </Link>
            <Link to="/reserve" className="btn">
              Reserve a Table
            </Link>
          </div>
        </div>

        <a className="scrollCue" href="#featured">
          <span className="scrollDot" aria-hidden="true" />
          <span>Scroll for featured coffees</span>
        </a>
      </section>

      {/* FEATURED */}
      <section id="featured" className="section" aria-label="Featured coffees">
        <RevealSection>
          <div className="sectionHeader">
            <div>
              <h2 className="sectionTitle">Featured Coffees</h2>
              <p className="sectionDesc">
                Today’s favorites — crafted fast, served warm, priced clearly.
              </p>
            </div>
            <Link to="/menu" className="btn">
              Explore full menu →
            </Link>
          </div>

          <div className="grid3">
            {featuredCoffees.map((c) => (
              <article key={c.id} className="card productCard">
                <img className="productImg" src={c.image} alt={c.name} />
                <div className="productBody">
                  <div className="productTop">
                    <h3 className="productName">{c.name}</h3>
                    <p className="productPrice">${c.price.toFixed(2)}</p>
                  </div>
                  <p className="productDesc">{c.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ABOUT + WHY */}
      <section className="section" aria-label="About and why choose us">
        <RevealSection>
          <div className="split">
            <div className="card">
              <h2 className="sectionTitle">About us</h2>
              <p className="sectionDesc" style={{ marginTop: 8 }}>
                Aurora Coffee is built for busy mornings and slow afternoons.
                We keep it simple: quality beans, consistent recipes, and a warm
                space you’ll actually want to sit in.
              </p>
              <div style={{ height: 10 }} />
              <div className="heroActions" style={{ justifyContent: "flex-start" }}>
                <Link to="/location" className="btn">
                  Find us
                </Link>
                <Link to="/offers" className="btn">
                  Today’s offers
                </Link>
              </div>
            </div>

            <div className="card">
              <h2 className="sectionTitle">Why choose us</h2>
              <div style={{ height: 8 }} />
              <div className="bullets">
                <div className="bullet">
                  <span className="bulletIcon" aria-hidden="true" />
                  <div>
                    <b>Fast & consistent</b>
                    <div style={{ color: "rgba(245,245,247,0.72)" }}>
                      Same great taste every time.
                    </div>
                  </div>
                </div>
                <div className="bullet">
                  <span className="bulletIcon" aria-hidden="true" />
                  <div>
                    <b>Comfort-first space</b>
                    <div style={{ color: "rgba(245,245,247,0.72)" }}>
                      Quiet seating + friendly service.
                    </div>
                  </div>
                </div>
                <div className="bullet">
                  <span className="bulletIcon" aria-hidden="true" />
                  <div>
                    <b>Clear pricing</b>
                    <div style={{ color: "rgba(245,245,247,0.72)" }}>
                      No confusing add-ons or hidden charges.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* CTA STRIP */}
      <section className="section" aria-label="Call to action">
        <RevealSection>
          <div className="card ctaStrip">
            <div className="ctaText">
              <h3>Want the best seat?</h3>
              <p>Reserve a table in seconds — we’ll build the seat map soon.</p>
            </div>
            <div className="heroActions" style={{ marginTop: 0 }}>
              <Link to="/reserve" className="btn btnPrimary">
                Reserve now
              </Link>
              <Link to="/contact" className="btn">
                Ask a question
              </Link>
            </div>
          </div>
        </RevealSection>
      </section>

      <div style={{ height: 26 }} />
    </div>
  );
}
