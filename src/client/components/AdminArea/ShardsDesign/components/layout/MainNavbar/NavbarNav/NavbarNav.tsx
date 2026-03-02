import React from "react";
import { Nav } from "react-bootstrap";
import Notifications from "./Notifications";
import UserActions from "./UserActions";

const NavbarNav: React.FC = () => {
  return (
    <Nav navbar className="border-left flex-row ms-auto">

      <UserActions />
    </Nav>
  );
};

export default NavbarNav;
