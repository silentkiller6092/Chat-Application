import React from "react";
import Register from "./Register";
import Intro from "./Intro";

function AddUser() {
  return (
    <div>
      <div className="flex ">
        <div className="w-2/4 addUserside border-r-2 border-white">
          <Intro />
        </div>
        <div className="w-2/3 introSide ">
          <Register />
        </div>
      </div>
    </div>
  );
}

export default AddUser;
