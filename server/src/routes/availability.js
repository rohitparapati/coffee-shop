import { Router } from "express";
import db from "../db/db.js";

const router = Router();

/**
 * GET /api/availability?date=YYYY-MM-DD&time=HH:MM
 * Returns:
 * { date, time, availability: [{ tableId, available }] }
 */
router.get("/", async (req, res) => {
  try {
    const { date, time } = req.query;

    if (!date || !time) {
      return res.status(400).json({ error: "date and time are required" });
    }

    // All tables in the shop (must match your frontend IDs)
    const allTables = [
      // 2-seat (5)
      "T2-01",
      "T2-02",
      "T2-03",
      "T2-04",
      "T2-05",
      // 4-seat (5)
      "T4-01",
      "T4-02",
      "T4-03",
      "T4-04",
      "T4-05",
      // 8-seat (4)
      "T8-01",
      "T8-02",
      "T8-03",
      "T8-04",
    ];

    // Find booked tables at that exact date+time (active only)
    const rows = await db.all(
      `SELECT table_id
       FROM reservations
       WHERE date = ?
         AND time = ?
         AND status = 'active'`,
      [date, time]
    );

    const booked = new Set(rows.map((r) => r.table_id));

    const availability = allTables.map((tableId) => ({
      tableId,
      available: !booked.has(tableId),
    }));

    return res.json({ date, time, availability });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load availability" });
  }
});

export default router;
