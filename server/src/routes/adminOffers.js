const express = require("express");
const router = express.Router();
const { getDb } = require("../db");

// List ALL offers (including inactive)
router.get("/admin/offers", async (req, res) => {
  try {
    const db = await getDb();
    const rows = await db.all(
      `SELECT id, type, title, description, image_url, valid_from, valid_to, is_active, created_at
       FROM offers
       ORDER BY created_at DESC`
    );

    res.json({
      offers: rows.map((o) => ({
        id: o.id,
        type: o.type,
        title: o.title,
        description: o.description,
        image: o.image_url,
        validFrom: o.valid_from,
        validTo: o.valid_to,
        isActive: !!o.is_active,
        createdAt: o.created_at
      }))
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load admin offers." });
  }
});

// Create offer
router.post("/admin/offers", async (req, res) => {
  try {
    const { type, title, description, imageUrl, validFrom, validTo, isActive } =
      req.body || {};

    if (!type || !title || !description || !validFrom || !validTo) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const db = await getDb();
    const result = await db.run(
      `INSERT INTO offers (type, title, description, image_url, valid_from, valid_to, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        type,
        title.trim(),
        description.trim(),
        imageUrl?.trim() || "",
        validFrom,
        validTo,
        isActive ? 1 : 0
      ]
    );

    res.status(201).json({ ok: true, id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: "Failed to create offer." });
  }
});

// Toggle active
router.patch("/admin/offers/:id/toggle", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = await getDb();

    const row = await db.get(`SELECT is_active FROM offers WHERE id = ?`, [id]);
    if (!row) return res.status(404).json({ error: "Offer not found." });

    const next = row.is_active ? 0 : 1;
    await db.run(`UPDATE offers SET is_active = ? WHERE id = ?`, [next, id]);

    res.json({ ok: true, isActive: !!next });
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle offer." });
  }
});

// Delete offer
router.delete("/admin/offers/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = await getDb();

    const row = await db.get(`SELECT id FROM offers WHERE id = ?`, [id]);
    if (!row) return res.status(404).json({ error: "Offer not found." });

    await db.run(`DELETE FROM offers WHERE id = ?`, [id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete offer." });
  }
});

export default router;

