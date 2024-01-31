import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FaBars, FaTimes } from "react-icons/fa";
const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };
  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="bg-[#121418b6] py-2">
        <Container>
          <Navbar.Brand href="#home" className="text-white">
            React-Bootstrap
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            className="text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {/* Toggle between bars and times icons based on the state */}
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </Navbar.Toggle>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#features" className="text-white">
                Features
              </Nav.Link>
              <Nav.Link href="#pricing" className="text-white">
                Pricing
              </Nav.Link>
              <Nav.Link href="#pricing" className="text-white">
                Pricing
              </Nav.Link>
              <Nav.Link href="#pricing" className="text-white">
                Pricing
              </Nav.Link>
              <Nav.Link href="#pricing" className="text-white">
                Pricing
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
