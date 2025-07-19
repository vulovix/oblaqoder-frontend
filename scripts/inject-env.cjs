const fs = require("fs");
const path = require("path");

const { env } = require("../env"); // load your local env.js
console.log("🔑 Loaded env:", env);

const targetPath = path.join(__dirname, "../src/configuration/index.ts");

// Read the existing .ts config file line by line
const lines = fs.readFileSync(targetPath, "utf-8").split("\n");

const resultLines = [];
let skip = false;

for (const line of lines) {
  const trimmed = line.trim();

  // Start skipping if it's one of the SUPABASE exports
  if (trimmed.startsWith("export const SUPABASE_PROJECT_URL =") || trimmed.startsWith("export const SUPABASE_PUBLIC_KEY =")) {
    skip = true;
    continue;
  }

  // If we're in skip mode and this is the end of the export (ends with `;`), stop skipping
  if (skip) {
    if (trimmed.endsWith(";")) {
      skip = false;
    }
    continue;
  }

  resultLines.push(line);
}

// Add new constants to the end
resultLines.push(`export const SUPABASE_PROJECT_URL = "${env.SUPABASE_PROJECT_URL}";`, `export const SUPABASE_PUBLIC_KEY = "${env.SUPABASE_PUBLIC_KEY}";`);

// Write back the modified content
fs.writeFileSync(targetPath, resultLines.join("\n") + "\n", "utf-8");

console.log("✅ src/configuration/index.ts updated with new SUPABASE values!");
