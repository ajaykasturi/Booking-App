import { NextFunction, Request, Response } from "express";
import { registerSchema } from "../validators/schemaValidator";
function registerInputValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // console.log(req.body);
  const parsed = registerSchema.safeParse(req.body);
  if (parsed.success) {
    next();
    return;
  }
  res.status(411).json({ errors: parsed?.error?.issues });
  return;
}
export default registerInputValidator;
