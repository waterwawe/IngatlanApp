import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, DropdownButton, Button, Image } from 'react-bootstrap';
import Logo from './pics/logo.PNG';

export default function MyNavbar({ loggedinState, username }) {

  useEffect(() => {
  }, [loggedinState, username])

  return (
    <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
      <Nav className="justify-content-flex-end">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
      </Nav>
      <Navbar.Collapse id="responsive-navbar-nav">
        <Navbar.Brand href="/#/">
          <Image className="brand-logo" src={Logo} alt="RealSTATE logo"/>
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/#/">Home</Nav.Link>
          <Nav.Link href="/#/search">Search properties</Nav.Link>
          <Nav.Link href="/#/map">Open map</Nav.Link>
        </Nav>
        <Nav>
          {loggedinState ?
            <DropdownButton variant="outline-info" drop="left" title={`Logged in as ${username}`}>
              <NavDropdown.Item href="/#/messages">My messages</NavDropdown.Item>
              <NavDropdown.Item href="/#/profile">Edit profile</NavDropdown.Item>
              <NavDropdown.Item href="/#/manage">Manage my houses</NavDropdown.Item>
              <NavDropdown.Item href="/#/newestate">Upload a new ad</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/#/logout">Logout</NavDropdown.Item>
            </DropdownButton> :
            <Button href="/#/login" variant="outline-info">Login</Button>}

        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );

}