import { Request, Response, NextFunction } from "express";
import { hotelSchema } from "../validators/schemaValidator";
function hotelInputValidator(req: Request, res: Response, next: NextFunction) {
  try {
    req.body.pricePerNight = parseInt(req.body.pricePerNight);
    req.body.starRating = parseInt(req.body.starRating);
    req.body.adultCount = parseInt(req.body.adultCount);
    req.body.childCount = parseInt(req.body.childCount);
    const parsed = hotelSchema.safeParse(req.body);
    if (parsed.success) {
      next();
      return;
    }
    res.status(411).json({ errors: parsed?.error?.issues });
    return;
  } catch (err) {
    return res.status(500).json("something went wrong");
  }
}

export default hotelInputValidator;
