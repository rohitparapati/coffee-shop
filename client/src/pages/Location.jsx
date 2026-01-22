import "../styles/location.css";

export default function Location() {
  // Placeholder address (we can make this configurable later)
  const addressLine1 = "123 Aurora St";
  const addressLine2 = "St. Louis, MO 63103";

  return (
    <div className="container">
      <div className="locTop">
        <div>
          <h1 className="locTitle">Location</h1>
          <p className="locSub">
            Find us fast — address, hours, and parking info in one place.
          </p>
        </div>
      </div>

      <div className="locGrid">
        {/* Left column: info */}
        <aside className="infoCards">
          <div className="card infoCard">
            <h3>Address</h3>
            <p className="muted" style={{ marginTop: 8 }}>
              <b>{addressLine1}</b>
              <br />
              <b>{addressLine2}</b>
            </p>

            <div style={{ height: 10 }} />

            {/* Placeholder "Get Directions" (we'll wire to Google Maps later) */}
            <a
              className="btn btnPrimary"
              href="#"
              aria-label="Get directions (placeholder)"
              onClick={(e) => e.preventDefault()}
            >
              Get Directions
            </a>

            <p className="muted" style={{ marginTop: 10, marginBottom: 0 }}>
              (later: this button will open Google Maps with directions.)
            </p>
          </div>

          <div className="card infoCard">
            <h3>Hours</h3>
            <div className="kv" aria-label="Store hours">
              <div className="kvRow">
                <span>Mon – Fri</span>
                <b>7:00 AM – 8:00 PM</b>
              </div>
              <div className="kvRow">
                <span>Sat</span>
                <b>8:00 AM – 8:00 PM</b>
              </div>
              <div className="kvRow">
                <span>Sun</span>
                <b>8:00 AM – 6:00 PM</b>
              </div>
            </div>
          </div>

          <div className="card infoCard">
            <h3>Parking</h3>
            <p className="muted" style={{ marginTop: 8, marginBottom: 0 }}>
              • Free street parking nearby <br />
              • Small lot behind the shop (entrance on Aurora Alley) <br />
              • Bike rack available near front door
            </p>
          </div>
        </aside>

        {/* Right column: map placeholder */}
        <section className="card mapPanel" aria-label="Map">
          <div className="mapTop">
            <h2 className="mapTitle">Map </h2>
            <button
              type="button"
              className="btn"
              onClick={() => alert("Later we’ll add a real map here.")}
            >
              Open Map
            </button>
          </div>

          <div className="mapBox">
            <div className="mapGrid" aria-hidden="true" />
            <div className="pin" aria-hidden="true" />
            <div className="mapLabel" role="note" aria-label="Shop marker">
              Aurora Coffee
              <small>{addressLine2}</small>
            </div>
          </div>
        </section>
      </div>

      <div style={{ height: 26 }} />
    </div>
  );
}
