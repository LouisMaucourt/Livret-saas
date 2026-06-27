import { sql } from "./client";
import { readFileSync } from "fs";

const seed = readFileSync("./backend/seed.sql", "utf-8");

async function runSeed() {
  try {
    await sql.unsafe(seed);
    console.log("🌱 Seed OK");
  } catch (err) {
    console.error("Seed error", err);
  }
}

runSeed();