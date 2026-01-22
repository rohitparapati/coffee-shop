import { useMemo, useState } from "react";
import "../styles/menu.css";
import { categories, menuItems } from "../data/menuItems";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;

      const matchesQuery =
        q.length === 0 ||
        item.name.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <div className="container">
      <div className="menuTop">
        <div>
          <h1 className="menuTitle">Menu</h1>
          <p className="menuSub">
            Search, filter, and pick your favorites.
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
              <img className="menuImg" src={item.image} alt={item.name} />
              <div className="menuBody">
                <div className="menuRow">
                  <h3 className="menuName">{item.name}</h3>
                  <p className="menuPrice">${item.price.toFixed(2)}</p>
                </div>
                <p className="menuDesc">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      <div style={{ height: 26 }} />
    </div>
  );
}
