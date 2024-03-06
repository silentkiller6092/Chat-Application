import React, { useEffect, useState } from "react";
import Input from "./Input";

import Register from "./Register";
import { useForm } from "react-hook-form";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { login, logout } from "../app/Reducers";

const schema = z.object({
  email: z.string().email("Email is Required"),
  password: z.string().nonempty("Password must be at least 8 characters"),
});

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loder, setLoder] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });
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
        const userData = await submitRes.json();
        throw new Error(userData.errors);
      }

      const userData = await submitRes.json();
      if (userData.statusCode === 200) {
        // Navigate to chat page or perform other actions
        dispatch(login({ status: true }));
        navigate("/chatPage");
      } else {
        dispatch(logout());
      }
    } catch (err) {
      setError("root", {
        message: err.message,
      });
    }
  };

  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const autoLogin = async () => {
      setLoder(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}users/autologin`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        if (response.ok) {
          dispatch(login({ status: true }));
          navigate("/chatPage");
        } else {
          dispatch(login({ status: false }));
        }
      } catch (error) {
        setError("root", {
          message: error.message,
        });
      } finally {
        setLoder(false);
      }
    };

    autoLogin();
  }, [navigate]);

  // Handle redirecting back to login page if error or 404 response from protected route
  useEffect(() => {
    const handleErrors = (event) => {
      if (event.detail.status === 404 || event.detail.error) {
        navigate("/"); // Redirect to login page if error or 404
      }
    };

    window.addEventListener("protectedRouteError", handleErrors);

    return () => {
      window.removeEventListener("protectedRouteError", handleErrors);
    };
  }, [navigate]);

  const registerButon = () => {
    setShowRegister(true);
  };
  if (isSubmitting || loder) {
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
