import React from "react";
import { Navbar } from "react-bootstrap";
import { Dispatcher, Constants } from "../../../flux";
import logoUrl from "../../../images/shards-dashboards-logo.svg"; // <-- import instead of require

export type SidebarMainNavbarProps = {
  /** Whether to hide the logo text, or not. */
  hideLogoText?: boolean;
};

const SidebarMainNavbar: React.FC<SidebarMainNavbarProps> = ({ hideLogoText = false }) => {
  const handleToggleSidebar = React.useCallback(() => {
    Dispatcher.dispatch({ actionType: Constants.TOGGLE_SIDEBAR });
  }, []);

  return (
    <div className="main-navbar">
      <Navbar bg="white" variant="light" className="align-items-stretch flex-md-nowrap border-bottom p-0">
        <Navbar.Brand href="#" className="w-100 me-0" style={{ lineHeight: "25px" }}>
          <div className="d-table m-auto">
            <img
              id="main-logo"
              className="d-inline-block align-top mx-2"
              style={{ maxWidth: 25 }}
              src={logoUrl}
              alt="Shards Dashboard"
            />
            {!hideLogoText && <span className="d-none d-md-inline ms-1">MontanAir.Ro Panel</span>}
          </div>
        </Navbar.Brand>

        <button
          type="button"
          className="toggle-sidebar d-sm-inline d-md-none d-lg-none btn btn-link mb-0"
          onClick={handleToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className="material-icons">&#xE5C4;</i>
        </button>
      </Navbar>
    </div>
  );
};

export default SidebarMainNavbar;
