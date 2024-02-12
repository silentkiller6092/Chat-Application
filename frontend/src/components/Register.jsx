import React, { useState } from "react";
import Login from "./Login";
import Input from "./Input";
import { useForm } from "react-hook-form";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

const schema = z.object({
  email: z.string().email("Email is Required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().nonempty("Username cant be empty"),
  fullName: z.string().min(4, { message: "Full Name Required" }),
  avatar: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [showLogin, setshowLogin] = useState(false);

  const loginButton = () => {
    setshowLogin(true);
  };

  const onSubmits = async (data) => {
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("username", data.username);
      formData.append("password", data.password);
      formData.append("avatar", data.avatar[0]);

      const submitRes = await fetch(
        `${process.env.REACT_APP_API_URL}users/register`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!submitRes.ok) {
        const responseData = await submitRes.json();
        throw new Error(responseData.errors);
      }

      const responseJson = await submitRes.json();
      if (responseJson.statusCode == 200) {
        navigate("/chatPage");
      }
    } catch (err) {
      setError("root", {
        message: err.message,
      });
    }
  };

  if (isSubmitting) {
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
          <Input
            label="Name"
            {...register("fullName", { required: "Name Required" })}
          />
          {errors.fullName && (
            <div className="error">{errors.fullName.message}</div>
          )}
          <Input label="Email" {...register("email")} />
          {errors.email && <div className="error">{errors.email.message}</div>}
          <Input
            label="User Name"
            {...register("username", { required: "User Name Required" })}
          />

          {errors.username && (
            <div className="error">{errors.username.message}</div>
          )}

          <Input label="Password" {...register("password")} />

          {errors.password && (
            <div className="error mb-3">{errors.password.message}</div>
          )}

          <div className="w-72">
            <input
              className="block w-full text-sm text-gray-900  focus:border-2 py-3 rounded-lg cursor-pointer bg-slate-900 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="file_input_help"
              {...register("avatar")}
              id="file_input"
              type="file"
            />
            <p
              className="mt-1 text-[10px] text-gray-300 dark:text-gray-300 "
              id="file_input_help"
            >
              SVG, PNG, JPG or GIF (MAX. 800x400px).
            </p>
            {errors.avatar && (
              <div className="error">{errors.avatar.message}</div>
            )}
          </div>
          {errors.root && (
            <div className="text-red-500">{errors.root.message}</div>
          )}
          <div className="flex flex-row">
            <button
              type="submit"
              disabled={isSubmitting}
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
