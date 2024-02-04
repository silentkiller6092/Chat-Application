import React, { useState } from "react";
import Login from "./Login";
import Input from "./Input";

function Register() {
  const [showLogin, setshowLogin] = useState(false);

  const loginButton = () => {
    setshowLogin(true);
  };

  return showLogin ? (
    <Login />
  ) : (
    <div>
      <h2 className="text-center text-white font-thin">Register</h2>
      <div className="p-4 sm:p-6 md:p-8 md:mx-44 lg:p-10  xl:p-12 xl:mx-44 bg-gray-700 rounded-md shadow-md">
        <form className="formRegister flex flex-col mx-auto">
          <Input label="Name" />
          <Input label="Email" />
          <Input label="Password" />
          <div className="w-72 ">
            <label
              class="block mb-2 text-sm font-medium text-white"
              for="file_input"
            >
              Profile Photo
            </label>
            <input
              class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-500 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
            />
            <p
              class="mt-1 text-[10px] text-gray-300 dark:text-gray-300"
              id="file_input_help"
            >
              SVG, PNG, JPG or GIF (MAX. 800x400px).
            </p>
          </div>
          <div className="flex flex-row">
            <button
              type="button"
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
