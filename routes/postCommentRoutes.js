import express from "express";
import { createPost, createComment } from "../controllers/postController.js";

const router = express.Router();

// Create a new post
router.post("/create", createPost);

// Create a comment on a specific post
router.post("/:postId/comment", createComment);

export default router;
