import bcrypt from "bcrypt";
import db from "../configs/db.js";

const registerCompany = (req, res) => {
  const { username, first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if the user already exists in the database
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
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
        "INSERT INTO users (username, first_name, last_name, email, password) VALUES (?, ?, ?,? ,?)",
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

export default registerCompany;
