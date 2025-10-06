// components/AdminArea/context/AuthProvider.tsx
import { createContext, useEffect, useState } from "react";
import { auth } from "../../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { getCookie } from "../../utils/functions";
import { setJWT } from "../../utils/functions";

type AuthState = {
  user: User | null;
  accessToken: string;      // Firebase ID token (JWT)
  authorise: boolean;       // keep your flag
  loading: boolean;
};

type Ctx = {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
};

const AuthContext = createContext<Ctx | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: "",
    authorise: Boolean(getCookie("jwt")), // keeps current behavior on first load
    loading: true,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken(/* forceRefresh */ true);
        await setJWT("jwt", token, 1); // reuse your cookie helper (1 day)
        setState({ user, accessToken: token, authorise: true, loading: false });
      } else {
        // optional: clear cookie if you have a helper
        setState({ user: null, accessToken: "", authorise: false, loading: false });
      }
    });
    return () => unsub();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const token = await user.getIdToken(true);
    await setJWT("jwt", token, 1);
    setState((s) => ({ ...s, user, accessToken: token, authorise: true }));
  };

  const signUp = async (email: string, password: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    const token = await user.getIdToken(true);
    await setJWT("jwt", token, 1);
    setState((s) => ({ ...s, user, accessToken: token, authorise: true }));
  };

  const logOut = async () => {
    await signOut(auth);
    setState({ user: null, accessToken: "", authorise: false, loading: false });
  };

  return (
    <AuthContext.Provider value={{ auth: state, setAuth: setState, signIn, signUp, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
