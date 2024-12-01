import React from "react";
import styles from "../../../../styles/HomePageSectionOne.module.css";
import InterviewModel from "./components/InterviewModel";

function HomePageSectionOne() {
  return (
    <div className={styles.contentContainer}>
      <InterviewModel />
    </div>
  );
}

export default HomePageSectionOne;
