import React, { useState } from "react";
import UserChatPage from "./UserChatPage";
import { useMediaQuery } from "react-responsive";
import ChatPagesmallDevice from "./ChatPagesmallDevice";
import Header from "./Header";

const ChatPage = ({ showHeader }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [openChatsPage, setOpenChatPage] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 991 });
  const users = [
    { id: 1, name: "Neha", img: "logo192.png", description: "Description 1" },
    { id: 2, name: "John", img: "logo192.png", description: "Description 2" },
    // Add more users as needed
  ];

  const openChatPage = (user) => {
    setSelectedUser(user);
    setOpenChatPage(true);
  };

  if (!isMobile) {
    return (
      <div>
        <Header />
        <div className="flex align-middle lg:mx-3 lg:mt-3 ">
          <div className="w-full lg:w-1/4 addUserside mx-auto ">
            <div className="w-full  bg-[#131518] ">
              <div class="w-full flex-1 flex flex-col h-screen  rounded-lg">
                <div className="flex flex-col space-y-4 mb-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                  {users.map((user) => (
                    <div
                      className="flex cursor-pointer items-center align-middle mb-3 relative top-3 bg-[#202020] m-2 rounded-lg border-gray-300 transition-transform duration-300 transform hover:scale-105"
                      key={user.name}
                      onClick={() => openChatPage(user)}
                    >
                      <div className="border-2 border-slate-400 rounded-full m-1">
                        <img
                          src={user.img}
                          alt="User Logo"
                          className="w-12 h-12 rounded-full"
                        />
                      </div>
                      <div className="ml-2">
                        <p className="text-gray-300 font-bold mb-1 leading-3">
                          {user.name}
                        </p>
                        <p className="text-gray-200 mb-0 leading-3">
                          {user.description}
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
                userName={selectedUser.name}
                userImg={selectedUser.img}
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
