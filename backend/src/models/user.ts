import mongoose from "mongoose";
import * as argon2 from "argon2";
export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});
//pre middleware for encrypting the password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await argon2.hash(this.password);
  }
  next();
});
const User = mongoose.model<UserType>("User", userSchema);

export default User;
