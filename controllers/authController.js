import bcrypt from "bcrypt";
import express from 'express'
import db from "../configs/db.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import roles from "../middleware/roles.js";


const app = express()
app.use(cookieParser());
 
const signup = async (req, res) => {
  const { username, first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if the user already exists
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

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      const hashedPassword = await bcrypt.hash(password, 10);

      // Save user details temporarily in `email_verifications` table
      db.query(
        "INSERT INTO email_verifications (username, first_name, last_name, email, password, token) VALUES (?, ?, ?, ?, ?, ?)",
        [
          username,
          first_name,
          last_name,
          email,
          hashedPassword,
          verificationToken,
        ],
        (err) => {
          if (err) {
            console.log("Error:", err);
            return res.status(500).json({ message: "Internal server error" });
          }

          // Send the verification email
          const verificationLink = `http://localhost:8085/verify-email?token=${verificationToken}`;
          const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASSWORD,
            },
          });

          const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Verify Your Email",
            text: `Click the link to verify your email: ${verificationLink}`,
          };

          transporter.sendMail(mailOptions, (err) => {
            if (err) {
              console.log("Error sending email:", err);
              return res.status(500).json({ message: "Error sending email" });
            }

            return res
              .status(200)
              .json({
                message: "Verification email sent. Please check your inbox.",
              });
          });
        }
      );
    }
  );
};

const verifyEmail = (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Invalid or missing token" });
  }

  // Check the token in the email_verifications table
  db.query(
    "SELECT * FROM email_verifications WHERE token = ?",
    [token],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length === 0) {
        return res
          .status(400)
          .json({ message: "Invalid token or user not found" });
      }

      const user = results[0];

      // Move the user to the `users` table
      db.query(
        "INSERT INTO users (username, first_name, last_name, email, password, email_verified) VALUES (?, ?, ?, ?, ?, 1)",
        [
          user.username,
          user.first_name,
          user.last_name,
          user.email,
          user.password,
        ],
        (err) => {
          if (err) {
            console.error("Error moving user to users table:", err);
            return res.status(500).json({ message: "Internal server error" });
          }

          db.query(
            "DELETE FROM email_verifications WHERE token = ?",
            [token],
            (err) => {
              if (err) {
                console.error("Error deleting verification entry:", err);
                return res
                  .status(500)
                  .json({ message: "Internal server error" });
              }

              res
                .status(200)
                .json({
                  message: "Email verified successfully! You can now log in.",
                });
            }
          );
        }
      );
    }
  );
};


const login = async (req, res) => {
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

      
      const token = jwt.sign(
        { email: user.email, role: roles.USER },
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

export {signup , verifyEmail, login};