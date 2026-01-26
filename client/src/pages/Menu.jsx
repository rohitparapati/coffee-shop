import { useEffect, useMemo, useState } from "react";
import "../styles/menu.css";

const API = "http://localhost:5000/api";

export default function Menu() {
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [items, setItems] = useState([]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setApiError("");

    fetch(`${API}/menu`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch menu");
        return r.json();
      })
      .then((data) => {
        if (!alive) return;
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setApiError("Could not load menu. Is the server running?");
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    items.forEach((i) => set.add(i.category));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  // If category list changes, keep activeCategory valid
  useEffect(() => {
    if (!categories.includes(activeCategory)) setActiveCategory("All");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.join("|")]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;

      const matchesQuery =
        q.length === 0 ||
        item.name.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [items, activeCategory, query]);

  return (
    <div className="container">
      <div className="menuTop">
        <div>
          <h1 className="menuTitle">Menu</h1>
          <p className="menuSub">
            Search, filter, and pick your favorites. (Powered by DB ✅)
          </p>
        </div>

        <div className="searchWrap">
          <label className="srOnly" htmlFor="menu-search">
            Search menu items
          </label>
          <input
            id="menu-search"
            className="searchInput"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: latte, chai, croissant..."
            autoComplete="off"
          />
          <button
            className="btn"
            type="button"
            onClick={() => setQuery("")}
            disabled={!query}
            aria-disabled={!query}
          >
            Clear
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card emptyState" role="status" aria-live="polite">
          Loading menu...
        </div>
      ) : apiError ? (
        <div className="card emptyState" role="status" aria-live="polite">
          {apiError}
        </div>
      ) : (
        <>
          <div className="tabs" role="tablist" aria-label="Menu categories">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                className={activeCategory === cat ? "tabBtn active" : "tabBtn"}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="card emptyState" role="status" aria-live="polite">
              No items match your search. Try a different keyword.
            </div>
          ) : (
            <div className="menuGrid">
              {filtered.map((item) => (
                <article key={item.id} className="card menuCard">
                  <img
                    className="menuImg"
                    src={item.image || "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=900&q=80"}
                    alt={item.name}
                  />
                  <div className="menuBody">
                    <div className="menuRow">
                      <h3 className="menuName">{item.name}</h3>
                      <p className="menuPrice">${Number(item.price).toFixed(2)}</p>
                    </div>
                    <p className="menuDesc">{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      <div style={{ height: 26 }} />
    </div>
  );
}
