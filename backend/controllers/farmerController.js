// controllers/farmerController.js
import Farmer from "../models/Farmer.js";
import mongoose from "mongoose";

// Get all farmers
export const getAllFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find();
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching farmers" });
  }
};

// Get a single farmer by ID
// Controller function to get a farmer by ID
// Get a single farmer by ID
export const getFarmerById = async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters

  // Validate the ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid farmer ID");
    return res.status(400).json({ message: "Invalid farmer ID" });
  }

  try {
    // Find the farmer by ID
    const farmer = await Farmer.findById(id);

    // If no farmer is found, return 404
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    // Return the found farmer
    res.status(200).json(farmer);
  } catch (error) {
    console.error("Error fetching farmer:", error); // Log the error
    res.status(500).json({ message: "Error fetching farmer", error });
  }
};

// Add a comment to a farmer
export const addComment = async (req, res) => {
  const { id } = req.params;
  const { user, comment, rating } = req.body;

  try {
    const farmer = await Farmer.findById(id);
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    const newComment = { user, comment, rating }; // Create a new comment object
    farmer.comments.push(newComment); // Push the comment to the farmer's comments array

    await farmer.save(); // Save the farmer with the new comment
    res.status(201).json(farmer); // Return the updated farmer data
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

// Like a comment
export const likeComment = async (req, res) => {
  const { id } = req.params;
  const { commentIndex } = req.body;

  try {
    const farmer = await Farmer.findById(id);
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    // Ensure the comment exists
    if (!farmer.comments[commentIndex]) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Increment likes for the comment
    farmer.comments[commentIndex].likes += 1;

    await farmer.save(); // Save the updated farmer
    res.status(200).json(farmer);
  } catch (error) {
    res.status(500).json({ message: "Error liking comment", error });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const { commentIndex } = req.body;

  try {
    const farmer = await Farmer.findById(id);
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    // Ensure the comment exists
    if (!farmer.comments[commentIndex]) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Remove the comment
    farmer.comments.splice(commentIndex, 1);

    await farmer.save(); // Save the farmer with the updated comments array
    res.status(200).json(farmer);
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
};
