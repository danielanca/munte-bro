import React from "react";
import classNames from "classnames";
import { Container, Navbar } from "react-bootstrap";

import NavbarSearch from "./NavbarSearch";
import NavbarNav from "./NavbarNav/NavbarNav";
import NavbarToggle from "./NavbarToggle";

export type MainNavbarProps = {
  /** The layout type where the MainNavbar is used (optional, for your own logic). */
  layout?: string;
  /** Whether the main navbar is sticky to the top. */
  stickyTop?: boolean;
};

const MainNavbar: React.FC<MainNavbarProps> = ({ layout, stickyTop = true }) => {
  const classes = classNames("main-navbar", "bg-white", stickyTop && "sticky-top");

  return (
    <div className={classes}>
      <Container className="px-5 py-1">
        {/* react-bootstrap: use variant for colors; keep utility classes */}
        <Navbar variant="light" className="align-items-stretch flex-md-nowrap p-0">
          <NavbarSearch />
          <NavbarNav />
          <NavbarToggle />
        </Navbar>
      </Container>
    </div>
  );
};

export default MainNavbar;
