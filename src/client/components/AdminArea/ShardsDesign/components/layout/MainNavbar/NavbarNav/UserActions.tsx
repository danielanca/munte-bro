import React from "react";
import { Link } from "react-router-dom";
import { Nav, Dropdown } from "react-bootstrap";
import avatar0 from "../../../../images/avatars/0.jpg"; // <-- import, no require

export type UserActionsProps = {
  /** Display name next to the avatar (hidden on xs). */
  displayName?: string;
};

const UserActions: React.FC<UserActionsProps> = ({ displayName = "Sierra Brooks" }) => {
  const [show, setShow] = React.useState(false);

  return (
    <Dropdown
      as={Nav.Item}
      align="end"
      show={show}
      onToggle={(next) => setShow(!!next)}
      className="user-actions"
    >
      <Dropdown.Toggle
        as={Nav.Link}
        className="text-nowrap px-3 d-flex align-items-center"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          setShow((s) => !s);
        }}
      >
        <img
          className="user-avatar rounded-circle mx-2"
          src={avatar0}
          alt="User Avatar"
          width={32}
          height={32}
          style={{ objectFit: "cover" }}
        />
        <span role="button" className="d-none d-md-inline-block fw-bold">
          {displayName}
        </span>
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu-small">
        <Dropdown.Item as={Link} to="/" className="text-danger">
          <i className="material-icons me-2 text-danger">&#xE879;</i> Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserActions;
