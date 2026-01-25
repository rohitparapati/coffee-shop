const bcrypt = require("bcrypt");
const { getDb } = require("./db");

async function seed() {
  const db = await getDb();

  // 1) Admin seed (only if none exists)
  const adminCountRow = await db.get("SELECT COUNT(*) as cnt FROM admins");
  if (adminCountRow.cnt === 0) {
    const username = "admin";
    const plainPassword = "Admin123!"; // CHANGE LATER
    const password_hash = await bcrypt.hash(plainPassword, 12);

    await db.run(
      "INSERT INTO admins (username, password_hash) VALUES (?, ?)",
      [username, password_hash]
    );

    console.log("✅ Seeded default admin:");
    console.log("   username: admin");
    console.log("   password: Admin123!  (change this later)");
  } else {
    console.log("ℹ️ Admin already exists. Skipping admin seed.");
  }

  // 2) Offers seed (only if empty)
  const offerCountRow = await db.get("SELECT COUNT(*) as cnt FROM offers");
  if (offerCountRow.cnt === 0) {
    await db.run(
      `INSERT INTO offers (type, title, description, image_url, valid_from, valid_to, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        "B1G1",
        "Buy 1 Get 1 Latte",
        "Bring a friend. Second latte is on us (same size).",
        "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80",
        "2026-01-01",
        "2026-12-31",
        1
      ]
    );

    await db.run(
      `INSERT INTO offers (type, title, description, image_url, valid_from, valid_to, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        "2-FOR",
        "2 Croissants for $6",
        "Mix & match butter and chocolate croissants.",
        "https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?auto=format&fit=crop&w=1200&q=80",
        "2026-01-10",
        "2026-02-10",
        1
      ]
    );

    console.log("✅ Seeded offers.");
  } else {
    console.log("ℹ️ Offers already exist. Skipping offers seed.");
  }

  // 3) Menu seed (only if empty)
  const menuCountRow = await db.get("SELECT COUNT(*) as cnt FROM menu_items");
  if (menuCountRow.cnt === 0) {
    const items = [
      ["Espresso", "Coffee", "Bold, rich shot with a smooth crema.", 299,
        "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=900&q=80"],
      ["Latte", "Coffee", "Creamy espresso with silky milk.", 499,
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80"],
      ["Masala Chai", "Tea", "Spiced tea simmered with milk.", 449,
        "https://images.unsplash.com/photo-1594631661960-34762327295a?auto=format&fit=crop&w=900&q=80"],
      ["Butter Croissant", "Pastries", "Flaky, buttery, baked fresh daily.", 379,
        "https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?auto=format&fit=crop&w=900&q=80"],
      ["Turkey Club", "Sandwiches", "Turkey, lettuce, tomato, house sauce.", 949,
        "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=900&q=80"]
    ];

    for (const [name, category, description, price_cents, image_url] of items) {
      await db.run(
        `INSERT INTO menu_items (name, category, description, price_cents, image_url, is_active)
         VALUES (?, ?, ?, ?, ?, 1)`,
        [name, category, description, price_cents, image_url]
      );
    }

    console.log("✅ Seeded menu items.");
  } else {
    console.log("ℹ️ Menu items already exist. Skipping menu seed.");
  }

  console.log("✅ Done.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
