import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import apiRouter from "./routes/apis";
mongoose.connect(process.env.MONGODB_URL as string);
const app = express();
const port = 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", apiRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "hello" });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
