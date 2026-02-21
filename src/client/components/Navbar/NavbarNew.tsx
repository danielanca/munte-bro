import React, { useEffect, useState } from "react";
import { HashLink, NavHashLink } from "react-router-hash-link";
import ReactGA from "react-ga4";
import { useLocation } from "react-router-dom";
import TopBanner from "./TopBanner";
import styles from './NavbarNew.module.scss'
import images from "../../data/images1";
import strings from "../../data/strings.json";
import { FiSearch,FiPhoneCall } from "react-icons/fi";
import { BiShoppingBag } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { FaFacebookF } from "react-icons/fa";
import { AiOutlineTwitter, AiOutlineInstagram, AiOutlineShopping } from "react-icons/ai";
import { HiOutlineHome } from "react-icons/hi";
import HelloAllNew from "../../blocks/HelloAllNew";
import { useCart } from "../context/CartProvider";

interface NavProps {
  clearNotif: number;
  updateNotification?: () => void;
}

const NavbarNew: React.FC<NavProps> = () => {
  const { navMenu: navItems, cart } = strings as any;
  const { pathname } = useLocation();
  const { totalItems } = useCart();

  const [openNav, setOpenNav] = useState<boolean>(false);

  const sendAnalyticsIdea = () => {
    ReactGA.event("User pressed on gallery");
  };

  const toggleHandler = () => setOpenNav((s) => !s);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = openNav ? "hidden" : original || "";
    return () => {
      document.body.style.overflow = original;
    };
  }, [openNav]);

  const hideNav = pathname.includes("/admin") || pathname.includes("/login");
  if (hideNav) return null;

  return (
    <div className="navbarParentContainer">
      <div className="header_navbarnew_container">
        {!openNav && <TopBanner />}

        {/* Desktop / Laptop */}
        <div className={styles.headerParentContainer}>
          <div className={styles.navbarnewContainer}>
            <HashLink className={styles.logoHover} to="/" aria-label="Home">
              <img alt="logo" className={styles.updatedLogo} src={images.updatedLogo} />
            </HashLink>

            <nav className={styles.navbarLaptopPagesConatiner} aria-label="Primary">
              <HashLink to="/produsele-noastre?section=sare" className={styles.headerPages}>Sare</HashLink>
              <HashLink to="/produsele-noastre?section=sirop" className={styles.headerPages}>Siropuri</HashLink>
              <HashLink to="/produsele-noastre?section=sapunuri" className={styles.headerPages}>Sapunuri</HashLink>
              <HashLink to="/bombe" className={styles.headerPages}>Bombe</HashLink>
              <HashLink to="/desprenoi" className={styles.headerPages}>Despre Noi</HashLink>
            </nav>

            <div className={styles.rightActions}>
              <NavHashLink className={styles.searchIconParent} to={cart.link} aria-label="Search">
                <img alt="search icon" className={styles.searchIcon} src={images.searchIcon} />
              </NavHashLink>

              <a href="tel:+40752328965" className={styles.phoneIconWrapper}>
                <FiPhoneCall size={26} />
                <span className={styles.phoneBadge}>1</span>
              </a>

              <a href="tel:+40759791474" className={styles.phoneIconWrapper}>
                <FiPhoneCall size={26} />
                <span className={styles.phoneBadge}>2</span>
              </a>


              <NavHashLink className={styles.hashTransparent} to={cart.link} aria-label="Cart">
                <img alt="cart icon" className={styles.shopIcon} src={images.cartLogo} />
                <span className={styles.jewel} aria-live="polite">{totalItems}</span>
              </NavHashLink>

              <NavHashLink className={styles.HashLinkStyle} to={navItems.contactUs.link}>
                Contacteaza-ne
              </NavHashLink>
            </div>
          </div>
        </div>

        {/* Tablet & Mobile */}
        <div className={`${styles.navbarTabletMobile} ${openNav ? styles.open : ""}`}>
          {!openNav && (
            <div className={styles.tabletNavbarParent}>
              <div className={styles.tabletLogo}>
                <HashLink className={styles.logoHover} to="/" aria-label="Home">
                  <img alt="logo" className={styles.DinMunteLogo} src={images.updatedLogo} />
                </HashLink>
              </div>

              <div className={styles.tabletIconsParent}>
                <NavHashLink className={styles.searchIconTabletParent} to={cart.link} aria-label="Search">
                  <FiSearch size={30} style={{ color: "#3A5A40" }} />
                </NavHashLink>

                <a href="tel:+40752328965" className={styles.phoneIconWrapper}>
                  <FiPhoneCall size={30} style={{ color: "#3A5A40" }} />
                  <span className={styles.phoneBadge}>1</span>
                </a>

                <a href="tel:+40759791474" className={styles.phoneIconWrapper}>
                  <FiPhoneCall size={30} style={{ color: "#3A5A40" }} />
                  <span className={styles.phoneBadge}>2</span>
                </a>

                <NavHashLink className={styles.bagIconTabletParent} to={cart.link} aria-label="Cart">
                  <BiShoppingBag size={30} style={{ color: "#3A5A40" }} />
                </NavHashLink>

                <button
                  type="button"
                  aria-label="Open menu"
                  aria-expanded={openNav}
                  aria-controls="mobile-menu"
                  className={styles.toggleButton}
                  onClick={toggleHandler}
                >
                  <GiHamburgerMenu size={30} style={{ color: "black" }} />
                </button>
              </div>
            </div>
          )}

          {openNav && (
            <div id="mobile-menu" className={styles.toggleOpenPagesLinks} role="dialog" aria-modal="true">
              <div className={styles.bagToggleContainer} style={{ paddingTop: "20px" }}>
                <NavHashLink className={styles.bagIconTabletParent} to={cart.link} aria-label="Cart">
                  <AiOutlineShopping size={25} style={{ color: "white" }} />
                </NavHashLink>

                <button
                  type="button"
                  className={styles.toggleCloseIconContainer}
                  onClick={toggleHandler}
                  aria-label="Close menu"
                >
                  <IoMdClose size={40} className={styles.closeIcon} />
                </button>
              </div>

              <div className={styles.openTogglePagesHeroMobile}>
                <div className={styles.tabletPagesContainer}>
                  <HashLink to="/" className={styles.headerPagesTablet} style={{ display: "flex", alignItems: "center" }} onClick={toggleHandler}>
                    <HiOutlineHome className={styles.homePageIcon} style={{ paddingRight: "4px", width: "40px" }} />
                    <span>Home</span>
                  </HashLink>

                  <HashLink to="/saredebai" className={styles.headerPagesTablet} style={{ display: "flex", alignItems: "center" }} onClick={toggleHandler}>
                    <HiOutlineHome className={styles.homePageIcon} style={{ paddingRight: "4px", width: "40px", visibility: "hidden" }} />
                    <span>Sare</span>
                  </HashLink>

                  <HashLink
                    to="/produsele-noastre"
                    className={styles.headerPagesTablet}
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={() => {
                      toggleHandler();
                      sendAnalyticsIdea();
                    }}
                  >
                    <HiOutlineHome className={styles.homePageIcon} style={{ paddingRight: "4px", width: "40px", visibility: "hidden" }} />
                    <span>Siropuri</span>
                  </HashLink>

                  <HashLink to="/sapunuri" className={styles.headerPagesTablet} style={{ display: "flex", alignItems: "center" }} onClick={toggleHandler}>
                    <HiOutlineHome className={styles.homePageIcon} style={{ paddingRight: "4px", width: "40px", visibility: "hidden" }} />
                    <span>Sapunuri</span>
                  </HashLink>

                  <HashLink to="/bombe" className={styles.headerPagesTablet} style={{ display: "flex", alignItems: "center" }} onClick={toggleHandler}>
                    <HiOutlineHome className={styles.homePageIcon} style={{ paddingRight: "4px", width: "40px", visibility: "hidden" }} />
                    <span>Bombe</span>
                  </HashLink>
                </div>

                <div className={styles.heroSectionInOpenedToggleMobile}>
                  <img src={images.DinMunteLogo} alt="Brand" style={{ width: "117px", paddingBottom: "10px", paddingLeft: "10px" }} />
                  <HelloAllNew />
                </div>
              </div>

              <div className={styles.despre_contact_TabletContainer}>
                <HashLink to="/desprenoi" className={styles.headerPagesTablet} onClick={toggleHandler}>
                  Despre Noi
                </HashLink>
                <HashLink to={navItems.contactUs.link} className={styles.headerPagesTablet} onClick={toggleHandler}>
                  Contacteaza-ne
                </HashLink>
              </div>

              <div className={styles.tabletIconsContainer} aria-label="Social links">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <FaFacebookF size={40} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                  <AiOutlineTwitter size={40} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <AiOutlineInstagram size={40} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarNew;
