import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { getCookie } from "../../utils/functions";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
  const auth = useAuth();
  console.log("Auth:", auth);
  const location = useLocation();

  return getCookie("jwt") === "ABCJWT" ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
  // #1 return auth?.authorise == true ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};
//BUG: Can't do #1 because its state changes too late (authorise) , and appears as false in the first place, it needs
//a refresh to get the updated value of TRUE
export default RequireAuth;
