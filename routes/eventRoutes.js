import express from "express";
import  createEvent  from "../controllers/eventController.js";

const router = express.Router();

// Create a new event
router.post("/create", createEvent);

export default router;
