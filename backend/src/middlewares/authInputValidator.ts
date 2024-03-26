import { NextFunction, Request, Response } from "express";
import { signInSchema } from "../validators/schemaValidator";
function authInputValidator(req: Request, res: Response, next: NextFunction) {
  const parsed = signInSchema.safeParse(req.body);
  if (parsed.success) {
    next();
    return;
  }
  res.status(411).json({ errors: parsed?.error?.issues });
  return;
}
export default authInputValidator;
