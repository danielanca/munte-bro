// components/AdminArea/ShardsDesign/components/layout/SidebarNavItem.tsx
import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { MdEdit, MdTableChart, MdNoteAdd } from "react-icons/md";
import type { IconType } from "react-icons";
import type { SidebarItem as LegacySidebarItem } from "../../../data/sidebar-nav-items";

type Props = { item: LegacySidebarItem };

const iconMap: Record<string, IconType> = {
  edit: MdEdit,
  table_chart: MdTableChart,
  note_add: MdNoteAdd,
};

function pickIcon(htmlBefore?: string): IconType {
  const name = htmlBefore?.match(/material-icons">([^<]+)<\/i>/)?.[1] ?? "edit";
  return iconMap[name] ?? MdEdit;
}

const SidebarNavItem: React.FC<Props> = ({ item }) => {
  const Icon = pickIcon(item.htmlBefore);

  return (
    <Nav.Item as="li">
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          `nav-link d-flex align-items-center${isActive ? " active" : ""}`
        }
        style={({ isActive }) => ({ fontWeight: isActive ? 600 : 400 })}
        end
      >
        <Icon size={18} className="me-2" aria-hidden />
        <span>{item.title}</span>
      </NavLink>
    </Nav.Item>
  );
};

export default SidebarNavItem;
