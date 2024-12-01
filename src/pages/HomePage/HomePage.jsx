import React from "react";
import styles from "../../styles/HomePage.module.css";
import HomePageNavbar from "../HomePage/components/HomePageNavbar";
import HomePageSectionOne from "./components/HomePageSectionOne/HomePageSectionOne";

function HomePage() {
  return (
    <div className={styles.homeContentContainer}>
      <HomePageNavbar />
      <HomePageSectionOne />
    </div>
  );
}

export default HomePage;
