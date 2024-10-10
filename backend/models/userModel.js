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
      required: true, // Add password field and make it required
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
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
        comment: { type: String, required: true }, // Make comment required
        rating: { type: Number, min: 1, max: 5 }, // Rating should be between 1 and 5
        likes: { type: Number, default: 0 },
        replies: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
); // Add timestamps for createdAt and updatedAt

export default mongoose.model("Farmer", farmerSchema);
