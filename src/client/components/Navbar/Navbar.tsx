import React, { useEffect, useState } from "react";
import { HashLink, HashLink as Link, NavHashLink } from "react-router-hash-link";
// import ReactGA from "react-ga4";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { getCartItems } from "../CartPage/CartPage";
import TopBanner from "./TopBanner";
import MenuMobileSide from "../../components/MenuMobile/MenuMobileSide";
import styles from "./Navbar.module.scss";
import images from "../../data/images";
import strings from "../../data/strings.json";
import { useAppContext } from "./../../AppContext";

interface NavProps {
  updateNotification?: () => void;
  clearNotif: number;
}

const NavBar = ({ clearNotif }: NavProps) => {
  let { navMenu: navItems, cart } = strings;
  const { pathname } = useLocation();
  const { cartItems } = useAppContext(); // Access context
  // Function to update total items when cart changes

  return (
    <>
      {!pathname.includes("/admin") && !pathname.includes("/login") && (
        <>
          <TopBanner />
          <div className={styles.WeRomanians} />
          <div className={styles.wrapper}>
            <div className={styles.navbarContainer}>
              <div className={styles.sideLeftContainer}></div>
              <ul className={styles.ulMenuEnd}>
                <li className={styles.liItem}>
                  <NavHashLink className={styles.HashLinkStyle} smooth to={navItems.ourProducts.link}>
                    {navItems.ourProducts.name}
                  </NavHashLink>
                </li>
                <li className={styles.liItem}>
                  <NavHashLink className={styles.HashLinkStyle} to={navItems.blog.link}>
                    {navItems.blog.name}
                  </NavHashLink>
                </li>
              </ul>

              <div className={styles.middleNoUl}>
                <HashLink className={styles.logoHover} to='/'>
                  <img alt='logo' className={styles.montanLogo} src={images.websiteLogo} />
                </HashLink>
              </div>

              <MenuMobileSide />
              <ul className={styles.ulMenuStart}>
                <li className={styles.liItem}>
                  <NavHashLink className={styles.HashLinkStyle} to={navItems.intrebariFrecvente.link}>
                    {navItems.intrebariFrecvente.name}
                  </NavHashLink>
                </li>
                <li className={styles.liItem}>
                  <NavHashLink className={styles.HashLinkStyle} to={navItems.contactUs.link}>
                    {navItems.contactUs.name}
                  </NavHashLink>
                </li>
              </ul>
              <div className={styles.sideRightContainer}>
                <NavHashLink className={styles.hashTransparent} to={cart.link}>
                  <img alt='cart icon' className={styles.shopIcon} src={images.cartLogo} />
                  <span className={styles.jewel}>{cartItems}</span>
                </NavHashLink>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NavBar;
