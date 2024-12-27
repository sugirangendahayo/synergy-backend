import db from "../configs/db.js";

 const createCommunity = async (req, res) => {
  const { user_id, name, description, tags, rules } = req.body;
  const query =
    "INSERT INTO Community (user_id, name, description, tags, rules) VALUES (?, ?, ?, ?, ?)";

  try {
    const result = await db.query(query, [
      user_id,
      name,
      description,
      tags,
      rules,
    ]);
    res.status(201).json({
      message: "Community created successfully",
      communityId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating community" });
  }
};
export default createCommunity
