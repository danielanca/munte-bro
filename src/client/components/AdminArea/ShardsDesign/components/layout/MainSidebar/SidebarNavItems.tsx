import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import SidebarNavItem, { SidebarItem } from "./SidebarNavItem";
import { Store } from "../../../flux";

const SidebarNavItems: React.FC = () => {
  const [navItems, setNavItems] = useState<SidebarItem[]>(() => Store.getSidebarItems());

  useEffect(() => {
    const onChange = () => setNavItems(Store.getSidebarItems());
    Store.addChangeListener(onChange);
    // initialize once in case Store already had state
    onChange();
    return () => {
      Store.removeChangeListener(onChange);
    };
  }, []);

  return (
    <div className="nav-wrapper">
      <Nav className="nav--no-borders flex-column">
        {navItems.map((item, idx) => (
          <SidebarNavItem key={idx} item={item} />
        ))}
      </Nav>
    </div>
  );
};

export default SidebarNavItems;
