import React from "react";
import styles from "../../styles/HomePageHeader.module.css";
import Logo from "../../assets/NavBar/logo.png";

function Header() {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <img src={Logo} className={styles.logo} alt="Turners Cars" />
      </div>
      <div className={styles.buttonContainer}>
        <div className={styles.navbarButton}>LOGIN</div>
        <div>or</div>
        <div className={styles.navbarButton}>REGISTER</div>
      </div>
    </div>
  );
}

export default Header;
