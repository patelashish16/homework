import React, { useEffect, useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z, ZodError } from "zod";
import { MyContext } from "../../context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../env";
import { notify } from "../../helper/notify";

// Define the schema using Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
  .regex(/\d/, "Password must contain at least 1 number")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least 1 symbol")
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login, session }: any = useContext(MyContext);

  // react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  // Handle login submission
  const handleLogin: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/signin`, data);
      const { success, data: userData, msg, } = response.data;
      if (success && userData) {
        notify(msg, "success");
        login(userData);
        navigate("/");
      }
    } catch (error:any) {
      // Handle the error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = (error.response.data?.errors ? error.response.data?.errors[0].message : error.response.data.msg) || "Something went wrong!";
        notify(errorMessage, "error");
      } else if (error.request) {
        // The request was made but no response was received
        notify("No response received from the server.", "error");
      } else {
        // Something happened in setting up the request that triggered an Error
        notify("Error in setting up the request.", "error");
      }
    }

  };

  // Redirect if already logged in
  useEffect(() => {
    if (session?.token) {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <section className="text-gray-400 flex items-center justify-center body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-5">Login</h2>
          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="text"
                {...register("email")}
                className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${errors.email ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${errors.password ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.password && (
                <span className="text-red-500 text-xs">
                  {errors.password.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Login
            </button>
          </form>
          <p className="mt-4">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/SignUp")}
              className="text-blue-500 hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
