import { useFormContext } from "react-hook-form";
import { HotelFormDataType } from "./ManageHotelForm";
import ErrorLabel from "../../components/ErrorLabel";

const ImagesSection = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<HotelFormDataType>();
  const existingImageURLS = watch("imageURLS");

  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageURL: string
  ) => {
    event.preventDefault();
    setValue(
      "imageURLS",
      existingImageURLS.filter((url) => url !== imageURL)
    );
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        {existingImageURLS && (
          <div className="grid grid-cols-3 gap-4">
            {existingImageURLS.map((url) => (
              <div key={url} className="relative group">
                <img src={url} className="min-h-full object-fill" />
                <button
                  onClick={(e) => handleDelete(e, url)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 text-white rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full text-gray-700 font-normal"
          {...register("imageFiles", {
            validate: (images) => {
              const totalLength =
                images.length + (existingImageURLS?.length || 0);
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
