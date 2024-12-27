import db from "../configs/db.js";

const createPost = async (req, res) => {
  const { user_id, body, image, video, cover, pinned } = req.body;
  const query =
    "INSERT INTO Post (user_id, body, image, video, cover, pinned) VALUES (?, ?, ?, ?, ?, ?)";

  try {
    const result = await db.query(query, [
      user_id,
      body,
      image,
      video,
      cover,
      pinned,
    ]);
    res
      .status(201)
      .json({ message: "Post created successfully", postId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Error creating post" });
  }
};

const createComment = async (req, res) => {
  const { user_id, body } = req.body;
  const { postId } = req.params; // Extract postId from route

  const query = "INSERT INTO Comment (user_id, body, post_id) VALUES (?, ?, ?)";

  try {
    const result = await db.query(query, [user_id, body, postId]);
    res.status(201).json({
      message: "Comment added successfully",
      commentId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ message: "Error adding comment" });
  }
};

export  { createPost, createComment };