import React, { useState } from "react";
import Login from "./Login";
import Input from "./Input";
import { useForm } from "react-hook-form";
import Spinner from "./Spinner";
import { z } from "zod";
function Register() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const [showLogin, setshowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loginButton = () => {
    setshowLogin(true);
  };

  const onSubmits = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      // Append each form field to FormData
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("username", data.username);
      formData.append("password", data.password);
      // Append the file to FormData
      formData.append("avatar", data.avatar[0]);
      const submitRes = await fetch(
        `${process.env.REACT_APP_API_URL}users/register`,
        {
          method: "POST",
          body: formData,
        }
      );
      return await submitRes.json();
    } catch (err) {
      setError("root", {
        message: err.message,
      });
      return await err.json();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return showLogin ? (
    <Login />
  ) : (
    <div>
      <h2 className="text-center text-white font-thin">Register</h2>
      <div className="p-4 mb-5 sm:p-6 md:p-8 md:mx-44 lg:p-10  xl:p-12 xl:mx-44 bg-gray-700 rounded-md shadow-md">
        <form
          className="formRegister flex flex-col mx-auto"
          onSubmit={handleSubmit(onSubmits)}
        >
          {/* Pass the ref to the Input component */}
          <Input
            label="Name"
            {...register("fullName", { required: "Name Required" })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
          <Input
            label="Email"
            {...register("email", {
              required: "Email Required",
              validate: (value) => {
                if (!value.includes("@")) {
                  return "Email Must have @";
                }
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
          <Input
            label="User Name"
            {...register("username", { required: "User Name Required" })}
          />
          {errors.username && (
            <div className="text-red-500">{errors.username.message}</div>
          )}
          <Input
            label="Password"
            {...register("password", {
              required: "Password Required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
          <div className="w-72 ">
            <label
              className="block mb-2 text-sm font-medium text-white"
              htmlFor="file_input"
            >
              Profile Photo
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-500 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="file_input_help"
              {...register("avatar", { required: "Profile Required" })}
              id="file_input"
              type="file"
            />
            <p
              className="mt-1 text-[10px] text-gray-300 dark:text-gray-300"
              id="file_input_help"
            >
              SVG, PNG, JPG or GIF (MAX. 800x400px).
            </p>
            {errors.avatar && (
              <div className="text-red-500">{errors.avatar.message}</div>
            )}
          </div>
          {errors.root && (
            <div className="text-red-500">{errors.root.message}</div>
          )}
          <div className="flex flex-row">
            <button
              type="submit"
              className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Register
            </button>
            <button
              type="button"
              className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={loginButton}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
