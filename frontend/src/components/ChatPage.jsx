import React from "react";
import UserList from "./UserList";
import UserChatPage from "./UserChatPage";

const ChatPage = () => {
  //   Working for Mobile view
  return (
    <div className="flex align-middle mx-3 mt-3 ">
      <div className="w-full lg:w-1/4 addUserside mx-auto ">
        <UserList />
      </div>
      {/* Render UserChatPage only on larger devices */}
      <div className="hidden lg:block w-3/4 introSide mx-auto lg:mt-0 pl-6">
        <UserChatPage />
      </div>
    </div>
  );
};

export default ChatPage;
