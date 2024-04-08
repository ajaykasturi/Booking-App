import { useAppContext } from "../contextts/AppContext";
import ManageHotelForm from "../forms/ManageHotelForms/ManageHotelForm";
import * as apiClient from "../api-client";
import { useMutation } from "react-query";
const AddHotel = () => {
  const { showToast } = useAppContext();
  const mutation = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({ message: "Hotel Saved", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error Saving Hotel", type: "ERROR" });
    },
  });
  const handleSave = (hotelFormData: FormData) => {
    mutation.mutate(hotelFormData);
  };
  return <ManageHotelForm onSave={handleSave} isLoading={mutation.isLoading} />;
};

export default AddHotel;
