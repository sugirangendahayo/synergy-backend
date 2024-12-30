import express from "express";
import  {updateProfile, getUserDetails}  from "../controllers/userController.js";

const router = express.Router();

router.put("/edit-profile", updateProfile);
router.get("/user-details", getUserDetails);

export default router;
