import express from "express";
import userRouter from "./users";
import authRouter from "./auth";
import myHotelRouter from "./my-hotels";
import hotelsRouter from "./hotels";
const router = express.Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/my-hotels", myHotelRouter);
router.use("/hotels", hotelsRouter);
export default router;
