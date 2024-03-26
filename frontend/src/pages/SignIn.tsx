import { useForm } from "react-hook-form";
import Label from "../components/Label";
import Input from "../components/Input";
import ErrorLabel from "../components/ErrorLabel";
import { Link } from "react-router-dom";
export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};
const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const onSubmit = (data: RegisterFormData) => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <h2 className="text-3xl font-bold">Sign In</h2>
      <Label title={"Email"}>
        <Input
          type={"email"}
          title={"email"}
          register={register}
          options={{ required: { value: true, message: "Email is required" } }}
        />
        {errors.email && <ErrorLabel err={errors.email?.message} />}
      </Label>
      <Label title={"Password"}>
        <Input
          type={"password"}
          title={"password"}
          register={register}
          options={{
            required: { value: true, message: "Password is required" },
            minLength: {
              value: 6,
              message: "Password must be 6 chars long",
            },
          }}
        />
        {errors.password && <ErrorLabel err={errors.password?.message} />}
      </Label>
      <span className="text-gray-800 mb-0">
        Not have an Account?{" "}
        <Link className="text-blue-500 underline" to="/register">
          Sign Up here
        </Link>
      </span>
      <span className="flex justify-center">
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Sign In
        </button>
      </span>
    </form>
  );
};

export default SignIn;
