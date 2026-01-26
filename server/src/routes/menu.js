import { Router } from "express";
import db from "../db/db.js";

const router = Router();

// GET /api/menu  (mounted in index.js)
router.get("/", async (req, res) => {
  try {
    const rows = await db.all(
      `SELECT id, name, category, description, price_cents, image_url, is_active
       FROM menu_items
       WHERE is_active = 1
       ORDER BY category ASC, name ASC`
    );

    const items = rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      desc: r.description,
      price: (r.price_cents / 100).toFixed(2),
      image: r.image_url,
    }));

    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load menu." });
  }
});

export default router;
