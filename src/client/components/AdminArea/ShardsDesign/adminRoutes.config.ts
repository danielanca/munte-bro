import { ComponentType, PropsWithChildren } from "react";
import BlogOverview from "./views/BlogOverview";
import AddNewPost from "./views/AddNewPost";
import OrdersTable from "./views/OrdersTable";
import ProductsPage from "./views/ProductsPage";
import EditProduct from "../EditProduct";
import EditStrings from "../EditStrings/EditStrings";
import AddProductNew from "../AddProductNew";
import AddCuponNew from "../AddCuponNew";
import CuponReducere from "../CuponReducere";
import EditCupon from "../EditCupon";
import DefaultLayout from "./layouts/Default";
import OrderView from "../ShardsDesign/views/OrderView"; 

export type RouteConfig = {
  /** relative to /admin */
  path: string;                                   // "" means index route
  layout?: ComponentType<PropsWithChildren>;      // defaults to Fragment when missing
  component: ComponentType<any>;
};

const adminRoutes: RouteConfig[] = [
  { path: "", layout: DefaultLayout, component: BlogOverview },
  { path: "addpost", layout: DefaultLayout, component: AddNewPost },
  { path: "orders", layout: DefaultLayout, component: OrdersTable },
    { path: "order/:id", layout: DefaultLayout, component: OrderView }, // ✅ here

  { path: "manage-product", layout: DefaultLayout, component: ProductsPage },
  { path: "products/add", layout: DefaultLayout, component: AddProductNew },
  { path: "cupondiscount/add", layout: DefaultLayout, component: AddCuponNew },
  { path: "products/edit/:id", layout: DefaultLayout, component: EditProduct },
  { path: "cupondiscount/edit/:id", layout: DefaultLayout, component: EditCupon },
  { path: "content-list", layout: DefaultLayout, component: EditStrings },
  { path: "cupondiscount", layout: DefaultLayout, component: CuponReducere },
];

export default adminRoutes;
