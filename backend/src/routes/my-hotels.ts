import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../models/hotel";
import { verifyToken } from "../middlewares/auth";
import hotelInputValidator from "../middlewares/hotelinputValidator";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
  },
});
router.get("/", (req, res) => {
  console.log(req.body);
  res.send("hello");
});
router.post(
  "/",
  verifyToken,
  upload.array("imageFiles", 6),
  hotelInputValidator,
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;
      //uploading the images to cloudinary
      const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });
      const imageURLS = await Promise.all(uploadPromises);
      //if the upload is successful, add the URLs to new hotel
      newHotel.imageURLS = imageURLS;
      newHotel.lastUpdate = new Date();
      newHotel.userId = req.userId;
      //saving the new hotel in the DB
      const hotel = new Hotel(newHotel);
      await hotel.save();
      //returning 201 status code
      return res.status(201).json({ message: "hotel has been created", hotel });
    } catch (err) {
      console.log("Error creating hotel: ", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;
