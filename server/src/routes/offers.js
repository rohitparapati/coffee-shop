import { Router } from "express";
import db from "../db/db.js"; // ✅ uses your existing src/db.js (sqlite open)

const router = Router();

// GET /api/offers  (because index.js mounts: app.use("/api/offers", offersRouter))
router.get("/", async (req, res) => {
  try {
    const rows = await db.all(
      `SELECT id, type, title, description, image_url, valid_from, valid_to, is_active
       FROM offers
       WHERE is_active = 1
       ORDER BY valid_from DESC`
    );

    const offers = rows.map((o) => ({
      id: o.id,
      type: o.type,
      title: o.title,
      description: o.description,
      image: o.image_url,
      validFrom: o.valid_from,
      validTo: o.valid_to,
      isActive: !!o.is_active,
    }));

    res.json({ offers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load offers." });
  }
});

export default router;
