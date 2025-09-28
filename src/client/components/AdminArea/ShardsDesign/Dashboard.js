import React from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
// import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";

const Dashboard = () => {
  require("./shards-dashboard/styles/shards-dashboards.1.1.0.min.css");
  return <Outlet />;
};

export default Dashboard;
