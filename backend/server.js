import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adsRouter from "./routes/ads.js";
import categoriesRouter from "./routes/categories.js";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/ads", adsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Serverul ruleaza pe http://localhost:${PORT}`);
})