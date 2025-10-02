import React from "react";
import { Form, InputGroup } from "react-bootstrap";

const NavbarSearch: React.FC = () => {
  return (
    <Form className="main-navbar__search w-100 d-none d-md-flex d-lg-flex" role="search">
      <InputGroup className="ms-3">{/* was ml-3 in BS4 */}
        <InputGroup.Text className="d-flex">
          <i className="material-icons">search</i>
        </InputGroup.Text>
        <Form.Control
          className="navbar-search"
          placeholder="Search for something..."
          aria-label="Search"
          type="search"
        />
      </InputGroup>
    </Form>
  );
};

export default NavbarSearch;
