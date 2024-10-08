// routes/farmerRoutes.js
import express from "express";
import {
  getAllFarmers,
  getFarmerById,
  addComment,
  likeComment,
  deleteComment,
} from "../controllers/farmerController.js"; // Import the farmer controller methods

const router = express.Router();

// Get all farmers
router.get("/", getAllFarmers);

// Get a single farmer by ID
router.get("/:id", getFarmerById);

// Add a comment to the farmer's profile
router.post("/:id/comments", addComment);

// Like a comment
router.post("/:id/comments/like", likeComment);

// Delete a comment
router.delete("/:id/comments", deleteComment);

export default router;
