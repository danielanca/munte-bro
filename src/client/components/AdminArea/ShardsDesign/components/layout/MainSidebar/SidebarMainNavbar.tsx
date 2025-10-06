// SidebarMainNavbar.tsx
import React, { useCallback } from "react";
import { Navbar, Container } from "react-bootstrap";
// If your project supports importing SVGs, keep this import.
// Otherwise pass `logoSrc` via props or add a *.svg module declaration.
import logoUrl from "../../../images/shards-dashboards-logo.svg";
import { Dispatcher, Constants } from "../../../flux";

export type SidebarMainNavbarProps = {
  /** Whether to hide the logo text, or not. */
  hideLogoText?: boolean;
  /** Optional override for the logo image src. */
  logoSrc?: string;
};

const SidebarMainNavbar: React.FC<SidebarMainNavbarProps> = ({
  hideLogoText = false,
  logoSrc = logoUrl as unknown as string,
}) => {
  const handleToggleSidebar = useCallback(() => {
    Dispatcher.dispatch({ actionType: Constants.TOGGLE_SIDEBAR });
  }, []);

  return (
    <div className="main-navbar">
      <Navbar
        bg="white"
        variant="light"
        className="align-items-stretch flex-md-nowrap border-bottom p-0"
        expand={false}
      >
        <Container fluid className="p-0">
          <Navbar.Brand href="#" className="w-100 me-0" style={{ lineHeight: "25px" }}>
            <div className="d-table m-auto">
              <img
                id="main-logo"
                className="d-inline-block align-top mx-2"
                style={{ maxWidth: 25 }}
                src={logoSrc}
                alt="MontanAir Admin"
              />
              {!hideLogoText && <span className="d-none d-md-inline ms-1">MontanAir.Ro Panel</span>}
            </div>
          </Navbar.Brand>

          {/* Mobile-only sidebar toggle */}
          <button
            type="button"
            className="toggle-sidebar d-sm-inline d-md-none d-lg-none btn btn-link"
            onClick={handleToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <i className="material-icons">&#xE5C4;</i>
          </button>
        </Container>
      </Navbar>
    </div>
  );
};

export default SidebarMainNavbar;
