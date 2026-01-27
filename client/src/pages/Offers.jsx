import { useEffect, useMemo, useState } from "react";
import { USE_MOCK_DATA, API_BASE } from "../config/api";
import { offers as mockOffers } from "../data/offers";
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
    day: "numeric",
  });
}

export default function Offers() {
  const today = new Date();

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [offers, setOffers] = useState([]);

  // ✅ UPDATED LOGIC
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setApiError("");

    async function loadOffers() {
      // 1️⃣ USE MOCK DATA (recruiter-safe)
      if (USE_MOCK_DATA) {
        setOffers(mockOffers);
        setLoading(false);
        return;
      }

      // 2️⃣ TRY BACKEND
      try {
        const res = await fetch(`${API_BASE}/offers`);
        if (!res.ok) throw new Error("API failed");
        const data = await res.json();
        if (!alive) return;
        setOffers(data.offers || []);
      } catch {
        // 3️⃣ FALLBACK TO MOCK DATA
        if (!alive) return;
        setOffers(mockOffers);
        setApiError("Showing demo offers (offline mode).");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    loadOffers();
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
                  <span className="badge">
                    <span className="badgeDot" />
                    {o.type}
                  </span>
                </div>

                <p className="offerDesc">{o.description}</p>

                <div className="validityRow">
                  <span>
                    Valid: <b>{formatDate(o.validFrom)}</b> →{" "}
                    <b>{formatDate(o.validTo)}</b>
                  </span>
                  <span>
                    {USE_MOCK_DATA ? "Demo data 🧪" : "Live data ✅"}
                  </span>
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
