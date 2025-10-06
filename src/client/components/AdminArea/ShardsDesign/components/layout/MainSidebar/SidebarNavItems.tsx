// components/AdminArea/ShardsDesign/components/layout/SidebarNavItems.tsx
import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import SidebarNavItem from "./SidebarNavItem";
import type { SidebarItem as LegacySidebarItem } from "../../../data/sidebar-nav-items";
import { Store } from "../../../flux";

const SidebarNavItems: React.FC = () => {
  const [navItems, setNavItems] = useState<LegacySidebarItem[]>(
    () => Store.getSidebarItems()
  );

  useEffect(() => {
    const onChange = () => setNavItems(Store.getSidebarItems());
    Store.addChangeListener(onChange);
    onChange();
    return () => Store.removeChangeListener(onChange);
  }, []);

  return (
    <div className="nav-wrapper">
      <Nav className="nav--no-borders flex-column" as="ul">
        {navItems.map((item) => (
          <SidebarNavItem key={item.to} item={item} />
        ))}
      </Nav>
    </div>
  );
};

export default SidebarNavItems;
