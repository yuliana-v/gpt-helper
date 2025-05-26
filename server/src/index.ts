import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import generateRoute from "./routes/generate";
import historyRoute from "./routes/history";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/generate", generateRoute);
app.use("/history", historyRoute);

// Error handling
app.use(notFoundHandler); // Handle 404 errors
app.use(errorHandler); // Handle all other errors

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🧠 GPT CodeGen API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
