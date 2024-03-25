import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const port = 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "hello" });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
