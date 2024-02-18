import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { FaArrowLeft } from "react-icons/fa";
import { FaEllipsisV } from "react-icons/fa";
import Header from "./Header";
const ChatPagesmallDevice = ({ showHeader }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [openChatsPage, setOpenChatPage] = useState(true);
  const [results, setResults] = useState([]);
  const [loader, setLoader] = useState(false);
  const users = [
    { id: 1, name: "Neha", img: "logo192.png", description: "Description 1" },
    { id: 2, name: "John", img: "logo192.png", description: "Description 2" },
    // Add more users as needed
  ];

  const handleSearch = async () => {
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const openChatPage = (user) => {
    setSelectedUser(user);
    setOpenChatPage(false);
  };

  const closeChatPage = () => {
    setSelectedUser(null);
    setOpenChatPage(true);
  };
  if (loader) {
    return <Spinner />;
  }

  return (
    <div>
      {showHeader && openChatsPage && <Header />}
      {openChatsPage ? (
        <div className="w-full lg:w-1/4 addUserside mx-auto ">
          <div className="w-full  bg-[#131518]">
            <div className="w-full flex-1 flex flex-col h-screen  rounded-lg">
              <div className="flex flex-col space-y-4 mb-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                {results &&
                  results.map((user) => (
                    <div
                      className="flex cursor-pointer items-center align-middle mb-3 relative top-3 bg-[#202020] m-2 rounded-lg border-gray-300 transition-transform duration-300 transform hover:scale-105"
                      key={user._id}
                      onClick={() => openChatPage(user)}
                    >
                      <div className="border-2 border-slate-400 rounded-full m-1">
                        <img
                          src={user.avatar}
                          alt="User Logo"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-2">
                        <p className="text-gray-300 font-bold mb-1 leading-3">
                          {user.fullName}
                          {/* Access requestedID from requests object */}
                        </p>
                        {/* If user.description is intended to be a string, remove the quotes */}
                        <p className="text-gray-200 mb-0 leading-3">
                          {user.username.length > 10
                            ? `${user.username.substring(0, 20)}...`
                            : user.username}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {selectedUser ? (
            <div className={"w-full bg-gray-900"}>
              <div className="flex-1 justify-between flex flex-col h-screen">
                <div className="flex sm:items-center justify-between py-3 bg-slate-950 ">
                  <div className="border-b-2 flex items-center w-full mx-3 ">
                    <div>
                      <FaArrowLeft
                        className="text-white text-xl mr-2"
                        onClick={closeChatPage}
                      />
                    </div>
                    <div className="border-2 border-gray-300 rounded-full">
                      <img
                        src={selectedUser.avatar}
                        alt="User Logo"
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                    <p className="text-white text-xl mt-3 ml-2">
                      {selectedUser.fullName}
                    </p>
                    <div className="ml-auto">
                      <FaEllipsisV className="text-white text-2xl" />
                    </div>
                  </div>
                </div>

                <div
                  id="messages"
                  className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                >
                  <div className="chat-message">
                    <div className="flex items-end">
                      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                        <div>
                          <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                            {selectedUser.fullName}
                          </span>
                        </div>
                      </div>
                      <img
                        src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                        alt="My profile"
                        className="w-6 h-6 rounded-full order-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
                  <div className="relative flex">
                    <span className="absolute inset-y-0 flex items-center">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-6 w-6 text-gray-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            stroke-width="2"
                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                          ></path>
                        </svg>
                      </button>
                    </span>
                    <input
                      type="text"
                      placeholder="Write your message!"
                      className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
                    />
                    <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-6 w-6 text-gray-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            stroke-width="2"
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                          ></path>
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-6 w-6 text-gray-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            stroke-width="2"
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            stroke-width="2"
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-6 w-6 text-gray-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            stroke-width="2"
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                      >
                        <span className="font-bold">Send</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-6 w-6 ml-2 transform rotate-90"
                        >
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>no</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatPagesmallDevice;
