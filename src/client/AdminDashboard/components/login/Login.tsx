import React, { useContext, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginContext from "../../store/loginContext";
import langContextObj from "../../store/langContext";
import { images } from "../../constants";
import Input from "../UI/input/Input";
import Button from "../UI/button/Button";
import { useTranslation } from "react-i18next";
import classes from "./Login.module.scss";
import { Link } from "react-router-dom";
import imgHere from "../../assets/images/Revenue-cuate.svg";
import { login } from "../auth/firebase/login";

function LoginBox() {
  const loginCtx = useContext(LoginContext);
  const langCtx = useContext(langContextObj);
  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const errorMessageRef = useRef<HTMLSpanElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState<string>("");

  async function loginHandler(e: React.FormEvent) {
    e.preventDefault();
    const email = userNameRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    if (!email || !password) {
      setErrorMessage("Please provide both email and password.");
      return;
    }

    try {
      // Use the imported Firebase login function
      await login(email, password); 
      console.log("User logged in");
      loginCtx.toggleLogin();

      // Check what location.state looks like
      console.log(location.state);

      // Redirect to /admin if the user was on the /admin page before login
      const fromPath = location.state?.from || "/";
      navigate(fromPath); // Navigate to the previous path or to home
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials.");
      console.error("Error logging in:", error);
    }
  }

  return (
    <div className={`${classes.container} ${langCtx.lang === "fa" ? classes.rtl : ""}`}>
      <div className={classes.loginBox}>
        <div className={classes.logo}>
          <img src={images.logo} alt='Business Creators' />
        </div>
        <h2 className={classes.title}>{t("loginPage")}</h2>
        <form onSubmit={loginHandler}>
          <Input 
            ref={userNameRef} 
            type={"email"} 
            id={"userName"} 
            placeholder={"Enter your email"} 
          />
          <span ref={errorMessageRef} className={classes.errorMessage}>
            {errorMessage}
          </span>
          <Input 
            ref={passwordRef} 
            type={"password"} 
            id={"password"} 
            placeholder={"Enter your password"} 
          />
          <Button type='submit'>{t("login")}</Button>
          <Link className={classes.forgat_pass} to='/'>
            {t("forgetPass")}
          </Link>
          <div className={classes.checkbox}>
            <input type='checkbox' id='rememberMe' />
            <label htmlFor='rememberMe'>{t("rememberMe")}</label>
          </div>
        </form>
      </div>

      <div className={classes.keyPic}>
        <img src={imgHere} alt='illustrator key' />
      </div>
    </div>
  );
}

export default LoginBox;
