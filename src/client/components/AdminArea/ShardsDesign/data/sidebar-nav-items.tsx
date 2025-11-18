// Shared type used by SidebarNavItem
export type SidebarItem = {
  title: string;
  to: string;
  htmlBefore?: string; // raw HTML (e.g., <i class="material-icons">...</i>)
  htmlAfter?: string;
};

export default function getSidebarNavItems(): SidebarItem[] {
  return [
    {
      title: "Main Panel",
      to: "/admin/",
      htmlBefore: '',
    },
    {
      title: "Orders",
      to: "/admin/orders",
      htmlBefore: '<i class="material-icons">table_chart</i>',
    },
    {
      title: "Add Blog Post",
      to: "/admin/addpost",
      htmlBefore: '<i class="material-icons">note_add</i>',
    },
    {
      title: "Products",
      to: "/admin/manage-product",
      htmlBefore: '<i class="material-icons">note_add</i>',
    },
    {
      title: "Cupon Reducere",
      to: "/admin/cupondiscount",
      htmlBefore: '<i class="material-icons">table_chart</i>',
    },
  ];
}
