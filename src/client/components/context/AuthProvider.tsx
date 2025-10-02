// components/AdminArea/context/AuthProvider.tsx
import { createContext, useState } from "react";
import { getCookie } from "../../utils/functions";
import type { Provi, ProviInter } from "./ProviderTypes";

const AuthContext = createContext<ProviInter | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ✅ don’t hardcode token string; authorize if a jwt cookie exists
  const hasToken = Boolean(getCookie("jwt"));
  const [auth, setAuth] = useState<Provi>({
    email: "",
    password: "",
    accessToken: "",
    authorise: hasToken,
  });

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
