import { RegisterOptions, UseFormRegister } from "react-hook-form";
import { RegisterFormData } from "../pages/Register";
import { SignInFormData } from "../pages/SignIn";
type InputRegisterData = {
  register: UseFormRegister<RegisterFormData>;
  title: keyof RegisterFormData;
};
type InputSignInData = {
  register: UseFormRegister<SignInFormData>;
  title: keyof SignInFormData;
};
type RemainTypes = {
  type?: string;
  options: RegisterOptions;
};
const Input = ({
  register,
  title,
  options,
  type,
}: (InputRegisterData | InputSignInData) & RemainTypes) => {
  return (
    <>
      <input
        type={type ? type : undefined}
        className="border rounded w-full py-2 px-2 font-normal"
        {...register(title, options)}
      ></input>
    </>
  );
};

export default Input;
