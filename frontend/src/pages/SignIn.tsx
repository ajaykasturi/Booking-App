import { useForm } from "react-hook-form";
import Label from "../components/Label";
import Input from "../components/Input";
import ErrorLabel from "../components/ErrorLabel";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contextts/AppContext";
export type SignInFormData = {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};
const SignIn = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const mutation = useMutation("sigin", apiClient.signIn, {
    onSuccess: async () => {
      showToast({ message: "Login Success!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      // console.log(error.message);
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = (data: SignInFormData) => {
    // console.log(data);
    mutation.mutate(data);
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

      <span className="flex items-center justify-between">
        <span className="text-sm">
          Not have an Account?{" "}
          <Link className="text-blue-500 underline" to="/register">
            Sign Up here
          </Link>
        </span>
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
