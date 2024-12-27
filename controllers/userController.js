import db from "../configs/db.js";

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

export default updateProfile;