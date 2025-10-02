import React from "react";
import { Dispatcher, Constants } from "../../../flux";

const NavbarToggle: React.FC = () => {
  const handleClick = React.useCallback(() => {
    Dispatcher.dispatch({ actionType: Constants.TOGGLE_SIDEBAR });
  }, []);

  return (
    <nav className="nav">
      <button
        type="button"
        onClick={handleClick}
        className="nav-link nav-link-icon toggle-sidebar d-sm-inline d-md-inline d-lg-none text-center btn btn-link p-0"
        aria-label="Toggle sidebar"
      >
        <i className="material-icons">&#xE5D2;</i>
      </button>
    </nav>
  );
};

export default NavbarToggle;
