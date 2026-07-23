import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import { connectDB } from "./src/db/mongodb.js";
import authRoutes from "./src/routers/authRouter.js";
import accountRoutes from "./src/routers/accountRouter.js";
import transactionRoutes from "./src/routers/transactionRouter.js";

export const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URI || "http://localhost:3000" }));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/accounts/:accountId/transactions", transactionRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});