import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const Navigation = ({ children }) => {
  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    // Redirect to the login page or any other page
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand >Chicken</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/menu">Menu</Nav.Link>
          <Nav.Link href="/riwayat">Riwayat</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link onClick={handleLogout} href="/">
            Logout
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
