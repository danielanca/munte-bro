import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ContextWrapper } from "./Context";
import "@fontsource/luckiest-guy";
import useScrollHandler from "./components/hooks/hooks/useScrollHandler";
import useProductData from "./components/hooks/hooks/useProductData";
import routes from "./routes/routes";
import CookieConsent from "./components/CookieConsent/CookieConsent";
import { getCookie } from "./utils/functions";
import { ProductsContext } from "./Context";
import { AppProvider } from "./AppContext";
import { SidebarContextProvider } from "./AdminDashboard/store/sidebarContext";
import { LangContextProvider } from "./AdminDashboard/store/langContext";
import { ThemeContextProvider } from "./AdminDashboard/store/themeContext";
import { LoginContextProvider } from "./AdminDashboard/store/loginContext";
import LoadingSpinner from "./AdminDashboard/components/UI/loadingSpinner/LoadingSpinner";
import { Suspense } from "react";
import useAuthTokenExpiration from "./AdminDashboard/components/auth/firebase/useAuthTokenExpiratio";
import { auth } from "./firebase";
import AnalyticsSnippet from "./components/AnalyticsScript";
/* XXXXXXXXXXXXXXXXXXX */

/* WORDS BEFORE: If you run the SSR server as yarn build and then yarn serve, it will be marked as NODE_ENV=PRODUCTION*/
/* If you run by using yarn dev:server, it will use NODE_ENV=DEVELOPMENT */

/* XXXXXXXXXXXXXXXXXXX */

export const App = () => {
  const getCookieConsent = () => typeof document !== "undefined" && getCookie("cookieConsentBrasov") !== "userAccepted";
  useScrollHandler();
  useAuthTokenExpiration(auth);
  const [ssProducts, setSSproducts] = useProductData(); // This will manage product data

  return (
    <LangContextProvider>
      <LoginContextProvider>
        <ThemeContextProvider>
          <SidebarContextProvider>
            <ContextWrapper>
              {/* {getCookieConsent() && <CookieConsent />} */}
              <AppProvider>
                <AnalyticsSnippet />
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {routes.map((route, index) => {
                      const Layout = route.layout || React.Fragment;
                      const Component = route.component;
                      const children = route.children || [];

                      return (
                        <Route
                          key={index}
                          path={route.path}
                          element={
                            <Layout>
                              <Component {...route.props} />
                            </Layout>
                          }
                        >
                          {children.map((child: any, childIndex: number) => (
                            <Route key={childIndex} path={child.path} element={<child.component {...child.props} />} />
                          ))}
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
