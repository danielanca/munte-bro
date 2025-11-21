// data/navItems.ts
import type { IconType } from "react-icons";
import { MdEdit, MdTableChart, MdNoteAdd } from "react-icons/md";

export type SidebarItem = {
  title: string;
  to: string;
  Icon: IconType; // <-- IconType from react-icons
};

export default function getSidebarNavItems(): SidebarItem[] {
  return [
    { title: "Main Panel",      to: "/admin/",               Icon: MdEdit },
    { title: "Orders",          to: "/admin/orders",         Icon: MdTableChart },
    { title: "Add Blog Post",   to: "/admin/addpost",        Icon: MdNoteAdd },
    { title: "Products",        to: "/admin/manage-product", Icon: MdNoteAdd },
    { title: "Cupon Reducere",  to: "/admin/cupondiscount",  Icon: MdTableChart },
  ];
}
