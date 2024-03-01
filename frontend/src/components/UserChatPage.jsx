import { FaEllipsisV } from "react-icons/fa";
import io from "socket.io-client";
import React, { useState, useEffect } from "react";
const UserChatPage = ({ userId, userName, userImg, currentUser }) => {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [allMessage, setAllMessages] = useState([]);
  const useSocket = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
      const newSocket = io("http://127.0.0.1:4000");
      setSocket(newSocket);

      // Cleanup function to disconnect socket when component unmounts
      return () => {
        newSocket.disconnect();
      };
    }, []);

    return socket;
  };
  const socket = useSocket();
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        socket.emit("addUser", userId, currentUser);
      });

      socket.on("getMessage", (message) => {
        setMessages((prev) => [...prev, message]);
      });
    }
  }, [userId, socket]);

  useEffect(() => {
    if (socket) {
      socket.emit("new User", userId, currentUser);
    }
  }, [userId, socket, currentUser]);
  function sendMessage() {
    if (messageInput.trim() !== "") {
      socket.emit("sendMessage", {
        message: messageInput,
        senderId: currentUser,
        recipientId: userId,
      });
      setMessageInput("");
    }
  }

  useEffect(() => {
    if (messages && messages.length > 0) {
      const filteredMessages = messages.filter((message) => {
        return (
          (userId === message.senderId &&
            currentUser === message.recipientId) || // Message sent by userId to currentUser
          (userId === message.recipientId && currentUser === message.senderId) // Message sent by currentUser to userId
        );
      });

      setAllMessages(filteredMessages);
    }
  }, [messages, currentUser, userId]);

  return (
    <div>
      <div className={"w-full bg-gray-900"}>
        <div className="flex-1 justify-between flex flex-col h-screen bg-[#1315184e] ">
          <div className="flex sm:items-center justify-between py-3 bg-[#131518] ">
            <div className="border-b-2 flex items-center w-full mx-3 ">
              <div className="border-2 border-gray-300 rounded-full">
                <img
                  src={userImg}
                  alt="User Logo"
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <p className="text-white text-xl mt-3 ml-2">{userName}</p>
              <div className="ml-auto">
                <FaEllipsisV className="text-white text-2xl" />
              </div>
            </div>
          </div>
          <div
            id="messages"
            className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
          >
            {allMessage &&
              allMessage.map((message) => (
                <div key={message.recipientId}>
                  {currentUser === message.senderId ? (
                    <p className="text-white text-right">
                      mesg send: {message.message}
                    </p>
                  ) : (
                    <p className="text-white text-left">
                      mesg came: {message.message}
                    </p>
                  )}
                </div>
              ))}
          </div>
          <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
            <div className="relative flex">
              <input
                type="text"
                placeholder="Write your message!"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
              />
              <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
                <button
                  onClick={sendMessage}
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
    </div>
  );
};
export default UserChatPage;
