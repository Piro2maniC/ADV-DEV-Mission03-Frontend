import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import styles from "../../styles/LayoutHomePage.module.css";

function LayoutHome() {
  return (
    <>
      <div className={styles.layoutHomeGrid}>
        <div className={styles.header}>
          <Header />
        </div>
        <div className={styles.content}>
          <Outlet />
        </div>
        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default LayoutHome;
