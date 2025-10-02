// @ts-nocheck
import React, { useState, useRef } from "react";
import useAuth from "../hooks/useAuth";
import { requestLoginAccess } from "../../services/emails";
import { Credentials, ResponseServer } from "./AdminTypes";
import { useLocation, useNavigate } from "react-router-dom";
import { setJWT } from "../../utils/functions";
import styles from "./LogIn.module.scss";

const Login = () => {
  const [userCredentials, setuserCredentials] = useState<Credentials>({ email: "", password: "", accessToken: "" });

  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = "/";

  const userRef = useRef();

  const requestAccess = async () => {
    try {
      await requestLoginAccess(userCredentials.email, userCredentials.password).then((dataResponse) => {
        dataResponse.json().then((jsonResponse: ResponseServer) => {
          if (jsonResponse.LOGIN_ANSWER === "SUCCESS") {
            setAuth((auth) => ({
              ...auth,
              email: userCredentials.email,
              password: userCredentials.password,
              accessToken: jsonResponse.LOGIN_TOKEN
            }));
            console.log("RESPONSE:", jsonResponse.LOGIN_TOKEN);
            setJWT("jwt", jsonResponse.LOGIN_TOKEN, 1).then((confirmation) => {
              if (confirmation) {
                navigate("/admin", { replace: true });
              }
            });
          } else {
            console.log("Here is the result:", jsonResponse.LOGIN_ANSWER);
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  const onSubmitLogin = () => {
    requestAccess();
  };

  const inputHandler = (data: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = data.target;
    setuserCredentials((userCredentials) => ({ ...userCredentials, [name]: value }));
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCardBoard}>
        <div className={styles.logo}>
          <img
            className={styles.loginLogo}
            src="https://firebasestorage.googleapis.com/v0/b/sapunmontan.appspot.com/o/logo%2Fmontanair.png?alt=media&token=f42ebf81-1205-44d2-806b-7130100adda7"
          />
        </div>

        <h3 className={styles.textInside}>{"Login Admin"}</h3>
        <div className={styles.inputFields}>
          <label className="admin" htmlFor="email">
            {"Email:"}
          </label>
          <input name="email" type={"email"} onChange={inputHandler}></input>
          <label className="admin" htmlFor="email">
            {"Parola:"}
          </label>
          <input name="password" type={"password"} onChange={inputHandler}></input>
          <input type="submit" value="Submit" onClick={onSubmitLogin} />
        </div>
      </div>
    </div>
  );
};
export default Login;
