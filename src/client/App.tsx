// src/client/App.tsx
import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { ContextWrapper } from "./Context";
import "@fontsource/luckiest-guy";

import useScrollHandler from "./components/hooks/hooks/useScrollHandler";
import useProductData from "./components/hooks/hooks/useProductData";
import routes from "./routes/routes";
import { getCookie } from "./utils/functions";

import { AppProvider } from "./AppContext";
import AnalyticsSnippet from "./components/AnalyticsScript";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./data/customCSS.scss";

import NotFound from "./components/NotFound/NotFound";

import CheckAuth from "./components/AdminArea/CheckAuth";
import RequireAuth from "./components/AdminArea/RequireAuth";
import Login from "./components/AdminArea/LogIn";
import { AuthProvider } from "./components/context/AuthProvider";

import Dashboard from "./components/AdminArea/ShardsDesign/Dashboard";
import AdminArea from "./components/AdminArea/AdminArea";
import UpdateProducts from "./components/AdminArea/UpdateProducts";
import UpdateCupons from "./components/AdminArea/UpdateCupons";
import EditStrings from "./components/AdminArea/EditStrings/EditStrings";
import adminRoutes from "./components/AdminArea/ShardsDesign/adminRoutes.config";
import DefaultLayout from "./components/AdminArea/ShardsDesign/layouts";
import { CartProvider } from "./components/context/CartProvider";
import PageLoader from "./components/UI/PageLoader";

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}
function getCookieConsent() {
  if (!isBrowser()) return false;
  return getCookie("cookieConsentBrasov") !== "userAccepted";
}

const App: React.FC = () => {
  if (isBrowser()) useScrollHandler();
  const [ssProducts, setSSproducts] = useProductData();

  return (
    <ContextWrapper>
      <AppProvider>
        <AuthProvider>
          <CartProvider>
          <AnalyticsSnippet />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<RequireAuth />}>
                <Route path="/admin" element={<Dashboard />}>
                  {adminRoutes.map((item: any, index: number) => {
                    const isIndex = !item.path || item.path === "";
                    const Element = (
                      <item.layout>
                        <item.component />
                      </item.layout>
                    );
                    return isIndex ? (
                      <Route key={index} index element={Element} />
                    ) : (
                      <Route key={index} path={item.path} element={Element} />
                    );
                  })}
                  <Route
                    path="old"
                    element={
                      <DefaultLayout>
                        <AdminArea />
                      </DefaultLayout>
                    }
                  />
                  <Route
                    path="products"
                    element={
                      <DefaultLayout>
                        <UpdateProducts />
                      </DefaultLayout>
                    }
                  />
                  <Route
                    path="manage-cupon"
                    element={
                      <DefaultLayout>
                        <UpdateCupons />
                      </DefaultLayout>
                    }
                  />
                  <Route
                    path="lists"
                    element={
                      <DefaultLayout>
                        <EditStrings />
                      </DefaultLayout>
                    }
                  />
                </Route>
              </Route>

              {routes.map((route, index) => {
                const Layout = (route.layout as React.ComponentType<any>) || React.Fragment;
                const Component = route.component as React.ComponentType<any>;
                const children = route.children || [];
                return (
                  <Route
                    key={route.path || index}
                    path={route.path}
                    element={
                      <Layout>
                        <Component {...(route.props || {})} />
                      </Layout>
                    }
                  >
                    {children.map((child: any, childIndex: number) => {
                      const ChildLayout = (child.layout as React.ComponentType<any>) || React.Fragment;
                      const ChildComp = child.component as React.ComponentType<any>;
                      return (
                        <Route
                          key={child.path || `${route.path}-child-${childIndex}`}
                          path={child.path}
                          element={
                            <ChildLayout>
                              <ChildComp {...(child.props || {})} />
                            </ChildLayout>
                          }
                        />
                      );
                    })}
                  </Route>
                );
              })}

              <Route element={<CheckAuth />}>
                <Route path="/login" element={<Login />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </CartProvider>
        </AuthProvider>
      </AppProvider>
    </ContextWrapper>
  );
};

export default App;
