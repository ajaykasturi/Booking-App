declare var Razorpay: any;
import { useForm } from "react-hook-form";
import {
  PaymentConfirmationResponse,
  PaymentOrderResponse,
  UserType,
} from "../../config/hotel-options-config";
import { useSearchContext } from "../../contextts/SearchContext";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contextts/AppContext";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const KEY_ID = import.meta.env.VITE_PAY_KEY_ID || "";
type Props = {
  currentUser: UserType;
  paymentOrder: PaymentOrderResponse;
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
  paymentDetails?: { payment_id: string; order_id: string };
  totalCost: number;
};
const BookingForm = ({ currentUser, paymentOrder }: Props) => {
  console.log(KEY_ID);
  const navigate = useNavigate();
  const search = useSearchContext();
  const { hotelId } = useParams();
  const { showToast } = useAppContext();
  const { mutate: bookRoom, isLoading } = useMutation(
    apiClient.createRoomBooking,
    {
      onSuccess: () => {
        showToast({ message: "Booking Saved!", type: "SUCCESS" });
        navigate("/");
      },
      onError: () => {
        showToast({
          message: "Error saving booking! contact admin if money is deducted",
          type: "ERROR",
        });
      },
    }
  );
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
      totalCost: paymentOrder.totalCost,
    },
  });
  const onSubmit = async (formData: BookingFormData) => {
    var options = {
      key: "rzp_test_LwvrisbAofwsfz",
      amount: paymentOrder.totalCost,
      currency: "INR",
      name: "X Bookings",
      description: "X Booking Dot Com",
      image: "https://www.example.com/image.jpg",
      order_id: paymentOrder.orderId,
      handler: async function (response: PaymentConfirmationResponse) {
        // console.log(response);
        const body = {
          ...response,
        };
        const res = await fetch(`${API_BASE_URL}/api/hotels/validatePayment`, {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const jsonRes = await res.json();
        bookRoom({
          ...formData,
          totalCost: formData.totalCost / 100,
          paymentDetails: {
            payment_id: jsonRes.paymentId,
            order_id: jsonRes.orderId,
          },
        });
        // console.log(jsonRes);
      },
      prefill: {
        name: "Test Examiner",
        email: "tester@example.com",
        contact: "9876543210",
      },
      notes: {
        address: "Hotel Booking Office",
        hotelId: hotelId,
        userId: paymentOrder.receipt,
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new Razorpay(options);
    rzp1.on("payment.failed", function (response: any) {
      alert(response.error.description);
    });
    rzp1.open();
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
    >
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
          Total Cost: &#8377; {paymentOrder.totalCost / 100}
        </div>
        <div className="text-xs">Includes taxes and charges</div>
      </div>
      <div className="flex justify-start">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500 border rounded-md"
        >
          {isLoading ? "Saving..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
