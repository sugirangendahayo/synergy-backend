import express from "express";
import  updateProfile  from "../controllers/userController.js";

const router = express.Router();

router.put("/edit-profile", updateProfile);

export default router;
