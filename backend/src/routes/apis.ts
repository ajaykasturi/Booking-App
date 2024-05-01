import express from "express";
import userRouter from "./users";
import authRouter from "./auth";
import myHotelRouter from "./my-hotels";
import hotelsRouter from "./hotels";
import myBookingsRouter from "./my-bookings";
const router = express.Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/my-hotels", myHotelRouter);
router.use("/hotels", hotelsRouter);
router.use("/my-bookings", myBookingsRouter);
export default router;
