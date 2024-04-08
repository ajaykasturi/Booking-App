import { hotelFacilities } from "../../config/hotel-options-config";
import ErrorLabel from "../../components/ErrorLabel";
import { HotelFormDataType } from "./ManageHotelForm";
import { useFormContext } from "react-hook-form";
const FacilitiesSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormDataType>();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Facilities</h2>
      <div className="grid grid-cols-5 gap-2">
        {hotelFacilities.map((facility) => (
          <label key={facility} className="text-sm flex gap-1 text-gray-700">
            <input
              type="checkbox"
              value={facility}
              {...register("facilities", {
                required: {
                  value: true,
                  message: "Facilities is requried field",
                },
                validate: (facilities) => {
                  if (facilities && facilities.length > 0) return true;
                  else {
                    return "At least one facility is required";
                  }
                },
              })}
            />
            <span>{facility}</span>
          </label>
        ))}
      </div>
      {errors.facilities && <ErrorLabel err={errors.facilities.message} />}
    </div>
  );
};

export default FacilitiesSection;
