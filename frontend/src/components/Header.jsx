import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {
  FaBars,
  FaTimes,
  FaHome as HomeIcon,
  FaUserFriends as FollowerIcon,
  FaUserCheck as FollowingIcon,
  FaUserPlus as AddUserIcon,
  FaSignOutAlt as LogoutIcon,
} from "react-icons/fa";
import Search from "./Search";

function Header() {
  const [openSearchPage, setOpenSearchPage] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [searchContent, setSearchContent] = useState("");
  const [results, setResults] = useState();
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const searchPage = (e) => {
    e.preventDefault();
    setOpenSearchPage(true);
  };

  const closeSearchPage = () => {
    setOpenSearchPage(false);
    setSearchContent("");
  };

  // const [results, setResults] = useState(null); // Assuming results is initially null

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

      setResults(responseJson.data.userDetails);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    currentUserDetails();
  }, []);

  return (
    <>
      {results && (
        <Navbar expand="lg" className="bg-[#141619]">
          <Container fluid>
            <Navbar.Brand href="#" className="text-white">
              <span className="iconclass">
                <img
                  src={results.avatar}
                  alt="User Logo"
                  className="w-12 h-12  object-cover border-2 rounded-full border-gray-400"
                />{" "}
                <span className="ml-2">
                  {results.fullName.charAt(0).toUpperCase() +
                    results.fullName.slice(1)}
                </span>
              </span>
            </Navbar.Brand>
            <Navbar.Toggle
              aria-controls="responsive-navbar-nav"
              className="text-white focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </Navbar.Toggle>
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: "130px" }}
                navbarScroll
              >
                <Nav.Link href="#action1" className="text-white mx-2">
                  <span className="iconclass">
                    <HomeIcon className="mr-1" />
                    Home
                  </span>
                </Nav.Link>
                <Nav.Link href="#action1" className="text-white mx-2">
                  <span className="iconclass">
                    <FollowerIcon className="mr-1" />
                    Follower
                  </span>
                </Nav.Link>
                <Nav.Link href="#action1" className="text-white mx-2">
                  <span className="iconclass">
                    <FollowingIcon className="mr-1" />
                    Follwoing
                  </span>
                </Nav.Link>
                <Nav.Link href="#action1" className="text-white mx-2">
                  <span className="iconclass">
                    <AddUserIcon className="mr-1" />
                    Add User
                  </span>
                </Nav.Link>
                <Nav.Link href="#action2" className="text-white mx-2">
                  <span className="iconclass">
                    <LogoutIcon className="mr-1" />
                    Logout
                  </span>
                </Nav.Link>
              </Nav>

              <form className="w-full lg:w-1/3 " onSubmit={searchPage}>
                <label
                  htmlFor="default-search"
                  className=" text-sm font-medium  sr-only text-white"
                >
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-1 pointer-events-none">
                    <svg
                      className="w-4 h-4 mx-2  text-gray-500 "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="block w-full py-3 ps-10 text-sm border rounded-lg bg-gray-900 border-gray-600 placeholder-gray-400 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search Mockups, Logos..."
                    value={searchContent}
                    onChange={(e) => setSearchContent(e.target.value)}
                    required
                  />

                  <button
                    type="submit"
                    className="text-white absolute end-2.5 mr-4 bottom-2.5   focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                  >
                    Search
                  </button>
                </div>
              </form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
      {/* Conditionally render the Search component */}
      {openSearchPage && (
        <Search closeSearchPage={closeSearchPage} username={searchContent} />
      )}
    </>
  );
}

export default Header;
