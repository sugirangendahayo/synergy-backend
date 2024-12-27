import express from "express";
import  createCommunity  from "../controllers/communityController.js";

const router = express.Router();

// Create a new community
router.post("/create", createCommunity);

export default router;
