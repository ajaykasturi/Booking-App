import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import hotelIdValidator from "../middlewares/hotelIdValidator";
import Stripe from "stripe";
import "dotenv/config";
import { verifyToken } from "../middlewares/auth";
import Razorpay from "razorpay";
import crypto from "crypto";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find().sort("-lastUpdated");
    res.json(hotels);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});
router.get(
  "/search/:id",
  hotelIdValidator,
  async (req: Request, res: Response) => {
    const id = req.params.id.toString();
    try {
      const hotel = await Hotel.findById(id);
      return res.json(hotel);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching hotel", error: error });
    }
  }
);

router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);
    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }
    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;
    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);
    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };
    return res.json(response);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

//
router.post(
  "/:hotelId/bookings/payment-order",
  verifyToken,
  async (req: Request, res: Response) => {
    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;
    try {
      const hotel = await Hotel.findById(hotelId);

      if (!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
      }
      const totalCost = Math.round(hotel.pricePerNight * numberOfNights * 100);
      const options = {
        amount: totalCost,
        currency: "INR",
        receipt: req.userId,
      };
      const instance = new Razorpay({
        key_id: process.env.PAY_KEY_ID || "",
        key_secret: process.env.PAY_KEY_SRECRET || "",
      });
      // const options = req.body;
      const order = await instance.orders.create(options);
      if (!order) {
        return res
          .status(500)
          .json({ message: "payment order creation failed" });
      }
      return res.json({ orderId: order.id, totalCost, receipt: order.receipt });
    } catch (error) {
      return res.status(500).json({ message: "someting went wrong" });
    }
  }
);
router.post("/validatePayment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const sha = crypto.createHmac("sha256", process.env.PAY_KEY_SRECRET || "");
  //order_id + "|" + razorpay_payment_id
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    return res
      .status(400)
      .json({ status: "error", message: "Transaction is not legit!" });
  }
  res.json({
    status: "success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
});

//   "/:hotelId/bookings/payment-intent",
//   verifyToken,
//   async (req: Request, res: Response) => {
//     // 1. total cost
//     // 2. hotelId
//     // 3. userId

//     const { numberOfNights } = req.body;
//     const hotelId = req.params.hotelId;

//     try {
//       const hotel = await Hotel.findById(hotelId);
//       if (!hotel) {
//         return res.status(400).json({ message: "Hotel not found" });
//       }
//       const totalCost = hotel.pricePerNight * numberOfNights;

//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: totalCost,
//         currency: "usd",
//         metadata: {
//           hotelId,
//           userId: req.userId,
//         },
//       });
//       if (!paymentIntent.client_secret) {
//         return res
//           .status(500)
//           .json({ message: "Error Creating Payment Intent" });
//       }
//       const response = {
//         paymentIntentId: paymentIntent.id,
//         clientSecret: paymentIntent.client_secret.toString(),
//         totalCost,
//       };
//       res.send(response);
//     } catch (error) {
//       return res.status(500).json({ message: "something went wrong" });
//     }
//   }
// );
router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const payment_details = req.body.paymentDetails;
      const instance = new Razorpay({
        key_id: process.env.PAY_KEY_ID || "",
        key_secret: process.env.PAY_KEY_SRECRET || "",
      });
      // console.log(payment_details);
      const paymentOrder = await instance.payments.fetch(
        payment_details.payment_id
      );
      // console.log(paymentOrder);
      if (!paymentOrder?.id) {
        return res.status(400).json({ message: "payment Order not found" });
      }
      if (
        paymentOrder.notes.hotelId !== req.params.hotelId ||
        paymentOrder.notes.userId !== req.userId
      ) {
        return res.status(400).json({ message: "payment order mismatch" });
      }
      if (paymentOrder.status !== "captured") {
        return res.status(400).json({
          message: `payment order not succeeded. Status: ${paymentOrder.status}`,
        });
      }
      // console.log(req.body);
      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
      };
      const hotel = await Hotel.findOneAndUpdate(
        { _id: req.params.hotelId },
        {
          $push: { bookings: newBooking },
        }
      );
      if (!hotel) {
        return res.status(400).json({ message: "hotel not found" });
      }
      // await hotel.save();
      res.status(200).send();
    } catch (error) {
      return res.status(500).json({ message: "something went wrong", error });
    }
  }
);

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};
  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }
  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }
  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }
  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }
  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice),
    };
  }
  return constructedQuery;
};

export default router;
