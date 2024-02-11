import React from "react";
import { FaEllipsisV } from "react-icons/fa";
const UserList = () => {
  return (
    <div className="w-full  bg-gray-900">
      <div class="w-full flex-1 flex flex-col h-screen  rounded-lg">
        <div class="flex sm:items-center justify-between lg:py-3 bg-slate-950">
          <div className="border-b-2 flex items-center w-full mx-2">
            <div className="border-2 border-gray-300 rounded-full">
              <img
                src="logo192.png"
                alt="User Logo"
                className="w-12 h-12 rounded-full"
              />
            </div>
            <p className="text-white text-xl mt-3 ml-2">Channel Name</p>
            <div className="ml-auto">
              <FaEllipsisV className="text-white text-2xl" />
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-4 mb-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
          <div className="flex cursor-pointer items-center align-middle mb-3 border-[1px] relative top-3 bg-[#0a101bba] m-2 rounded-lg border-gray-300 transition-transform duration-300 transform hover:scale-105">
            <div className="border-2 border-slate-400 rounded-full m-1">
              <img
                src="logo192.png"
                alt="User Logo"
                className="w-12 h-12 rounded-full"
              />
            </div>
            <div className="ml-2">
              <p className="text-white font-bold mb-1 leading-3">Hii Shivam</p>
              <p className="text-white mb-0 leading-3">
                This is my description
              </p>
            </div>
          </div>
          <div className="flex cursor-pointer items-center align-middle mb-3 border-[1px] relative top-3 bg-[#0a101bba] m-2 rounded-lg border-gray-300 transition-transform duration-300 transform hover:scale-105">
            <div className="border-2 border-slate-400 rounded-full m-1">
              <img
                src="logo192.png"
                alt="User Logo"
                className="w-12 h-12 rounded-full"
              />
            </div>
            <div className="ml-2">
              <p className="text-white font-bold mb-1 leading-3">Hii Shivam</p>
              <p className="text-white mb-0 leading-3">
                This is my description
              </p>
            </div>
          </div>
          <div className="flex cursor-pointer items-center align-middle mb-3 border-[1px] relative top-3 bg-[#0a101bba] m-2 rounded-lg border-gray-300 transition-transform duration-300 transform hover:scale-105">
            <div className="border-2 border-slate-400 rounded-full m-1">
              <img
                src="logo192.png"
                alt="User Logo"
                className="w-12 h-12 rounded-full"
              />
            </div>
            <div className="ml-2">
              <p className="text-white font-bold mb-1 leading-3">Hii Shivam</p>
              <p className="text-white mb-0 leading-3">
                This is my description
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
