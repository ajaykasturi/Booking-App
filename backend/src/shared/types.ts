import { HotelType } from "../models/hotel";

export type HotelSearchResponse = {
  data: HotelType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};
export type BookingType = {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
};
export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type PaymentIntentResponse = {
  paymentIntentId: string;
  clientSecret: string;
  totalCost: number;
};
