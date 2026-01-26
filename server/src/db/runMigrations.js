import fs from "fs";
import path from "path";

export default async function runMigrations(db) {
  const migrationsDir = path.join(process.cwd(), "src", "db", "migrations");

  if (!fs.existsSync(migrationsDir)) {
    console.log("ℹ️ No migrations folder, skipping.");
    return;
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("ℹ️ No migration files found.");
    return;
  }

  try {
    await db.exec("BEGIN");
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
      await db.exec(sql);
    }
    await db.exec("COMMIT");
    console.log(`✅ Ran ${files.length} migration(s)`);
  } catch (err) {
    await db.exec("ROLLBACK");
    console.error("❌ Migration failed:", err);
    throw err;
  }
}
