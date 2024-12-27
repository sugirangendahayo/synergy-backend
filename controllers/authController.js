import bcrypt from "bcrypt";
import db from "../configs/db.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import roles from "../configs/roles.js";

app.use(cookieParser());

const signup = (req, res) => {
  const { username, first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if the user already exists in the database
  db.query("SELECT * FROM users WHERE email = ?",[email],
    async (err, results) => {
      if (err) {
        console.log("Error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      db.query(
        "INSERT INTO users (username, first_name, last_name, email, password) VALUES (?, ?, ?, ? ,?)",
        [username, first_name, last_name, email, hashedPassword],
        (err, results) => {
          if (err) {
            console.log("Error:", err);
            return res.status(500).json({ message: "Internal server error" });
          }

          return res
            .status(201)
            .json({ message: "User registered successfully" });
        }
      );
    }
  );
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ Error: "Email and password are required" });
  }

  const query = "SELECT * FROM Users WHERE email = ?";

  try {
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ Error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ Error: "User not found" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ Error: "Invalid credentials" });
      }

      const hisRole = roles.USER;
      const token = jwt.sign(
        { email: user.email, role: hisRole },
        "jwt-secret-key",
        { expiresIn: "1d" }
      );

      // Set the token in the cookies using cookie-parser
      res.cookie("token", token, { httpOnly: true, secure: false });
      return res
        .status(200)
        .json({ message: "Login successful", role: user.role });
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ Error: "An error occurred" });
  }
};

export default signup;