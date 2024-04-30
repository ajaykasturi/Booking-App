import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForms/BookingForm";
import { useSearchContext } from "../contextts/SearchContext";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import BookingDetailSummary from "../components/BookingDetailsSummary";

const Booking = () => {
  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );
  const search = useSearchContext();
  const { hotelId } = useParams();

  const [numberOfNights, setNumberOfNights] = useState<number>(0);

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);
      setNumberOfNights(Math.ceil(nights));
    }
  }, [search.checkIn, search.checkOut]);

  const { data: paymentOrderData } = useQuery(
    "createPaymentOrder",
    () =>
      apiClient.createPaymentOrder(hotelId || "", numberOfNights.toString()),
    {
      enabled: !!hotelId && numberOfNights > 0,
    }
  );
  // console.log(paymentOrderData);
  const { data: hotel } = useQuery(
    "fetchHotelByID",
    () => apiClient.fetchHotelById(hotelId || ""),
    { enabled: !!hotelId }
  );
  if (!hotel) {
    return <></>;
  }
  return (
    <div className="grid md:grid-cols-[1fr_2fr] gap-2">
      <BookingDetailSummary
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        adultCount={search.adultCount}
        childCount={search.childCount}
        numberOfNights={numberOfNights}
        hotel={hotel}
      />
      {currentUser && paymentOrderData && (
        <BookingForm
          currentUser={currentUser}
          paymentOrder={paymentOrderData}
        />
      )}
    </div>
  );
};

export default Booking;
