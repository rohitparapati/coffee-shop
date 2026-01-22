import { useMemo, useState } from "react";
import "../styles/contact.css";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function normalizePhone(phone) {
  return phone.replace(/[^\d+]/g, "").trim();
}

export default function Contact() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => {
    const e = {};

    if (!values.name.trim()) e.name = "Name is required.";
    if (!values.email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(values.email)) e.email = "Enter a valid email.";

    const phoneClean = normalizePhone(values.phone);
    if (values.phone.trim() && phoneClean.length < 7) {
      e.phone = "Phone number looks too short.";
    }

    if (!values.message.trim()) e.message = "Message is required.";
    else if (values.message.trim().length < 10) {
      e.message = "Message should be at least 10 characters.";
    }
    else if (values.message.length > 500) {
      e.message = "Please keep message under 500 characters.";
    }

    return e;
  }, [values]);

  const canSubmit = Object.keys(errors).length === 0;

  function onChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  function onBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  }

  function markAllTouched() {
    setTouched({ name: true, email: true, phone: true, message: true });
  }

  function onSubmit(e) {
    e.preventDefault();
    markAllTouched();

    if (!canSubmit) return;

    // Frontend-only "submit" (no backend yet)
    setSubmitted(true);

    // Clear form after submit
    setValues({ name: "", email: "", phone: "", message: "" });
    setTouched({});
  }

  return (
    <div className="container">
      <h1 className="contactTitle">Contact Us</h1>
      <p className="contactSub">
        Have a question, feedback, or a special request? Send a message and we’ll
        get back to you.
      </p>

      <div style={{ height: 14 }} />

      <div className="contactGrid">
        {/* Left: info */}
        <aside className="card">
          <h2 className="formTitle">Store Info</h2>

          <div className="infoList">
            <div className="infoItem">
              <span className="infoLabel">Email</span>
              <p className="infoValue">hello@auroracoffee.com</p>
            </div>
            <div className="infoItem">
              <span className="infoLabel">Phone</span>
              <p className="infoValue">(314) 555-0189</p>
            </div>
            <div className="infoItem">
              <span className="infoLabel">Hours</span>
              <p className="infoValue">Mon–Sun: 7:00 AM – 8:00 PM</p>
            </div>
          </div>

          <div className="socialRow" aria-label="Social links">
            <a className="btn" href="#" aria-label="Instagram (placeholder)">
              Instagram
            </a>
            <a className="btn" href="#" aria-label="Facebook (placeholder)">
              Facebook
            </a>
            <a className="btn" href="#" aria-label="TikTok (placeholder)">
              TikTok
            </a>
          </div>

          <div style={{ height: 10 }} />
          <p style={{ color: "rgba(245,245,247,0.72)", marginBottom: 0 }}>
            (will add to store messages to backend)
          </p>
        </aside>

        {/* Right: form */}
        <section className="card" aria-label="Contact form">
          <h2 className="formTitle">Send a Message</h2>

          {submitted && (
            <div className="card successBox" role="status" aria-live="polite" style={{ marginTop: 12 }}>
              ✅ Message sent (frontend demo). We’ll connect this to the backend in Step 13.
            </div>
          )}

          <form className="formGrid" onSubmit={onSubmit} noValidate>
            <div className="field">
              <label className="label" htmlFor="name">Name *</label>
              <input
                id="name"
                name="name"
                className="input"
                placeholder="Your name"
                value={values.name}
                onChange={onChange}
                onBlur={onBlur}
                aria-invalid={touched.name && !!errors.name}
                aria-describedby={errors.name ? "name-err" : undefined}
              />
              {touched.name && errors.name && (
                <p id="name-err" className="errorText">{errors.name}</p>
              )}
            </div>

            <div className="field">
              <label className="label" htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={values.email}
                onChange={onChange}
                onBlur={onBlur}
                aria-invalid={touched.email && !!errors.email}
                aria-describedby={errors.email ? "email-err" : undefined}
              />
              {touched.email && errors.email && (
                <p id="email-err" className="errorText">{errors.email}</p>
              )}
            </div>

            <div className="field">
              <label className="label" htmlFor="phone">Phone (optional)</label>
              <input
                id="phone"
                name="phone"
                className="input"
                placeholder="(314) 555-1234"
                value={values.phone}
                onChange={onChange}
                onBlur={onBlur}
                aria-invalid={touched.phone && !!errors.phone}
                aria-describedby={errors.phone ? "phone-err" : undefined}
              />
              {touched.phone && errors.phone && (
                <p id="phone-err" className="errorText">{errors.phone}</p>
              )}
            </div>

            <div className="field">
              <label className="label" htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                className="textarea"
                placeholder="Tell us what you need..."
                value={values.message}
                onChange={onChange}
                onBlur={onBlur}
                aria-invalid={touched.message && !!errors.message}
                aria-describedby={errors.message ? "msg-err" : undefined}
              />
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                {touched.message && errors.message ? (
                  <p id="msg-err" className="errorText">{errors.message}</p>
                ) : (
                  <span />
                )}
                <span style={{ color: "rgba(245,245,247,0.6)", fontSize: 13 }}>
                  {values.message.length}/500
                </span>
              </div>
            </div>

            <div className="actionsRow">
              <button className="btn btnPrimary" type="submit" disabled={!canSubmit}>
                Send Message
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setValues({ name: "", email: "", phone: "", message: "" });
                  setTouched({});
                  setSubmitted(false);
                }}
              >
                Reset
              </button>
              {!canSubmit && (
                <span style={{ color: "rgba(245,245,247,0.72)", fontSize: 13 }}>
                  Please fix the highlighted fields.
                </span>
              )}
            </div>
          </form>
        </section>
      </div>

      <div style={{ height: 26 }} />
    </div>
  );
}
