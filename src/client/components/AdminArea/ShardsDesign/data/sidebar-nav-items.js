export default function () {
  return [
    {
      title: "Main Panel",
      to: "/admin/",
      htmlBefore: '<i class="material-icons">edit</i>'
    },
    {
      title: "Orders",
      htmlBefore: '<i class="material-icons">table_chart</i>',
      to: "/admin/orders"
    },
    {
      title: "Add Blog Post",
      htmlBefore: '<i class="material-icons">note_add</i>',
      to: "/admin/addpost"
    },
    {
      title: "Products",
      htmlBefore: '<i class="material-icons">note_add</i>',
      to: "/admin/manage-product"
    },
    {
      title: "Content Strings",
      htmlBefore: '<i class="material-icons">table_chart</i>',
      to: "/admin/content-list"
    },
    {
      title: "Cupon Reducere",
      htmlBefore: '<i class="material-icons">table_chart</i>',
      to: "/admin/cupondiscount"
    },
  ];
}

// {
//   title: "Acasa",
//   to: "/",
//   htmlBefore: '<i class="material-icons">edit</i>',
//   htmlAfter: ""
// },
// {
//   title: "Blog Posts",
//   htmlBefore: '<i class="material-icons">vertical_split</i>',
//   to: "/blog-posts"
// },
// {
//   title: "Add New Post",
//   htmlBefore: '<i class="material-icons">note_add</i>',
//   to: "/add-new-post"
// },
// {
//   title: "Forms & Components",
//   htmlBefore: '<i class="material-icons">view_module</i>',
//   to: "/components-overview"
// },
// {
//   title: "Tables",
//   htmlBefore: '<i class="material-icons">table_chart</i>',
//   to: "/tables"
// },
// {
//   title: "User Profile",
//   htmlBefore: '<i class="material-icons">person</i>',
//   to: "/user-profile-lite"
// },
// {
//   title: "Errors",
//   htmlBefore: '<i class="material-icons">error</i>',
//   to: "/errors"
// }
