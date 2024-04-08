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
          className="border rounded w-full py-2 px-2 font-normal"
          {...register("name", {
            required: { value: true, message: "Name field is required" },
          })}
        ></input>
        {errors.name && <ErrorLabel err={errors.name.message} />}
      </label>
      <div className="flex gap-4">
        <label className="text-gray-700 text-sm font-bold flex-1">
          City
          <input
            type="text"
            className="border rounded w-full py-2 px-2 font-normal"
            {...register("city", {
              required: { value: true, message: "City field is required" },
            })}
          ></input>
          {errors.city && <ErrorLabel err={errors.city.message} />}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Country
          <input
            type="text"
            className="border rounded w-full py-2 px-2 font-normal"
            {...register("country", {
              required: { value: true, message: "Country field is required" },
            })}
          ></input>
          {errors.country && <ErrorLabel err={errors.country.message} />}
        </label>
      </div>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Description
        <textarea
          rows={10}
          className="border rounded w-full py-2 px-2 font-normal"
          {...register("description", {
            required: { value: true, message: "Description field is required" },
          })}
        ></textarea>
        {errors.description && <ErrorLabel err={errors.description.message} />}
      </label>
      <label className="text-gray-700 text-sm font-bold max-w-[50%]">
        Price Per Night
        <input
          type="number"
          min={1}
          className="border rounded w-full py-2 px-2 font-normal"
          {...register("pricePerNight", {
            required: {
              value: true,
              message: "Price Per Night field is required",
            },
          })}
        ></input>
        {errors.pricePerNight && (
          <ErrorLabel err={errors.pricePerNight.message} />
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold max-w-[50%]">
        Star Rating
        <select
          {...register("starRating", {
            required: { value: true, message: "Rating is required" },
          })}
          className="border rounded w-full p-2 text-gray-700 font-normal"
        >
          <option value="" className="text-sm font-bold">
            Select as Rating
          </option>
          {[1, 2, 3, 4, 5].map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
        {errors.starRating && <ErrorLabel err={errors.starRating.message} />}
      </label>
    </div>
  );
};
export default DetailsSection;
