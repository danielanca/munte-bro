import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { ContextWrapper } from "./Context";
import "@fontsource/luckiest-guy";

import useScrollHandler from "./components/hooks/hooks/useScrollHandler";
import useProductData from "./components/hooks/hooks/useProductData";
import routes from "./routes/routes";
// import CookieConsent from "./components/CookieConsent/CookieConsent"; // enable when needed
import { getCookie } from "./utils/functions";

import { AppProvider } from "./AppContext";
import { SidebarContextProvider } from "./AdminDashboard/store/sidebarContext";
import { LangContextProvider } from "./AdminDashboard/store/langContext";
import { ThemeContextProvider } from "./AdminDashboard/store/themeContext";
import { LoginContextProvider } from "./AdminDashboard/store/loginContext";

import LoadingSpinner from "./AdminDashboard/components/UI/loadingSpinner/LoadingSpinner";
// NOTE: path name intentionally left as in your repo; if your file is actually spelled "...Expiration"
// then change the import path accordingly and keep the hook name consistent.
import useAuthTokenExpiratio from "./AdminDashboard/components/auth/firebase/useAuthTokenExpiratio";
import { auth } from "./firebase";

import AnalyticsSnippet from "./components/AnalyticsScript";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./data/customCSS.scss";


function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function getCookieConsent() {
  if (!isBrowser()) return false;
  return getCookie("cookieConsentBrasov") !== "userAccepted";
}

const App: React.FC = () => {
  // Hooks that touch window/scroll should only run in the browser.
  if (isBrowser()) {
    // harmless guard; your hook likely guards internally too
    useScrollHandler();
  } 

  // Keep this aligned with the actual imported name/file
  useAuthTokenExpiratio(auth);

  // If you don’t use the returned values directly, you can still keep the hook
  // (e.g., it hydrates context or localStorage). Otherwise remove it.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ssProducts, setSSproducts] = useProductData();

  return (
    <LangContextProvider>
      <LoginContextProvider>
        <ThemeContextProvider>
          <SidebarContextProvider>
            <ContextWrapper>
              {/* Uncomment when you want to show it (browser only)
              {getCookieConsent() && <CookieConsent />} */}

              <AppProvider>
                {/* Must render inside Router (provided by server/client entries) */}
                <AnalyticsSnippet />

                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
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
                  </Routes>
                </Suspense>
              </AppProvider>
            </ContextWrapper>
          </SidebarContextProvider>
        </ThemeContextProvider>
      </LoginContextProvider>
    </LangContextProvider>
  );
};

export default App;
