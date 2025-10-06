// components/AdminArea/ShardsDesign/Dashboard.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import DefaultLayout from "./ShardsDesign/layouts/Default";


const Dashboard: React.FC = () => (
  <DefaultLayout>
    <Outlet />
  </DefaultLayout>
);

export default Dashboard;
