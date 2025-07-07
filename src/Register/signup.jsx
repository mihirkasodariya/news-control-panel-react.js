import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import emailimg from "../../src/images/contact-form.png";
import { useAuth } from "../Context/authContext";

const BASE_URL =   'https://news-backend-node-js.onrender.com'||"http://localhost:5000";
// const BASE_URL =  process.env.BACKEND_URL || "http://localhost:5000";
// const BASE_URL =  process.env.BACKEND_URL || "https://admin.techspherebulletin.com";

const Signup = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth(); // Get updateUser from context
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on typing
  };

  // ✅ Validation function
  const validate = () => {
    let newErrors = {};

    if (!formValues.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!formValues.lastName.trim())
      newErrors.lastName = "Last name is required.";

    if (!formValues.email) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formValues.email)
    ) {
      newErrors.email = "Invalid email address.";
    }

    if (!formValues.password) {
      newErrors.password = "Password is required.";
    } else if (formValues.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(formValues.password)) {
      newErrors.password = "Must include an uppercase letter.";
    } else if (!/[a-z]/.test(formValues.password)) {
      newErrors.password = "Must include a lowercase letter.";
    } else if (!/[0-9]/.test(formValues.password)) {
      newErrors.password = "Must include a number.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formValues.password)) {
      newErrors.password = "Must include a special character.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // Prevent submit if validation fails

    setIsSubmitting(true);
    setErrorMessage(""); // Clear previous error message

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/admin/register`,
        formValues,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      updateUser(response.data.user); // Update user in context
      setErrorMessage(response.data.message); // Set success message
      setShowPopup(true); // Show popup on success
      // navigate("/login");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message); // Set error message from API
      } else {
        setErrorMessage("An error occurred. Please try again."); // Generic error message
      }
      setShowPopup(true); // Show popup on error
    }
    setIsSubmitting(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    // Only navigate to login if registration was successful
    if (!errorMessage.includes("error") && !errorMessage.includes("failed")) {
      navigate("/login");
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-500">
      <div className="w-[95%] max-w-5xl mx-auto flex flex-col md:flex-row items-center bg-white/20 rounded-xl shadow-lg backdrop-blur-md p-4 md:p-6">
        {/* Left Side - Image */}
        <div className="w-1/2 hidden md:block">
          <img
            src={emailimg}
            alt="Signup Illustration"
            className="w-full object-contain max-h-[400px] mix-blend-luminosity filter contrast-200 brightness-200 saturate-0"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-5 bg-white bg-opacity-70 rounded-lg shadow-md">
          <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent">
              Create
            </span>{" "}
            your account
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            {/* First Name */}
            <div>
              <label className="block font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={formValues.firstName}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={formValues.lastName}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formValues.email}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formValues.password}
                  onChange={handleChange}
                  className={`border p-2 w-full rounded ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <span
                  className="absolute text-gray-600 text-xl right-3 top-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeSharp /> : <FaRegEyeSlash />}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`text-white px-4 py-2 rounded ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-gray-700 to-gray-500 hover:from-gray-600 hover:to-gray-400 hover:scale-105 transition-all  duration-300 transform"
              }`}
            >
              {isSubmitting ? "Registering..." : "Register Account"}
            </button>
          </form>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
      </div>

      {/* Popup for messages */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div
            className={`bg-white text-lg sm:text-xl w-11/12 sm:w-96 md:w-[30rem] font-semibold grid border ${
              errorMessage.includes("successful")
                ? "border-green-500"
                : "border-red-500"
            } gap-3 justify-center items-center p-6 sm:p-10 rounded shadow-lg`}
          >
            <p
              className={
                errorMessage.includes("successful")
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {errorMessage}
            </p>
            <button
              onClick={handleClosePopup}
              className={`mt-4 w-full sm:w-auto ${
                errorMessage.includes("successful")
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              } text-white px-4 py-2 rounded transition-colors`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
