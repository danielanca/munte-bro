import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { ContextWrapper } from "./Context";
import "@fontsource/luckiest-guy";

import useScrollHandler from "./components/hooks/hooks/useScrollHandler";
import useProductData from "./components/hooks/hooks/useProductData";
import routes from "./routes/routes"; // PUBLIC routes only (no admin spread)
import { getCookie } from "./utils/functions";

import { AppProvider } from "./AppContext";
// import { auth } from "./firebase"; // optional if unused

import AnalyticsSnippet from "./components/AnalyticsScript";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./data/customCSS.scss";
import RouteSpinner from "./components/UI/RouteSpinner";

import NotFound from "./components/NotFound/NotFound";

// Admin subtree + login gate
import AdminRoutes from "./routes/adminRoutes"; // mounted under /admin/*
import CheckAuth from "./components/AdminArea/CheckAuth";
import Login from "./components/AdminArea/LogIn";
import { AuthProvider } from "./components/context/AuthProvider";

// ✅ Auth context provider so useAuth() is safe everywhere

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function getCookieConsent() {
  if (!isBrowser()) return false;
  return getCookie("cookieConsentBrasov") !== "userAccepted";
}

const App: React.FC = () => {
  if (isBrowser()) {
    useScrollHandler();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ssProducts, setSSproducts] = useProductData();

  return (
    <ContextWrapper>
      <AppProvider>
        {/* Provide auth to everything that uses useAuth() */}
        <AuthProvider>
          <AnalyticsSnippet />

          <Suspense fallback={<RouteSpinner />}>
            <Routes>
              {/* Mount all admin pages as a dedicated subtree */}
              <Route path="/admin/*" element={<AdminRoutes />} />

              {/* Public / marketing routes from your config */}
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
                      const ChildLayout =
                        (child.layout as React.ComponentType<any>) || React.Fragment;
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

              {/* Top-level /login (outside AdminRoutes), but still inside AuthProvider */}
              <Route element={<CheckAuth />}>
                <Route path="/login" element={<Login />} />
              </Route>

              {/* Global 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </AppProvider>
    </ContextWrapper>
  );
};

export default App;
