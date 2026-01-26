import { useMemo, useState } from "react";
import "../styles/reserve.css";
import { tableGroups } from "../data/tables";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function buildSlots() {
  const slots = [];
  for (let h = 9; h <= 17; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

export default function Reserve() {
  const slots = useMemo(() => buildSlots(), []);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedTable, setSelectedTable] = useState("");

  // Demo-only unavailable tables
  const unavailableSet = useMemo(() => {
    if (!date || !time) return new Set();

    const key = (date + time).replaceAll("-", "").replaceAll(":", "");
    const n = Number(key.slice(-3)) || 0;

    const all = tableGroups.flatMap((g) => g.items);
    const picks = new Set();
    for (let i = 0; i < 3; i++) picks.add(all[(n + i * 4) % all.length]);
    return picks;
  }, [date, time]);

  const [form, setForm] = useState({ name: "", email: "" });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => {
    const e = {};
    if (!date) e.date = "Select a date.";
    if (!time) e.time = "Select a time slot.";
    if (!selectedTable) e.table = "Select a table.";

    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email.";

    return e;
  }, [date, time, selectedTable, form]);

  const canSubmit = Object.keys(errors).length === 0;

  function markAllTouched() {
    setTouched({
      date: true,
      time: true,
      table: true,
      name: true,
      email: true
    });
  }

  function onConfirm(e) {
    e.preventDefault();
    markAllTouched();
    if (!canSubmit) return;

    setSubmitted(true);

    // Demo reset
    setSelectedTable("");
    setTime("");
    setForm({ name: "", email: "" });
    setTouched({});
  }

  return (
    <div className="container">
      <div className="reserveTop">
        <div>
          <h1 className="reserveTitle">Reserve a Table</h1>
          <p className="reserveSub">
            Pick a date, time, and table — like a movie seat booking.
          </p>
        </div>
      </div>

      <div className="reserveGrid">
        {/* LEFT PANEL */}
        <section className="card" aria-label="Reservation details">
          <h2 className="panelTitle">1) Choose date & time</h2>
          <p className="helper">
            Step 11 will connect real availability + prevent double booking.
          </p>

          <div className="field">
            <label className="label" htmlFor="date">
              Date *
            </label>
            <input
              id="date"
              className="input"
              type="date"
              value={date}
              onChange={(e) => {
                setSubmitted(false);
                setDate(e.target.value);
                setTime("");
                setSelectedTable("");
              }}
              onBlur={() => setTouched((t) => ({ ...t, date: true }))}
              aria-invalid={touched.date && !!errors.date}
            />
            {touched.date && errors.date && (
              <p className="errorText">{errors.date}</p>
            )}
          </div>

          <div className="field">
            <span className="label">Time slot *</span>

            {!date ? (
              <p className="helper" style={{ marginTop: 6 }}>
                Select a date first.
              </p>
            ) : (
              <div className="slotGrid" role="list" aria-label="Time slots">
                {slots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={time === s ? "slotBtn active" : "slotBtn"}
                    onClick={() => {
                      setSubmitted(false);
                      setTime(s);
                      setSelectedTable("");
                      setTouched((t) => ({ ...t, time: true }));
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {touched.time && errors.time && (
              <p className="errorText">{errors.time}</p>
            )}
          </div>

          <div style={{ height: 14 }} />

          <h2 className="panelTitle">3) Your details</h2>

          {submitted && (
            <div
              className="card successBox"
              role="status"
              aria-live="polite"
              style={{ marginTop: 12 }}
            >
              ✅ Reservation requested (frontend demo). In Step 11, we’ll save it
              to the DB.
            </div>
          )}

          <form onSubmit={onConfirm} noValidate>
            <div className="row2">
              <div className="field">
                <label className="label" htmlFor="name">
                  Name *
                </label>
                <input
                  id="name"
                  className="input"
                  value={form.name}
                  onChange={(e) => {
                    setSubmitted(false);
                    setForm((f) => ({ ...f, name: e.target.value }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  placeholder="Your name"
                  aria-invalid={touched.name && !!errors.name}
                />
                {touched.name && errors.name && (
                  <p className="errorText">{errors.name}</p>
                )}
              </div>

              <div className="field">
                <label className="label" htmlFor="email">
                  Email *
                </label>
                <input
                  id="email"
                  className="input"
                  value={form.email}
                  onChange={(e) => {
                    setSubmitted(false);
                    setForm((f) => ({ ...f, email: e.target.value }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  placeholder="you@example.com"
                  aria-invalid={touched.email && !!errors.email}
                />
                {touched.email && errors.email && (
                  <p className="errorText">{errors.email}</p>
                )}
              </div>
            </div>

            {touched.table && errors.table && (
              <p className="errorText" style={{ marginTop: 10 }}>
                {errors.table}
              </p>
            )}

            <div className="actionsRow">
              <button
                className="btn btnPrimary"
                type="submit"
                disabled={!canSubmit}
              >
                Confirm Reservation
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setDate("");
                  setTime("");
                  setSelectedTable("");
                  setForm({ name: "", email: "" });
                  setTouched({});
                  setSubmitted(false);
                }}
              >
                Reset
              </button>
            </div>

            <p className="helper" style={{ marginTop: 10 }}>
              Selected: <b>{date || "—"}</b> • <b>{time || "—"}</b> • Table:{" "}
              <b>{selectedTable || "—"}</b>
            </p>
          </form>
        </section>

        {/* RIGHT PANEL */}
        <section className="card tableMapSection" aria-label="Table map">
          <div className="tableMapHeader">
            <div>
              <h2 className="panelTitle" style={{ margin: 0 }}>
                2) Pick a table
              </h2>
              <p className="helper" style={{ marginTop: 6 }}>
                Unavailable tables are dark. (Demo for now)
              </p>
            </div>

            <div className="legend" aria-label="Legend">
              <span>
                <span className="legendDot dotAvail" />
                Available
              </span>
              <span>
                <span className="legendDot dotSel" />
                Selected
              </span>
              <span>
                <span className="legendDot dotUn" />
                Unavailable
              </span>
            </div>
          </div>

          <div className="tableMapBody">
            {!date || !time ? (
              <div className="card" style={{ marginTop: 0 }}>
                <p className="helper" style={{ margin: 0 }}>
                  Select a date and time to see availability.
                </p>
              </div>
            ) : (
              <div className="tableGroupsWrap">
                {tableGroups.map((g) => (
                  <div key={g.label} className="groupBlock">
                    <div className="groupHeader">{g.label}</div>

                    <div className="mapFlex" role="list" aria-label={g.label}>
                      {g.items.map((id) => {
                        const unavailable = unavailableSet.has(id);
                        const selected = selectedTable === id;

                        return (
                          <button
                            key={id}
                            type="button"
                            className={
                              unavailable
                                ? "tableBtn unavailable"
                                : selected
                                ? "tableBtn selected"
                                : "tableBtn"
                            }
                            disabled={unavailable}
                            onClick={() => {
                              setSubmitted(false);
                              setSelectedTable(id);
                              setTouched((t) => ({ ...t, table: true }));
                            }}
                            aria-label={`${id} table for ${g.seats} people`}
                          >
                            <span className="badgeSeats">{g.seats} seats</span>
                            <div className="tableId">{id}</div>
                            <div className="tableMeta">
                              {unavailable
                                ? "Unavailable"
                                : selected
                                ? "Selected"
                                : "Tap to select"}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <div style={{ height: 26 }} />
    </div>
  );
}
