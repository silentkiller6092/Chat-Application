import React from "react";
import Intro from "./Intro";
import Login from "./Login";

function AddUser() {
  return (
    <div className="lg:mt-2">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-2/4 lg:mt-10 mt-36 mb-4 lg:mb-0 addUserside border-b lg:border-b-0 lg:border-r-[1px] border-green-300 mx-auto">
          <Intro />
        </div>
        <div className=" lg:w-2/3 introSide mx-auto mt-4 lg:mt-0">
          <Login />
        </div>
      </div>
    </div>
  );
}

export default AddUser;
