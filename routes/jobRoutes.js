import express from "express";
import  {createJob, applyForJob}  from "../controllers/jobController.js";

const router = express.Router();

// Create job route (for employers)
router.post("/create", createJob);

// Apply for job route (for job applicants)
router.post("/:jobId/apply", applyForJob);

export default router;
