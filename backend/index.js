import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import cors middleware
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import farmerRoute from "./routes/farmerRoute.js"; // Make sure this route is correctly defined

dotenv.config({});

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS with more flexible configuration
app.use(
  cors({
    origin: "http://localhost:3001", // Adjust this to match your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Parse JSON bodies
app.use(express.json());

// Routes
app.use("/api/v1/user", userRoute); // User-related routes
app.use("/api/v1/farmer", farmerRoute); // Farmer-related routes

// Route for farmers (if using `/farmers`)
app.use("/api/v1/farmers", farmerRoute); // This route will match `/farmers` endpoint if needed

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
