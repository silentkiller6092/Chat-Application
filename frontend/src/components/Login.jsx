import React, { useState } from "react";
import Input from "./Input";

import Register from "./Register";
import { useForm } from "react-hook-form";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
const schema = z.object({
  email: z.string().email("Email is Required"),
  password: z.string().nonempty("Password must be at least 8 characters"),
});
function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });
  // const onSubmits = async (data) => {
  //   try {
  //     const body = JSON.stringify(data);
  //     const submitRes = await fetch(
  //       `${process.env.REACT_APP_API_URL}users/login`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json", // Ensure Content-Type is set to application/json
  //         },
  //         body: body,
  //       }
  //     );

  //     if (!submitRes.ok) {
  //       const responseData = await submitRes.json();
  //       throw new Error(responseData.errors);
  //     }

  //     const responseJson = await submitRes.json();
  //     if (responseJson.statusCode == 200) {
  //       navigate("/chatPage");
  //     }
  //   } catch (err) {
  //     setError("root", {
  //       message: err.message,
  //     });
  //   }
  // };
  const onSubmits = async (data) => {
    try {
      const body = JSON.stringify(data);
      const submitRes = await fetch(
        `${process.env.REACT_APP_API_URL}users/login`,
        {
          method: "POST",
          withCredentials: true,
          headers: {
            "Content-Type": "application/json", // Ensure Content-Type is set to application/json
          },
          body: body,
          credentials: "include",
        }
      );

      if (!submitRes.ok) {
        const responseData = await submitRes.json();
        throw new Error(responseData.errors);
      }

      const responseJson = await submitRes.json();

      if (responseJson.statusCode === 200) {
        // Navigate to chat page or perform other actions
        navigate("/chatPage");
      }
    } catch (err) {
      setError("root", {
        message: err.message,
      });
    }
  };

  // Helper function to get cookie by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const [showRegister, setShowRegister] = useState(false);
  const registerButon = () => {
    setShowRegister(true);
  };
  if (isSubmitting) {
    return <Spinner />;
  }
  return showRegister ? (
    <Register />
  ) : (
    <div>
      <h2 className="text-center text-white font-thin">Login</h2>
      <div className="p-4 sm:p-6 md:p-8 md:mx-44 lg:p-10  xl:p-12 xl:mx-44 bg-gray-700 rounded-md shadow-md">
        <form
          className="formRegister flex flex-col mx-auto"
          onSubmit={handleSubmit(onSubmits)}
        >
          <Input label="Email" {...register("email")} />
          {errors.email && <div className="error">{errors.email.message}</div>}
          <Input label="Password" {...register("password")} />
          {errors.password && (
            <div className="error mb-3">{errors.password.message}</div>
          )}
          {errors.root && (
            <div className="text-red-500">{errors.root.message}</div>
          )}
          <div className="flex flex-row">
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Login
            </button>
            <button
              type="button"
              className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={registerButon}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
