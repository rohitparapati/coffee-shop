import { useEffect, useMemo, useState } from "react";
import "../styles/admin.css";

const API = "http://localhost:5000/api";

function isValidDateStr(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [offers, setOffers] = useState([]);

  const [form, setForm] = useState({
    type: "B1G1",
    title: "",
    description: "",
    imageUrl: "",
    validFrom: "",
    validTo: "",
    isActive: true
  });

  const [touched, setTouched] = useState({});
  const [busy, setBusy] = useState(false);

  function fetchOffers() {
    setLoading(true);
    setApiError("");
    fetch(`${API}/admin/offers`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then((data) => {
        setOffers(data.offers || []);
        setLoading(false);
      })
      .catch(() => {
        setApiError("Could not load admin offers. Is the server running?");
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errors = useMemo(() => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.validFrom.trim()) e.validFrom = "Valid from is required.";
    else if (!isValidDateStr(form.validFrom)) e.validFrom = "Use YYYY-MM-DD.";

    if (!form.validTo.trim()) e.validTo = "Valid to is required.";
    else if (!isValidDateStr(form.validTo)) e.validTo = "Use YYYY-MM-DD.";

    if (isValidDateStr(form.validFrom) && isValidDateStr(form.validTo)) {
      if (form.validFrom > form.validTo) e.validTo = "Valid to must be after valid from.";
    }

    return e;
  }, [form]);

  const canSubmit = Object.keys(errors).length === 0;

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function onBlur(e) {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
  }

  async function createOffer(e) {
    e.preventDefault();
    setTouched({ title: true, description: true, validFrom: true, validTo: true });

    if (!canSubmit) return;

    setBusy(true);
    setApiError("");

    try {
      const res = await fetch(`${API}/admin/offers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg.error || "Create failed");
      }

      setForm({
        type: "B1G1",
        title: "",
        description: "",
        imageUrl: "",
        validFrom: "",
        validTo: "",
        isActive: true
      });
      setTouched({});
      fetchOffers();
    } catch (err) {
      setApiError("Could not create offer. Check required fields.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleOffer(id) {
    setApiError("");
    try {
      const res = await fetch(`${API}/admin/offers/${id}/toggle`, { method: "PATCH" });
      if (!res.ok) throw new Error("Toggle failed");
      fetchOffers();
    } catch {
      setApiError("Could not toggle offer.");
    }
  }

  async function deleteOffer(id) {
    const ok = confirm("Delete this offer? This cannot be undone.");
    if (!ok) return;

    setApiError("");
    try {
      const res = await fetch(`${API}/admin/offers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      fetchOffers();
    } catch {
      setApiError("Could not delete offer.");
    }
  }

  return (
    <div className="container">
      <div className="adminTop">
        <div>
          <h1 className="adminTitle">Admin</h1>
          <p className="adminSub">
            Offers Manager (temporary open access). We will add login/JWT soon.
          </p>
        </div>
      </div>

      {apiError && (
        <div className="card" role="status" aria-live="polite">
          {apiError}
        </div>
      )}

      <div style={{ height: 12 }} />

      <div className="adminGrid">
        {/* Left: Create offer */}
        <section className="card" aria-label="Create offer">
          <h2 style={{ margin: 0, fontSize: 18 }}>Add Offer</h2>
          <p className="helper" style={{ marginTop: 6 }}>
            Fields marked required: title, description, valid dates.
          </p>

          <form className="formGrid" onSubmit={createOffer} noValidate>
            <div className="field">
              <label className="label" htmlFor="type">Offer type</label>
              <select
                id="type"
                name="type"
                className="select"
                value={form.type}
                onChange={onChange}
              >
                <option value="B1G1">B1G1</option>
                <option value="2-FOR">2-FOR</option>
                <option value="% OFF">% OFF</option>
              </select>
            </div>

            <div className="field">
              <label className="label" htmlFor="title">Title *</label>
              <input
                id="title"
                name="title"
                className="input"
                value={form.title}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Buy 1 Get 1 Latte"
                aria-invalid={touched.title && !!errors.title}
              />
              {touched.title && errors.title && <p className="errorText">{errors.title}</p>}
            </div>

            <div className="field">
              <label className="label" htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                className="textarea"
                value={form.description}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Short details about the offer..."
                aria-invalid={touched.description && !!errors.description}
              />
              {touched.description && errors.description && (
                <p className="errorText">{errors.description}</p>
              )}
            </div>

            <div className="field">
              <label className="label" htmlFor="imageUrl">Image URL (optional)</label>
              <input
                id="imageUrl"
                name="imageUrl"
                className="input"
                value={form.imageUrl}
                onChange={onChange}
                placeholder="https://..."
              />
            </div>

            <div className="row2">
              <div className="field">
                <label className="label" htmlFor="validFrom">Valid from *</label>
                <input
                  id="validFrom"
                  name="validFrom"
                  className="input"
                  value={form.validFrom}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="YYYY-MM-DD"
                  aria-invalid={touched.validFrom && !!errors.validFrom}
                />
                {touched.validFrom && errors.validFrom && (
                  <p className="errorText">{errors.validFrom}</p>
                )}
              </div>

              <div className="field">
                <label className="label" htmlFor="validTo">Valid to *</label>
                <input
                  id="validTo"
                  name="validTo"
                  className="input"
                  value={form.validTo}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="YYYY-MM-DD"
                  aria-invalid={touched.validTo && !!errors.validTo}
                />
                {touched.validTo && errors.validTo && (
                  <p className="errorText">{errors.validTo}</p>
                )}
              </div>
            </div>

            <div className="field">
              <label className="label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={onChange}
                />{" "}
                Active (show on customer site)
              </label>
            </div>

            <div className="actionsRow">
              <button className="btn btnPrimary" type="submit" disabled={!canSubmit || busy}>
                {busy ? "Saving..." : "Add Offer"}
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setForm({
                    type: "B1G1",
                    title: "",
                    description: "",
                    imageUrl: "",
                    validFrom: "",
                    validTo: "",
                    isActive: true
                  });
                  setTouched({});
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </section>

        {/* Right: Offers list */}
        <section className="card" aria-label="Offers list">
          <h2 style={{ margin: 0, fontSize: 18 }}>All Offers</h2>
          <p className="helper" style={{ marginTop: 6 }}>
            Toggle active/inactive, or delete.
          </p>

          {loading ? (
            <div className="smallText" role="status" aria-live="polite">
              Loading...
            </div>
          ) : offers.length === 0 ? (
            <div className="smallText">No offers yet.</div>
          ) : (
            <div className="offerList" style={{ marginTop: 12 }}>
              {offers.map((o) => (
                <div key={o.id} className="card" style={{ padding: 14 }}>
                  <div className="offerItemTop">
                    <div>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                        <span className={o.isActive ? "pill" : "pill off"}>
                          {o.type} • {o.isActive ? "Active" : "Inactive"}
                        </span>
                        <b>{o.title}</b>
                      </div>
                      <p className="smallText">
                        {o.description}
                        <br />
                        Valid: <b>{o.validFrom}</b> → <b>{o.validTo}</b>
                      </p>
                    </div>

                    <div className="actionsRow">
                      <button className="btn" type="button" onClick={() => toggleOffer(o.id)}>
                        Toggle
                      </button>
                      <button className="btn" type="button" onClick={() => deleteOffer(o.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div style={{ height: 26 }} />
    </div>
  );
}
