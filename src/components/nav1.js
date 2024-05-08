import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const Navigation1 = ({ children }) => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/login">Chicken</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/cart">keranjang</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation1;
