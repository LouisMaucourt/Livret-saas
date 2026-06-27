import { sql } from "./client";
import { readFileSync } from "fs";

const schema = readFileSync("./backend/schema.sql", "utf-8");

async function migrate() {
  try {
    await sql.begin(async (tx) => {
      await tx.unsafe(schema);
    });

    console.log("✅ Migration OK");
  } catch (err) {
    console.error("❌ Migration failed");
    console.error(err);
  } finally {
    process.exit();
  }
}

migrate();