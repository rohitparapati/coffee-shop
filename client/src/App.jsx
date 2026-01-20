import { useEffect, useState } from "react";

export default function App() {
  const [apiStatus, setApiStatus] = useState("Checking API...");

  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((r) => r.json())
      .then((data) => setApiStatus(data.message))
      .catch(() => setApiStatus("API not reachable ❌ (is server running?)"));
  }, []);

  return (
    <div className="container">
      <h1 style={{ marginBottom: 6 }}>Coffee Shop (Starter)</h1>
      <p style={{ color: "rgba(245,245,247,0.75)", marginTop: 0 }}>
        Step 0: Client + Server running locally.
      </p>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>API Status</h2>
        <p style={{ marginBottom: 0 }}>{apiStatus}</p>
      </div>

      <div style={{ height: 16 }} />

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Next</h2>
        <p style={{ color: "rgba(245,245,247,0.75)" }}>
          In Step 1 we’ll add <b>react-router</b>, navbar, layout, and smooth scroll.
        </p>
      </div>
    </div>
  );
}
