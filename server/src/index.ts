import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import generateRoute from "./routes/generate";
import historyRoute from "./routes/history";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/generate", generateRoute);
app.use("/history", historyRoute);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🧠 GPT CodeGen API running on port ${PORT}`);
});
