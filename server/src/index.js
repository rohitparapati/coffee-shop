import express from "express";
import cors from "cors";

import db from "./db/db.js";
import runMigrations from "./db/runMigrations.js";

import offersRouter from "./routes/offers.js";
import menuRouter from "./routes/menu.js";
import availabilityRouter from "./routes/availability.js";
import reservationsRouter from "./routes/reservations.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/offers", offersRouter);
app.use("/api/menu", menuRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/reservations", reservationsRouter);

// ✅ START SERVER ONLY ONCE (after migrations)
(async () => {
  await runMigrations(db);

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
})();
