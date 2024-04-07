import { useFormContext } from "react-hook-form";
import ErrorLabel from "../../components/ErrorLabel";
import { HotelFormDataType } from "./ManageHotelForm";

const DetailsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormDataType>();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-3">Add Hotel</h1>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Name
        <input
          type="text"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("name", {
            required: { value: true, message: "Name field is required" },
          })}
        ></input>
        {errors.name && <ErrorLabel err={errors.name.message} />}
      </label>
    </div>
  );
};
export default DetailsSection;
