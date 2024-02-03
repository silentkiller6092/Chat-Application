import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {
  FaBars,
  FaTimes,
  FaComments as ChatIcon,
  FaHome as HomeIcon,
  FaUserFriends as FollowerIcon,
  FaUserCheck as FollowingIcon,
  FaUserPlus as AddUserIcon,
  FaSignOutAlt as LogoutIcon,
} from "react-icons/fa";

// Usage example

function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };
  return (
    <Navbar expand="lg" className="bg-[#1d2025]">
      <Container fluid>
        <Navbar.Brand href="#" className="text-white">
          <span className="iconclass">
            <ChatIcon className="mr-1" /> Let's Chat
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
          <Form className="d-flex text-white">
            <Form.Control
              type="search"
              className="me-2 bg-black text-white"
              defaultValue="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
