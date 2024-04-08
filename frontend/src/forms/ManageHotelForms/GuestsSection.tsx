import { useFormContext } from "react-hook-form";
import { HotelFormDataType } from "./ManageHotelForm";
import ErrorLabel from "../../components/ErrorLabel";

const GuestsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormDataType>();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Guests</h2>
      <div className="grid grid-cols-2 p-6 gap-5 bg-gray-300">
        <label className="text-gray-700 text-sm font-semibold">
          Adults
          <input
            className="border rounded w-full py-2 px-3 font-normal"
            type="number"
            min={1}
            {...register("adultCount", {
              required: {
                value: true,
                message: "Adult count is required field",
              },
            })}
          />
          {errors.adultCount && <ErrorLabel err={errors.adultCount.message} />}
        </label>
        <label className="text-gray-700 text-sm font-semibold">
          Children
          <input
            className="border rounded w-full py-2 px-3 font-normal"
            type="number"
            min={0}
            {...register("childCount", {
              required: {
                value: true,
                message: "Child count is required field",
              },
            })}
          />
          {errors.childCount && <ErrorLabel err={errors.childCount.message} />}
        </label>
      </div>
    </div>
  );
};
export default GuestsSection;
