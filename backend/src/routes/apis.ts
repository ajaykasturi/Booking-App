import express from "express";
import userRouter from "./users";
import authRouter from "./auth";
import myHotelsRouter from "./my-hotels";
const router = express.Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/my-hotels", myHotelsRouter);
export default router;
