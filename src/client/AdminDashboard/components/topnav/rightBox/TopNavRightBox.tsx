// src/TopNavRightBox.tsx
import React from "react";
import ThemeBox from "./themeBox/ThemeBox";
import LangBox from "./langBox/LangBox";
import Profile from "./profile/Profile";
import { images } from "../../../constants";
import classes from "./TopNavRightBox.module.scss";
import { useAppContext } from "../../../../Context";
import { auth } from "../../../../firebase"; 
import { useNavigate } from "react-router-dom"; 

function TopNavRightBox() {
  const { name, isAdmin } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("User logged out");
      navigate("/login"); 
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  if (!name) {
    return null; // Do not render anything if user is not logged in
  }

  return (
    <div className={classes.topNavBox_right}>
      <div className={classes.wrapper}>
        <LangBox />
        <ThemeBox />
      </div>
      <Profile userName={name} avatar={images.avt} />

      {/* Show Logout button if the user is logged in */}
      <button className={classes.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default TopNavRightBox;
