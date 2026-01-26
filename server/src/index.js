const express = require("express");
const cors = require("cors");

const adminOffersRoutes = require("./routes/adminOffers");
const healthRoutes = require("./routes/health");
const menuRoutes = require("./routes/menu");
const offersRoutes = require("./routes/offers");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: false
  })
);

app.use(express.json());

// API routes
app.use("/api", adminOffersRoutes);
app.use("/api", healthRoutes);
app.use("/api", menuRoutes);
app.use("/api", offersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});
