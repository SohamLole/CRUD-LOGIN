const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "users.db");

// Ensure DB file exists
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, "");
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("DB error:", err);
  } else {
    console.log("SQLite DB opened at:", dbPath);
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    verified INTEGER DEFAULT 0,
    token TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS tenants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fname TEXT,
    mname TEXT,
    lname TEXT,
    bdate TEXT,
    paddress TEXT
  )
`);

module.exports = db;
