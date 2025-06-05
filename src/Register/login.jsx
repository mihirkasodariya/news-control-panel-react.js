import React, { useState } from "react";
import { Formik } from "formik";
import axios from "axios";
import emailimg from "../../src/images/contact-form.png";
import { useNavigate } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import { useAuth } from "../Context/authContext";

// Use only one fallback approach for BASE_URL
const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://192.168.29.225:5000";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { updateUser } = useAuth();

  // Validation function
  const validateForm = (values) => {
    const errors = {};
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!values.email) {
      errors.email = "Enter a valid email";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else {
      if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
      if (!/[A-Z]/.test(values.password)) {
        errors.password = "Include at least one uppercase letter";
      }
      if (!/[a-z]/.test(values.password)) {
        errors.password = "Include at least one lowercase letter";
      }
      if (!/[0-9]/.test(values.password)) {
        errors.password = "Include at least one number";
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(values.password)) {
        errors.password = "Include at least one special character";
      }
    }

    return errors;
  };

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/admin/login`, values);
      localStorage.setItem("token", response.data.token);
      updateUser(response.data.admin);
      navigate("/home");
    } catch (error) {
      const message = error.response?.data?.message || "Login failed!";
      alert("Login failed! " + message);
      console.error(error);
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-500">
      <div className="w-[95%] max-w-4xl mx-auto flex flex-col md:flex-row items-center bg-white/20 rounded-xl shadow-lg backdrop-blur-md p-4 md:p-6">

        {/* Image */}
        <div className="w-1/2 hidden md:block p-4">
          <img
            src={emailimg}
            alt="Login Illustration"
            className="w-full object-contain max-h-[400px] mix-blend-luminosity filter contrast-200 brightness-200 saturate-0"
          />
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 p-5 bg-white/70 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-center">
            <span className="bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent text-3xl font-bold">
              Please{" "}
            </span>
            Login
          </h1>

          <Formik
            initialValues={{ email: "", password: "" }}
            validate={validateForm}
            onSubmit={handleLogin}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Email */}
                <div className="pb-2">
                  <label className="block font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email Address"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    className={`border p-2 w-full rounded ${errors.email && touched.email
                      ? "border-red-500"
                      : "border-gray-300"
                      }`}
                  />
                  {errors.email && touched.email && (
                    <p className="absolute text-red-500 text-sm pt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="pb-5">
                  <label className="block font-medium">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Your Password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      className={`border p-2 w-full rounded ${errors.password && touched.password
                        ? "border-red-500"
                        : "border-gray-300"
                        }`}
                    />
                    <span
                      className="absolute text-gray-600 text-xl right-3 top-2 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <IoEyeSharp /> : <FaRegEyeSlash />}
                    </span>
                  </div>
                  {errors.password && touched.password && (
                    <p className="absolute text-red-500 text-sm pt-1">{errors.password}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-gray-700 to-gray-500 hover:scale-105 hover:from-gray-600 hover:to-gray-400 transition-all duration-300 ease-in-out text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
