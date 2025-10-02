import React from "react";
import { Form, InputGroup } from "react-bootstrap";

const SidebarSearch: React.FC = () => {
  return (
    <Form
      className="main-sidebar__search w-100 border-right d-sm-flex d-md-none d-lg-none"
      style={{ display: "flex", minHeight: 45 }}
      role="search"
    >
      <InputGroup className="ms-3" /* was ml-3 in BS4 */>
        <InputGroup.Text>
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

export default SidebarSearch;
