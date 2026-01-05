require("dotenv").config({ quiet: true });

if (process.pkg) {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
}

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//Token authentication
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("No token provided");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }

    req.user = user;
    next();
  });
}

// SIGNUP
app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  const token = uuidv4();

  // First check if user already exists
  db.get(
    "SELECT id FROM users WHERE LOWER(email) = LOWER(?)",
    [email],
    (err, row) => {
      if (row) {
        return res.send("User already exists");
      }

      // Insert new user
      db.run(
        "INSERT INTO users (email, password, token) VALUES (?, ?, ?)",
        [email, password, token],
        (err) => {
          if (err) {
            console.error("Signup error:", err.message);
            return res.send("Signup failed. Try again.");
          }

          const verifyLink = `http://localhost:3000/verify?token=${token}`;

          transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your email",
            text: `Click this link to verify:\n${verifyLink}`
          });

          res.send("Signup successful. Please verify your email.");
        }
      );
    }
  );
});



//Verify
app.get("/verify", (req, res) => {
  const token = req.query.token;

  db.run(
    "UPDATE users SET verified=1, token=NULL WHERE token=?",
    [token],
    function () {
      if (this.changes > 0) {
        res.send("Email verified successfully. You can login now.");
      } else {
        res.send("Invalid or expired verification link.");
      }
    }
  );

});



// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, row) => {
      if (!row) return res.send("Invalid credentials");
      if (!row.verified) return res.send("Please verify your email first");
      const token = jwt.sign(
        { id: row.id, email: row.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token });

    }
  );
});

//form data CREATION
app.post("/formsubmit", authenticate, (req, res) => {
  const { fname, mname, lname, bdate, paddress } = req.body;

    // First check if data already exists
    db.get(
        'SELECT id FROM tenants WHERE LOWER(fname) = LOWER(?) AND LOWER(mname) = LOWER(?) AND LOWER(lname) = LOWER(?)',
        [fname, mname, lname],
        (err, row) => {
            if (err) {
                console.error(err);
                return res.send("Database error");
            }

            if (row) {
                return res.send("User already exists");
            }

            // Insert new user
            db.run(
                "INSERT INTO tenants (fname, mname, lname, bdate, paddress) VALUES (?, ?, ?, ?, ?)",
                [fname, mname, lname, bdate, paddress],
                (err) => {
                if (err) {
                    console.error("submission error:", err.message);
                    return res.send("submission failed. Try again.");
                }
                res.send("Form submission successful");
            });
        }
    );
})

//form data READ
app.get("/tenants", authenticate, (_req, res) => {
  db.all("SELECT * FROM tenants ORDER BY id DESC", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json([]);
    }
    res.json(rows);
  });
});

//form data DELETE
app.delete("/tenants/:id", authenticate, (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM tenants WHERE id = ?",
    [id],
    function (err) {
      if (err) return res.send("Delete failed");
      if (this.changes === 0) return res.send("Tenant not found");
      res.send("Tenant deleted successfully");
    }
  );
});

//form data UPDATE
app.put("/tenants/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const { fname, mname, lname, bdate, paddress } = req.body;

  db.run(
    `UPDATE tenants 
     SET fname=?, mname=?, lname=?, bdate=?, paddress=? 
     WHERE id=?`,
    [fname, mname, lname, bdate, paddress, id],
    function (err) {
      if (err) return res.send("Update failed");
      if (this.changes === 0) return res.send("Tenant not found");
      res.send("Tenant updated successfully");
    }
  );
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  if (process.pkg) {
    const { exec } = require("child_process");
    exec(`start http://localhost:${PORT}`);
  }

});

