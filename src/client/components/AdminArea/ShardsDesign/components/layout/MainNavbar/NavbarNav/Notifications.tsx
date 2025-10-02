import React from "react";
import { Nav, Dropdown, Badge } from "react-bootstrap";

const Notifications: React.FC = () => {
  const [show, setShow] = React.useState(false);

  return (
    <Dropdown
      as={Nav.Item}
      align="end"
      show={show}
      onToggle={(next) => setShow(!!next)}
      className="border-right notifications"
    >
      <Dropdown.Toggle
        as={Nav.Link}
        className="nav-link-icon text-center"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          setShow((s) => !s);
        }}
      >
        <div className="nav-link-icon__wrapper position-relative">
          <i className="material-icons">&#xE7F4;</i>
          <Badge pill bg="danger" className="position-absolute translate-middle">
            2
          </Badge>
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu-small p-0 show">
        <Dropdown.Item as="div" className="py-2 px-3">
          <div className="notification__icon-wrapper">
            <div className="notification__icon">
              <i className="material-icons">&#xE6E1;</i>
            </div>
          </div>
          <div className="notification__content">
            <span className="notification__category">Analytics</span>
            <p className="mb-0">
              Your website’s active users count increased by{" "}
              <span className="text-success text-semibold">28%</span> in the last week.
              Great job!
            </p>
          </div>
        </Dropdown.Item>

        <Dropdown.Item as="div" className="py-2 px-3">
          <div className="notification__icon-wrapper">
            <div className="notification__icon">
              <i className="material-icons">&#xE8D1;</i>
            </div>
          </div>
          <div className="notification__content">
            <span className="notification__category">Sales</span>
            <p className="mb-0">
              Last week your store’s sales count decreased by{" "}
              <span className="text-danger text-semibold">5.52%</span>. It could have been worse!
            </p>
          </div>
        </Dropdown.Item>

        <Dropdown.Divider className="my-0" />
        <Dropdown.Item as="button" className="notification__all text-center">
          View all Notifications
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Notifications;
