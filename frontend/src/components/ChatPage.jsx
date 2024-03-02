import React, { useState, useEffect } from "react";
import UserChatPage from "./UserChatPage";
import { useMediaQuery } from "react-responsive";
import ChatPagesmallDevice from "./ChatPagesmallDevice";
import Header from "./Header";
import Spinner from "./Spinner";
const ChatPage = ({ showHeader }) => {
  const [loader, setLoader] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [results, setResults] = useState([]);
  const [cresults, csetResults] = useState([]);
  const [error, seterror] = useState("");
  const isMobile = useMediaQuery({ maxWidth: 991 });

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
      console.log(responseJson);
      if (responseJson.statusCode != 200) {
        throw new Error(responseJson.errors);
      }
    } catch (error) {
      seterror(error.message);
    } finally {
      setLoader(false);
    }
  };

  const openChatPage = (user) => {
    setSelectedUser(user);
  };
  const currentUserDetails = async () => {
    try {
      const userDetails = await fetch(
        `${process.env.REACT_APP_API_URL}users/getCurrentUser`,
        {
          credentials: "include",
        }
      );
      if (!userDetails.ok) {
        const responseData = await userDetails.json();
        throw new Error(responseData.errors);
      }

      const responseJson = await userDetails.json();
      csetResults(responseJson.data.userDetails);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    currentUserDetails();
    userList();
  }, []);
  if (loader) {
    return <Spinner />;
  }

  if (!isMobile) {
    return (
      <div>
        <Header />
        <div className="flex align-middle lg:mx-3 lg:mt-3 ">
          <div className="w-full lg:w-1/4 addUserside mx-auto ">
            <div className="w-full  bg-[#131518] ">
              <div className="w-full flex-1 flex flex-col h-screen  rounded-lg">
                {error ? (
                  <p className="text-xl text-cyan-400 text-center">{error}</p>
                ) : (
                  <></>
                )}
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
          <div className="hidden lg:block w-3/4 introSide mx-auto lg:mt-0 pl-6">
            {selectedUser ? (
              <UserChatPage
                userName={selectedUser.fullName}
                userImg={selectedUser.avatar}
                userId={selectedUser._id}
                currentUser={cresults._id}
              />
            ) : (
              <div>
                <div className="w-full h-screen bg-gray-900 flex align-middle items-center">
                  <h1 className="text-white text-center mx-auto">
                    Select User to Chat
                  </h1>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>{isMobile && <ChatPagesmallDevice showHeader={showHeader} />}</div>
  );
};

export default ChatPage;
