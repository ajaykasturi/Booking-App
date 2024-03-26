import { RegisterOptions, UseFormRegister } from "react-hook-form";
import { RegisterFormData } from "../pages/Register";
type InputData = {
  register: UseFormRegister<RegisterFormData>;
  title: keyof RegisterFormData;
  type?: string;
  options: RegisterOptions[];
};
const Input = ({ register, title, options, type }: InputData) => {
  return (
    <>
      <input
        type={type ? type : undefined}
        className="border rounded w-full py-2 px-2 font-normal"
        {...register(title, ...options)}
      ></input>
    </>
  );
};

export default Input;
