// controllers/farmerController.js
import Farmer from "../models/Farmer.js";

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
export const getFarmerById = async (req, res) => {
  try {
    // Find farmer by ID from route parameters
    const farmer = await Farmer.findById(req.params.id);

    // If no farmer is found, return a 404 response
    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    // Return the farmer data as JSON if found
    res.json(farmer);
  } catch (error) {
    // Catch any server errors and return a 500 response
    res.status(500).json({ error: "Error fetching farmer" });
  }
};

// Add a comment to the farmer's profile
export const addComment = async (req, res) => {
  const { user, comment, rating } = req.body;

  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    const newComment = {
      user,
      comment,
      rating,
      likes: 0,
      replies: [],
    };

    farmer.comments.push(newComment);
    await farmer.save();

    res.json(farmer);
  } catch (error) {
    res.status(500).json({ error: "Error adding comment" });
  }
};

// Like a comment
export const likeComment = async (req, res) => {
  const { commentIndex } = req.body;

  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    farmer.comments[commentIndex].likes += 1;
    await farmer.save();

    res.json(farmer);
  } catch (error) {
    res.status(500).json({ error: "Error liking comment" });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  const { commentIndex } = req.body;

  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    farmer.comments.splice(commentIndex, 1);
    await farmer.save();

    res.json(farmer);
  } catch (error) {
    res.status(500).json({ error: "Error deleting comment" });
  }
};
