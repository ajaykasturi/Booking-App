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
      const imageURLS = await uploadImages(imageFiles);
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
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching hotels" });
  }
});
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    return res.json(hotel);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching hotels" });
  }
});
router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles", 6),
  hotelInputValidator,
  async (req: Request, res: Response) => {
    try {
      const updatedHotel: HotelType = req.body;
      // console.log(updatedHotel);
      //saving the new hotel in the DB
      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updatedHotel,
        { new: true }
      );
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      const imageFiles = req.files as Express.Multer.File[];
      //uploading the images to cloudinary
      const updatedImageURLS = await uploadImages(imageFiles);
      //if the upload is successful, add the URLs to new hotel
      hotel.imageURLS = [
        ...updatedImageURLS,
        ...(updatedHotel.imageURLS || []),
      ];
      hotel.lastUpdate = new Date();
      await hotel.save();
      //returning 201 status code
      return res.status(201).json({ message: "hotel updated", hotel });
    } catch (err) {
      console.log("Error creating hotel: ", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);
async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });
  const imageURLS = await Promise.all(uploadPromises);
  return imageURLS;
}
export default router;
