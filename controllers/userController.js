import db from "../configs/db.js";
import jwt from "jsonwebtoken";

const getUserDetails = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ Error: "You are not authenticated" });
  }

  // Verify the JWT token
  jwt.verify(token, "jwt-secret-key", (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err.message);
      return res.status(403).json({ Error: "Invalid token" });
    }

    // Fetch user details from the database
    const query = "SELECT id, username, email FROM users WHERE email = ?";
    db.query(query, [decoded.email], (err, results) => {
      if (err) {
        console.error("Database query error:", err.message);
        return res.status(500).json({ Error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ Error: "User not found" });
      }

      const user = results[0];
      return res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    });
  });
};

const updateProfile = async (req, res) => {
  const {
    userId,
    first_name,
    last_name,
    email,
    gender,
    image,
    bio,
    skills,
    social_media_links,
    community_user,
  } = req.body;
  const query = `UPDATE Users SET first_name = ?, last_name = ?, email = ?, gender = ?, image = ?, bio = ?, skills = ?, social_media_links = ?, community_user = ? WHERE id = ?`;

  try {
    await db.query(query, [
      first_name,
      last_name,
      email,
      gender,
      image,
      bio,
      skills,
      social_media_links,
      community_user,
      userId,
    ]);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

export {updateProfile, getUserDetails};