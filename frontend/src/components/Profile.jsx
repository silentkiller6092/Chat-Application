import React, { useEffect, useState } from "react";
import {
  FaUserFriends as FollowerIcon,
  FaUserCheck as FollowingIcon,
  FaUserPlus as AddUserIcon,
  FaCheckCircle,
} from "react-icons/fa";

import { useParams } from "react-router-dom";
import Spinner from "./Spinner";

function Profile() {
  const { username } = useParams();
  const [result, setResult] = useState([]);
  const [loader, setLoader] = useState(false);
  const [followerCount, setFollowerCount] = useState();
  const [followingCount, setFollowingCount] = useState();
  const [error, seterror] = useState("");
  const [test, setTest] = useState("");
  const searchResult = async () => {
    setLoader(true);
    try {
      const searchData = await fetch(
        `${process.env.REACT_APP_API_URL}users/user/${username}`,
        {
          credentials: "include",
        }
      );
      if (!searchData.ok) {
        throw new Error("Failed to fetch user data");
      }

      const watingdata = await searchData.json();
      setResult(await watingdata.data.userDetails[0]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoader(false);
    }
  };

  const sendRequest = async (req, res) => {
    try {
      const sendRequest = await fetch(
        `${process.env.REACT_APP_API_URL}sendRequest/sendRequests/${username}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const res = await sendRequest.json();

      userStatus();
    } catch (e) {
      seterror(e.message);
    }
  };
  const userStatus = async (req, res) => {
    try {
      const getUserStatus = await fetch(
        `${process.env.REACT_APP_API_URL}sendRequest/requestStatus/${username}`,
        {
          credentials: "include",
        }
      );

      const statusData = await getUserStatus.json();

      if (statusData.data.length == 0) {
        setTest(0);
      } else if (statusData && statusData.data[0].requests) {
        setTest(statusData.data[0].requests.status);
      } else {
        // Handle the case where data is empty or doesn't contain the expected structure
      }
    } catch (e) {
      seterror(e.message);
    }
  };

  useEffect(() => {
    searchResult();
    userStatus();
  }, [username]);

  const followingUser = async (req, res) => {
    try {
      const followerData = await fetch(
        `${process.env.REACT_APP_API_URL}sendRequest/following/${username}`,
        {
          credentials: "include",
        }
      );
      const data = await followerData.json();
      setFollowingCount(await data.data.length);
    } catch (e) {
      seterror(e.message);
    }
  };

  const followers = async (req, res) => {
    try {
      const followerData = await fetch(
        `${process.env.REACT_APP_API_URL}sendRequest/followers/${username}`,
        {
          credentials: "include",
        }
      );
      const data = await followerData.json();
      setFollowerCount(await data.data.length);
    } catch (e) {
      seterror(e.message);
    }
  };

  useEffect(() => {
    followingUser();
    followers();
  }, [username]);
  if (loader) {
    return <Spinner />;
  }

  return (
    <div>
      <>
        <div className="h-screen  bg-gray-800   flex flex-wrap items-center  justify-center  ">
          <div className="container shadow-2xl lg:w-2/6 xl:w-2/7 sm:w-full md:w-2/3 bg-gray-700 transform   duration-200 easy-in-out">
            <div className=" h-32 overflow-hidden">
              <img className="w-full" src="/bg.jpg" alt="" />
            </div>
            <div className="flex justify-center px-5  -mt-12">
              <img
                className="h-32 w-32 bg-gray-400 p-1 rounded-full   "
                src={result.avatar}
                alt=""
              />
            </div>
            <div className=" ">
              <div className="text-center px-14">
                <h2 className="text-gray-200 text-3xl font-bold">
                  {result.fullName}
                </h2>
                <a
                  className="text-gray-400 mt-2 hover:text-blue-500"
                  href="https://www.instagram.com/immohitdhiman/"
                  target="BLANK()"
                >
                  @<span>{result.username}</span>
                </a>
                <p className="mt-2 text-gray-500 text-sm">
                  {result.email}
                  <br />
                  {result.createdAt}
                </p>
                <button
                  type="button"
                  class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  onClick={sendRequest}
                >
                  <span className="flex items-center justify-center">
                    {test === 0 ? (
                      <>
                        <AddUserIcon className="text-xl mr-2" />
                        <button onClick={sendRequest}>Send Request</button>
                      </>
                    ) : test === "pending" ? (
                      <>
                        <FaCheckCircle className="text-xl mr-2" />
                        Requested
                      </>
                    ) : test === "accepted" ? (
                      <>
                        <FaCheckCircle className="text-xl mr-2" />
                        Friends
                      </>
                    ) : (
                      <></>
                    )}
                  </span>
                </button>
              </div>

              <hr className="mt-6" />
              <div className="flex   bg-gray-800 mb-2 ">
                <div className="text-center items-center w-1/2 p-2 lg:p-4  hover:bg-gray-600 cursor-pointer">
                  <p className="text-white my-1">
                    <div className="flex items-center justify-center">
                      <FollowerIcon className="mr-1 text-xl" />
                      <span>{followerCount}Follower</span>
                    </div>
                  </p>
                </div>
                <div className="border" />
                <div className="text-center w-1/2 p-2 lg:p-4 hover:bg-gray-600 cursor-pointer">
                  <p className="text-white my-1">
                    <div className="flex items-center justify-center">
                      <FollowingIcon className="mr-1 text-xl" />
                      <span>{followingCount} Following</span>
                    </div>
                  </p>
                </div>
              </div>
              {error ? (
                <p className="text-xl text-cyan-400 text-center">{error}</p>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default Profile;
