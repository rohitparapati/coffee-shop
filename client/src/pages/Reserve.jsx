import { useEffect, useMemo, useState } from "react";
import "../styles/reserve.css";
import { tableGroups } from "../data/tables";

const API = "http://localhost:5001/api";

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

  const [availability, setAvailability] = useState([]); // [{tableId, available}]
  const unavailableSet = useMemo(() => {
    const s = new Set();
    availability.forEach((a) => {
      if (!a.available) s.add(a.tableId);
    });
    return s;
  }, [availability]);

  const [loadingAvail, setLoadingAvail] = useState(false);
  const [availError, setAvailError] = useState("");

  const [form, setForm] = useState({ name: "", email: "" });
  const [touched, setTouched] = useState({});
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" }); // success/error

  // Fetch availability when date+time selected
  useEffect(() => {
    if (!date || !time) {
      setAvailability([]);
      setAvailError("");
      return;
    }

    let alive = true;
    setLoadingAvail(true);
    setAvailError("");

    fetch(`${API}/availability?date=${date}&time=${time}`)
      .then((r) => {
        if (!r.ok) throw new Error("availability failed");
        return r.json();
      })
      .then((data) => {
        if (!alive) return;
        setAvailability(data.availability || []);
        setLoadingAvail(false);
      })
      .catch(() => {
        if (!alive) return;
        setAvailError("Could not load availability. Is the server running?");
        setLoadingAvail(false);
      });

    return () => {
      alive = false;
    };
  }, [date, time]);

  const errors = useMemo(() => {
    const e = {};
    if (!date) e.date = "Select a date.";
    if (!time) e.time = "Select a time slot.";
    if (!selectedTable) e.table = "Select a table.";

    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email.";

    // If selected table becomes unavailable (race condition)
    if (selectedTable && unavailableSet.has(selectedTable)) {
      e.table = "That table is no longer available. Pick another.";
    }

    return e;
  }, [date, time, selectedTable, form, unavailableSet]);

  const canSubmit = Object.keys(errors).length === 0;

  function markAllTouched() {
    setTouched({
      date: true,
      time: true,
      table: true,
      name: true,
      email: true,
    });
  }

  async function refreshAvailability() {
    const a = await fetch(`${API}/availability?date=${date}&time=${time}`).then(
      (x) => x.json()
    );
    setAvailability(a.availability || []);
  }

  async function onConfirm(e) {
    e.preventDefault();
    setStatusMsg({ type: "", text: "" });
    markAllTouched();
    if (!canSubmit) return;

    try {
      const r = await fetch(`${API}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          time,
          tableId: selectedTable,
          name: form.name.trim(),
          email: form.email.trim(),
        }),
      });

      if (r.status === 409) {
        setStatusMsg({
          type: "error",
          text: "That table was just booked. Pick another.",
        });
        await refreshAvailability();
        setSelectedTable("");
        return;
      }

      if (!r.ok) {
        setStatusMsg({
          type: "error",
          text: "Reservation failed. Please try again.",
        });
        return;
      }

      setStatusMsg({ type: "success", text: "✅ Reservation confirmed!" });

      // Refresh availability so the table becomes unavailable immediately
      await refreshAvailability();

      // Reset form (keep date/time so user sees updated availability)
      setForm({ name: "", email: "" });
      setTouched({});
      setSelectedTable("");
    } catch {
      setStatusMsg({
        type: "error",
        text: "Server error. Is the backend running?",
      });
    }
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
        {/* LEFT */}
        <section className="card" aria-label="Reservation details">
          <h2 className="panelTitle">1) Choose date & time</h2>
          <p className="helper">Now connected to backend availability ✅</p>

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
                setStatusMsg({ type: "", text: "" });
                setDate(e.target.value);
                setTime("");
                setSelectedTable("");
                setAvailability([]);
                setAvailError("");
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
                      setStatusMsg({ type: "", text: "" });
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

          {statusMsg.text && (
            <div
              className={statusMsg.type === "success" ? "card successBox" : "card"}
              style={{
                marginTop: 12,
                border:
                  statusMsg.type === "error"
                    ? "1px solid rgba(255,170,170,0.35)"
                    : undefined,
                background:
                  statusMsg.type === "error"
                    ? "rgba(255,170,170,0.10)"
                    : undefined,
              }}
              role="status"
              aria-live="polite"
            >
              {statusMsg.text}
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
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
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
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
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
              <button className="btn btnPrimary" type="submit" disabled={!canSubmit}>
                Confirm Reservation
              </button>
            </div>

            <p className="helper" style={{ marginTop: 10 }}>
              Selected: <b>{date || "—"}</b> • <b>{time || "—"}</b> • Table:{" "}
              <b>{selectedTable || "—"}</b>
            </p>
          </form>
        </section>

        {/* RIGHT */}
        <section className="card tableMapSection" aria-label="Table map">
          <div className="tableMapHeader">
            <div>
              <h2 className="panelTitle" style={{ margin: 0 }}>
                2) Pick a table
              </h2>
              <p className="helper" style={{ marginTop: 6 }}>
                {loadingAvail ? "Loading availability..." : "Unavailable tables are dark."}
              </p>
              {availError && (
                <p className="errorText" style={{ marginTop: 6 }}>
                  {availError}
                </p>
              )}
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
                            disabled={unavailable || loadingAvail}
                            onClick={() => {
                              setStatusMsg({ type: "", text: "" });
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
