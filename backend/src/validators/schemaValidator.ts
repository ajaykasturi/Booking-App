import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "email must be string",
    })
    .email({ message: "Invalid email address" }),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "password must be string",
    })
    .min(6, { message: "Password must be 6 or more chars long" }),
  confirmPassword: z.string().optional(),
  firstName: z
    .string({
      required_error: "FirstName is required",
      invalid_type_error: "firstname must be string",
    })
    .min(3, { message: "FirstName must be 3 or more chars long " }),
  lastName: z
    .string({
      required_error: "LastName is required",
      invalid_type_error: "lastname must be string",
    })
    .min(3, { message: "LastName must be 3 or more chars long " }),
});

export const signInSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "email must be string",
    })
    .email({ message: "Invalid email address" }),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "password must be string",
    })
    .min(6, { message: "Password must be 6 or more chars long" }),
});

export const hotelSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  city: z.string({
    required_error: "City is required",
    invalid_type_error: "City must be a string",
  }),
  country: z.string({
    required_error: "Country is required",
    invalid_type_error: "Country must be a string",
  }),
  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  }),
  type: z.string({
    required_error: "Type is required",
    invalid_type_error: "Type must be a string",
  }),
  pricePerNight: z.number({
    required_error: "Price per Night is required",
    invalid_type_error: "Price per Night must be a number",
  }),
  facilities: z
    .array(z.string())
    .nonempty({ message: "Facilities are required" }),
});
