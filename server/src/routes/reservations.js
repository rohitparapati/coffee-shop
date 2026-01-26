import { Router } from "express";
import db from "../db/db.js";

const router = Router();

/**
 * POST /api/reservations
 * Body: { date, time, tableId, name, email }
 */
router.post("/", async (req, res) => {
  try {
    const { date, time, tableId, name, email } = req.body;

    if (!date || !time || !tableId || !name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if table is already reserved (active)
    const existing = await db.get(
      `SELECT id
       FROM reservations
       WHERE date = ?
         AND time = ?
         AND table_id = ?
         AND status = 'active'`,
      [date, time, tableId]
    );

    if (existing) {
      return res.status(409).json({ error: "Table already reserved" });
    }

    // Insert reservation
    await db.run(
      `INSERT INTO reservations
       (date, time, table_id, name, email, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'active', datetime('now'))`,
      [date, time, tableId, name, email]
    );

    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error("Reservation error:", err);
    return res.status(500).json({ error: "Failed to create reservation" });
  }
});

export default router;
