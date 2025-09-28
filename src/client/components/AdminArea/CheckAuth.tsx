import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/hooks/useAuth";

const CheckAuth = () => {
  const { auth } = useAuth();
  console.log("Auth from CheckAuth:", auth);
  const location = useLocation();

  return auth?.authorise === false ? <Outlet /> : <Navigate to="/admin" state={{ from: location }} replace />;
};

export default CheckAuth;
