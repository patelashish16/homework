import React, { useEffect, useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { SignUpFormValues } from "../../interface/interface";
import axios from "axios";
import Swal from "sweetalert2";
import { MyContext } from "../../context/index";
import { BASE_URL } from "../../env";

// User SignUp Component
const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useContext(MyContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>();

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    try {
      const { data: response } = await axios.post(`${BASE_URL}/api/signup`, data);
      const { success, msg, errors: apiErrors } = response;

      if (success) {
        Swal.fire({
          title: "Success!",
          text: msg,
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/login");
      } else {
        const errorMsg = apiErrors?.length > 0 ? apiErrors[0].msg : "Something went wrong or Email already exists";
        Swal.fire({
          title: "Error!",
          text: errorMsg,
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "An unexpected error occurred.",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  useEffect(() => {
    if (session?.token) {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <section className="text-gray-400 items-center justify-center body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-5">Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              label="Username"
              type="text"
              register={register("username", { required: "Username is required" })}
              error={errors.username?.message}
            />
            <FormField
              label="Email"
              type="email"
              register={register("email", { required: "Email is required" })}
              error={errors.email?.message}
            />
            <FormField
              label="Password"
              type="password"
              register={register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters long" },
                validate: {
                  minLowercase: value => /[a-z]/.test(value) || "Password must contain at least one lowercase letter",
                  minUppercase: value => /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
                  minNumbers: value => /\d/.test(value) || "Password must contain at least one number",
                  minSymbols: value => /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Password must contain at least one special character",
                },
              })}
              error={errors.password?.message}
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

interface FormFieldProps {
  label: string;
  type: string;
  register: any;
  error?: string;
}

// Reusable Form Field Component
const FormField: React.FC<FormFieldProps> = ({ label, type, register, error }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
    <input
      type={type}
      {...register}
      className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${error ? "border-red-500" : ""
        }`}
    />
    {error && <p className="text-red-500 text-xs italic">{error}</p>}
  </div>
);

export default SignUp;
