import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema(
  {
    fullName: {
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
    password: {
      type: String,
      required: true,
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
  { timestamps: true } // Add timestamps for createdAt and updatedAt
);

// Check if the model is already compiled before creating it
export default mongoose.models.Farmer || mongoose.model("Farmer", farmerSchema);
