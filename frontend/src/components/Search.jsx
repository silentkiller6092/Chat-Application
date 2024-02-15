import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Spinner from "./Spinner";

const Search = ({ username, closeSearchPage }) => {
  const [closePage, setClosePage] = useState(true);
  const [results, setResults] = useState([]);
  const [loader, setLoader] = useState(false);

  const handleClose = () => {
    setClosePage(false);
    closeSearchPage(); // Call the callback function to close the Search component
  };

  const handleSearch = async (username) => {
    setLoader(true);
    try {
      const data = JSON.stringify({ userName: username });

      const submitRes = await fetch(
        `${process.env.REACT_APP_API_URL}search/searchUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Specify JSON content type
          },
          body: data, // Stringify the body
        }
      );
      // Process the searchResult
      if (!submitRes.ok) {
        const responseData = await submitRes.json();
        throw new Error(responseData.errors);
      }

      const responseJson = await submitRes.json();
      setResults(responseJson.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    handleSearch(username);
  }, [username]);

  if (loader) {
    return <Spinner />;
  }

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
            <div className="flex flex-col space-y-4 mt-5 mx-5 mb-3 h-screen overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
              {results.length > 0 ? (
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
                    <div className="ml-2">
                      <p className="text-gray-300 font-bold mb-1 leading-3">
                        {item.fullName}
                      </p>
                      <p className="text-gray-200 mb-0 leading-3">
                        {item.username}
                      </p>
                    </div>
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

export default Search;