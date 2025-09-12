


import loadable from "@loadable/component";
import { RouteType } from "./types";
import wrapWithProtectedRoute from "../AdminDashboard/route/wrapWithProtectedRoute";

// Lazy load components
const MainLayout = loadable(() => import("../AdminDashboard/layout/MainLayout"), { ssr: true });
const Dashboard = loadable(() => import("../AdminDashboard/pages/Dashboard"), { ssr: true });
const Customers = loadable(() => import("../AdminDashboard/pages/Customers"), { ssr: true });
const CustomerEdit = loadable(() => import("../AdminDashboard/pages/CustomerEdit"), { ssr: true });
const Products = loadable(() => import("../AdminDashboard/pages/Products"), { ssr: true });
const AddProduct = loadable(() => import("../AdminDashboard/pages/AddProduct"), { ssr: true });
const EditProduct = loadable(() => import("../AdminDashboard/pages/EditProduct"), { ssr: true });
const Orders = loadable(() => import("../AdminDashboard/pages/Orders"), { ssr: true });
const Analytics = loadable(() => import("../AdminDashboard/pages/Analytics"), { ssr: true });
const BlankPage = loadable(() => import("../AdminDashboard/pages/BlankPage"), { ssr: true });
const Login = loadable(() => import("../AdminDashboard/components/login/Login"), { ssr: true });
const AdminSignup = loadable(() => import("../AdminDashboard/components/auth/signup/Signup"), { ssr: true });
const NotFound = loadable(() => import("../AdminDashboard/pages/NotFound"), { ssr: true });
const VideoUpload = loadable(() => import("../pages/Instructions/VideoUpload"), { ssr: true });


// Import the updated ProtectedRoute wrapper

// Define the routes using the wrapper function
const adminRoutes: RouteType[] = [
  {
    path: "admin",
    layout: MainLayout,
    component: MainLayout,
    children: [
      {
        path: "",
        index: true,
        component: wrapWithProtectedRoute(Dashboard), 
      },
      {
        path: "customers",
        component: wrapWithProtectedRoute(Customers), 
      },
      {
        path: "customers/:customerId",
        component: wrapWithProtectedRoute(CustomerEdit),
        layout: MainLayout,
      },
      {
        path: "products",
        component: wrapWithProtectedRoute(Products), 
        layout: MainLayout,
      },
      {
        path: "products/add-product",
        component: wrapWithProtectedRoute(AddProduct), 
        layout: MainLayout,
      },
      {
        path: "products/edit-product/:id",
        component: wrapWithProtectedRoute(EditProduct), 
        layout: MainLayout,
      },
      {
        path: "orders",
        component: wrapWithProtectedRoute(Orders), 
        layout: MainLayout,
      },
      {
        path: "analytics",
        component: wrapWithProtectedRoute(Analytics), 
        layout: MainLayout,
      },
      {
        path: "discount",
        component: wrapWithProtectedRoute(BlankPage),
      },
      {
        path: "inventory",
        component: wrapWithProtectedRoute(BlankPage),
      },
      {
        path: "video-upload",
        component: wrapWithProtectedRoute(VideoUpload),
      },
    ],
  },
  { path: "login", component: Login },
  { path: "admin/signup", component: AdminSignup },
  { path: "*", component: NotFound },
];

export default adminRoutes;
