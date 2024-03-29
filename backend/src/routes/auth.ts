import express, { Request, Response } from "express";
import authInputValidator from "../middlewares/authInputValidator";
import User from "../models/user";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { verifyToken } from "../middlewares/auth";
const router = express.Router();

router.post(
  "/signin",
  authInputValidator,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid Crendentials" });
      }
      const isMatch = await argon2.verify(user.password, password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid Crendentials" });
      }

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

      return res.json({ userId: user._id, token });
    } catch (error: any) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);
router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).json({ userId: req.userId });
});
router.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send();
});
export default router;
