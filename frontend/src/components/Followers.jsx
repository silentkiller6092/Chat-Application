import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { FaTimes, FaUserPlus } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
const Followers = ({ closeSearchPage }) => {
  const [results, setResults] = useState([]);
  const [closePage, setClosePage] = useState(true);
  const [loader, setLoader] = useState(false);
  const [error, seterror] = useState("");
  const navigate = useNavigate();
  const isLgScreen = useMediaQuery({ minWidth: 1024 });
  const handleClose = () => {
    setClosePage(false);
    closeSearchPage(); // Call the callback function to close the Search component
  };
  const userList = async () => {
    setLoader(true);
    try {
      const submitRes = await fetch(
        `${process.env.REACT_APP_API_URL}sendRequest/accecptedRequestes`,
        {
          credentials: "include",
        }
      );
      // Process the searchResult
      if (!submitRes.ok) {
        const responseData = await submitRes.json();
        throw new Error(responseData.errors);
      }

      const responseJson = await submitRes.json();
      setResults(responseJson.data);
      if (responseJson.statusCode != 200) {
        throw new Error(responseJson.errors);
      }
    } catch (error) {
      seterror(error.message);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    userList();
  }, []);
  if (loader) {
    return <Spinner />;
  }
  console.log(results);
  return (
    <div>
      {closePage && (
        <div className="">
          <FaTimes
            className="text-white z-[52]  cursor-pointer fixed inset-0 flex items-center mx-auto m-4 text-2xl"
            onClick={handleClose}
          />
        </div>
      )}
      {closePage && (
        <div className="w-full bg-[#131518] fixed inset-0 flex items-center justify-center z-50">
          <div className="w-full flex-1 flex flex-col rounded-lg">
            <div className="flex flex-col space-y-4 mt-32  mb-3 h-screen overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
              {results && results.length > 0 ? (
                results.map((item) => (
                  <div
                    key={item._id}
                    className="flex cursor-pointer items-center align-middle mb-3 relative top-3 bg-[#202020] m-2 rounded-lg border-gray-300 transition-transform duration-300 transform"
                  >
                    <div className="border-2 border-slate-400 rounded-full m-1">
                      <img
                        src={item.avatar}
                        alt="User Logo"
                        className="w-12 h-12 rounded-full"
                        onLoad={() => setLoader(false)} // Set loader to false when the image loads
                      />
                    </div>
                    <div className="ml-2 flex-1">
                      <p className="text-gray-300 font-bold mb-1 leading-3">
                        {item.fullName}
                      </p>
                      <p className="text-gray-200 mb-0 leading-3">
                        {item.username.length > 10 && !isLgScreen
                          ? `${item.username.substring(0, 20)}...`
                          : item.username}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-white flex bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-3 py-1.5 md:px-5 md:py-2.5 text-center me-2 mb-2"
                      style={{ alignSelf: "flex-end" }} // Align button to the right
                    >
                      <FaUserPlus size={20} className="mr-1" color="white" />
                      Profile
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-300 text-center">No results found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Followers;
