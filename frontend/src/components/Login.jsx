import React, { useState } from "react";
import Input from "./Input";
import Register from "./Register";
function Login() {
  const [showRegister, setShowRegister] = useState(false);
  const registerButon = () => {
    setShowRegister(true);
  };
  return showRegister ? (
    <Register />
  ) : (
    <div>
      <h2 className="text-center text-white font-thin">Login</h2>
      <div className="p-4 sm:p-6 md:p-8 md:mx-44 lg:p-10  xl:p-12 xl:mx-44 bg-gray-700 rounded-md shadow-md">
        <form className="formRegister flex flex-col mx-auto">
          <Input label="Email" />
          <Input label="Password" />
          <div className="flex flex-row">
            <button
              type="button"
              class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
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
