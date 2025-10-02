// src/client/routes/adminRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import AdminArea from "../components/AdminArea/AdminArea";
import UpdateProducts from "../components/AdminArea/UpdateProducts";
import UpdateCupons from "../components/AdminArea/UpdateCupons";
import EditStrings from "../components/AdminArea/EditStrings/EditStrings";
import Dashboard from "../components/AdminArea/ShardsDesign/Dashboard";

import adminRoutes from "../components/AdminArea/ShardsDesign/adminRoutes.config"; // config ARRAY

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Parent is the mount point (/admin) */}
      <Route path="" element={<Dashboard />}>
        {/* Config-driven children (relative to /admin) */}
        {adminRoutes.map((item, index) => {
          const Layout = item.layout ?? React.Fragment;
          const Comp = item.component;
          const isIndex = item.path === "";
          return (
            <Route
              key={index}
              index={isIndex}
              path={isIndex ? undefined : item.path}
              element={
                <Layout>
                  <Comp />
                </Layout>
              }
            />
          );
        })}

        {/* Optional direct admin pages (also relative) */}
        <Route path="old" element={<AdminArea />} />
        <Route path="products" element={<UpdateProducts />} />
        <Route path="manage-cupon" element={<UpdateCupons />} />
        <Route path="lists" element={<EditStrings />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
