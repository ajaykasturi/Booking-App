import { NextFunction, Request, Response } from "express";
import { hotelIdSchema } from "../validators/schemaValidator";

function hotelIdValidator(req: Request, res: Response, next: NextFunction) {
  const parsed = hotelIdSchema.safeParse(req.params.id);
  if (parsed.success) {
    next();
    return;
  }
  res.status(411).json({ errors: parsed?.error?.issues });
  return;
}
export default hotelIdValidator;
