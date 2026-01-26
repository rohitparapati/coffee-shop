import { useEffect, useMemo, useState } from "react";
import "../styles/offers.css";

function isDateInRange(today, fromStr, toStr) {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const from = new Date(fromStr + "T00:00:00");
  const to = new Date(toStr + "T23:59:59");
  return t >= from && t <= to;
}

function formatDate(dStr) {
  const d = new Date(dStr + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export default function Offers() {
  const today = new Date();

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setApiError("");

    fetch("http://localhost:5000/api/offers")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch offers");
        return r.json();
      })
      .then((data) => {
        if (!alive) return;
        setOffers(data.offers || []);
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setApiError("Could not load offers. Is the server running?");
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const activeOffers = useMemo(() => {
    return offers.filter((o) => {
      if (!o.isActive) return false;
      return isDateInRange(today, o.validFrom, o.validTo);
    });
  }, [offers, today]);

  return (
    <div className="container">
      <div className="offersTop">
        <div>
          <h1 className="offersTitle">Offers</h1>
          <p className="offersSub">
            Today’s deals — only active offers show here automatically.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="card emptyState" role="status" aria-live="polite">
          Loading offers...
        </div>
      ) : apiError ? (
        <div className="card emptyState" role="status" aria-live="polite">
          {apiError}
        </div>
      ) : activeOffers.length === 0 ? (
        <div className="card emptyState" role="status" aria-live="polite">
          No active offers right now. Check back later!
        </div>
      ) : (
        <div className="offersGrid">
          {activeOffers.map((o) => (
            <article key={o.id} className="card offerCard">
              <img className="offerImg" src={o.image} alt={o.title} />
              <div className="offerBody">
                <div className="offerHeader">
                  <h3 className="offerTitle">{o.title}</h3>
                  <span className="badge" aria-label={`Offer type ${o.type}`}>
                    <span className="badgeDot" aria-hidden="true" />
                    {o.type}
                  </span>
                </div>

                <p className="offerDesc">{o.description}</p>

                <div className="validityRow">
                  <span>
                    Valid: <b>{formatDate(o.validFrom)}</b> →{" "}
                    <b>{formatDate(o.validTo)}</b>
                  </span>
                  <span>Powered by DB ✅</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div style={{ height: 26 }} />
    </div>
  );
}
