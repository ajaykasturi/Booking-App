import { useForm } from "react-hook-form";
import {
  PaymentIntentResponse,
  UserType,
} from "../../config/hotel-options-config";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement, StripeElement } from "@stripe/stripe-js";
import { useSearchContext } from "../../contextts/SearchContext";
import { useParams } from "react-router-dom";

type Props = {
  currentUser: UserType;
  paymentIntent: PaymentIntentResponse;
};
export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  paymentIntentId: string;
  totalCost: number;
};
const BookingForm = ({ currentUser, paymentIntent }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const search = useSearchContext();
  const { hotelId } = useParams();
  const { register, handleSubmit } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      hotelId: hotelId,
      totalCost: paymentIntent.totalCost,
      paymentIntentId: paymentIntent.paymentIntentId,
    },
  });
  const onSubmit = async (formData: BookingFormData) => {
    if (!stripe || !elements) {
      return;
    }
    const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement) as StripeCardElement,
      },
    });
    if (result.paymentIntent?.status === "succeeded") {
      //book the room
    }
  };
  return (
    <form className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5">
      <span className="text-3xl font-bold">Confrim Your Details</span>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          FirstName
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          LastName
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your Price Summary</h2>
      </div>
      <div className="bg-blue-200 p-4 rounded-md">
        <div className="font-semi-bold">
          Total Cost: $ {paymentIntent.totalCost.toFixed(2)}
        </div>
        <div className="text-xs">Includes taxes and charges</div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Payment Details</h3>
        <CardElement
          id="payment-element"
          className="border rounded-md p-2 text-sm"
        />
      </div>
    </form>
  );
};

export default BookingForm;
