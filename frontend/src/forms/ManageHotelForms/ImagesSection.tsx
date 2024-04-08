import { useFormContext } from "react-hook-form";
import { HotelFormDataType } from "./ManageHotelForm";
import ErrorLabel from "../../components/ErrorLabel";

const ImagesSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormDataType>();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full text-gray-700 font-normal"
          {...register("imageFiles", {
            validate: (images) => {
              const totalLength = images.length;
              if (totalLength === 0) {
                return "At least one image should be added";
              }
              if (totalLength > 6) {
                return "Total number of images cannot be more than 6";
              }
              return true;
            },
          })}
        />
      </div>
      {errors.imageFiles && <ErrorLabel err={errors.imageFiles.message} />}
    </div>
  );
};
export default ImagesSection;
