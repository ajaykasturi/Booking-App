import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import "dotenv/config";
import registerInputValidator from "../middlewares/registerInputValidator";
import { verifyToken } from "../middlewares/auth";
const router = express.Router();

router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const user = await User.find({ _id: userId }, { password: 0, __v: 0 });
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    res.json(user[0]);
  } catch {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.post(
  "/register",
  registerInputValidator,
  async (req: Request, res: Response) => {
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      user = new User(req.body);
      await user.save();
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 8640000,
      });
      return res.status(200).json({ message: "signed up" });
    } catch (error: any) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;
