import React, { useState } from "react";
import { HashLink as Link, NavHashLink } from "react-router-hash-link";
import uniqueId from "lodash/uniqueId";
import styles from './MenuMobileSide.module.scss';
import images from '../../data/images';
import strings from '../../data/strings.json';

type MobileNavProps = {
  title: string;
  link?: string;
  ulItems?: {
    [key: string]: {
      title: string;
      link: string;
    };
  };
};

const MenuMobileSide = () => {
  let { navMenuMobile: navItems, cart } = strings;
  const [BurgerOpen, setBurgerOpen] = useState(false);
  const burgerClickHandler = (event: boolean) => {
    setBurgerOpen(!BurgerOpen);
  };
  const closeBackdrop = () => {
    setBurgerOpen(false);
  };
  return (
    <>
      <div className={styles.menuMobileContainer}>
        <div className={styles.burgerElement} onClick={burgerClickHandler.bind(this, !BurgerOpen)}>
          <div className={BurgerOpen ? styles.bar1End : styles.bar1}></div>
          <div className={BurgerOpen ? styles.bar2End : styles.bar2}></div>
          <div className={BurgerOpen ? styles.bar3End : styles.bar3}></div>
        </div>
      </div>
      <div
        onClick={burgerClickHandler.bind(this, !BurgerOpen)}
        className={BurgerOpen ? styles.active : styles.backDropBackground}
      />
      <div className={BurgerOpen ? styles.activeBurger : styles.burgerMenu}>
        <ul className={styles.ulMobile}>
          {Object.values(navItems).map((item: MobileNavProps) => {
            if (!item.hasOwnProperty("ulItems")) {
              return (
                <li key={uniqueId()} className={styles.liMobile}>
                  <NavHashLink onClick={closeBackdrop} className={styles.HashLinkStyle} to={`${item.link}`}>
                    {item.title}
                  </NavHashLink>
                </li>
              );
            } else {
              return (
                <label key={uniqueId()} className={styles.liSubItem}>
                  <input type="checkbox" id="toggle" className={styles.visuallyHidden} />
                  <div className={styles.extendSub}>
                    {item.title}
                    <img alt="picture" className={styles.subItemIcon} src={images.arrowRight} />
                  </div>

                  <ul className={styles.subItemUL}>
                    {typeof item.ulItems !== "undefined" &&
                      Object.values(item.ulItems).map((subItem) => (
                        <NavHashLink
                          className={styles.hashTransparent}
                          key={uniqueId()}
                          onClick={closeBackdrop}
                          replace
                          to={`${subItem.link}`}
                        >
                          <li key={uniqueId()}>{subItem.title}</li>
                        </NavHashLink>
                      ))}
                  </ul>
                </label>
              );
            }
          })}
        </ul>

        <ul className={styles.ulOthers}>
          <li className={styles.individualItem}>
            <NavHashLink className={styles.HashLinkStyleBottom} onClick={closeBackdrop} replace to={cart.link}>
              <img className={styles.icon} src={images.cartLogo} />
              <span>{cart.title}</span>
            </NavHashLink>
          </li>

          {/* <li className={styles.individualItem}>
            <NavHashLink className={styles.HashLinkStyleBottom} onClick={closeBackdrop} replace to={`favorite`}>
              <img className={styles.icon} src={images.heartIcon} />
              <span>{"Favorite"}</span>
            </NavHashLink>
          </li> */}
        </ul>
      </div>
    </>
  );
};

export default MenuMobileSide;
