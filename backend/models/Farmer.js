// models/Farmer.js
import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure that each farmer has a unique email
    },
    phone: {
      type: String,
      required: true,
      unique: true, // Ensure that each farmer has a unique phone number
    },
    bio: {
      type: String,
      required: true,
    },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5 },
        likes: { type: Number, default: 0 },
        replies: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
); // Add timestamps for createdAt and updatedAt

export default mongoose.model("Farmer", farmerSchema);
