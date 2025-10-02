import React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";

export type SidebarItem = {
  to: string;
  title?: string;
  htmlBefore?: string; // raw HTML string (e.g., icon markup)
  htmlAfter?: string;  // raw HTML string (e.g., badge markup)
  className?: string;
};

export type SidebarNavItemProps = {
  item: SidebarItem;
};

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ item }) => {
  return (
    <Nav.Item>
      <Nav.Link
        as={RouterNavLink}
        to={item.to}
        className={`d-flex ${item.className ?? ""}`}
      >
        {item.htmlBefore && (
          <div
            className="d-inline-block item-icon-wrapper"
            dangerouslySetInnerHTML={{ __html: item.htmlBefore }}
          />
        )}
        {item.title && <span>{item.title}</span>}
        {item.htmlAfter && (
          <div
            className="d-inline-block item-icon-wrapper ms-auto"
            dangerouslySetInnerHTML={{ __html: item.htmlAfter }}
          />
        )}
      </Nav.Link>
    </Nav.Item>
  );
};

export default SidebarNavItem;
