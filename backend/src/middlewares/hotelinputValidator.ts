import express, { Request, Response, NextFunction } from "express";
import { hotelSchema } from "../validators/schemaValidator";
function hotelInputValidator(req: Request, res: Response, next: NextFunction) {
  const parsed = hotelSchema.safeParse(req.body);
  if (parsed.success) {
    next();
    return;
  }
  res.status(411).json({ errors: parsed?.error?.issues });
  return;
}

export default hotelInputValidator;
