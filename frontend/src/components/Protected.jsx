import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (authStatus != true) {
      navigate("/"); // Redirect to homepage if not authenticated
    } else {
      setLoader(false); // If authenticated or authentication not required, stop loader
    }
  }, [authStatus, navigate, authentication]);

  return loader ? (
    <h1 className="text-white text-center">Loading...</h1>
  ) : (
    <>{children}</>
  );
}
