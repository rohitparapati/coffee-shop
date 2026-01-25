const express = require("express");
const router = express.Router();
const { getDb } = require("../db");

router.get("/menu", async (req, res) => {
  try {
    const db = await getDb();
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
      image: r.image_url
    }));

    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: "Failed to load menu." });
  }
});

module.exports = router;
