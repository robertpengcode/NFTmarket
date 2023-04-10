import React from "react";
import styles from "@/styles";
import AlertIcon from "../components/AlertIcon";

const Alert = ({ type, message }) => (
  <div className={`${styles.alertContainer} ${styles.flexCenter}`}>
    <div className={`${styles.alertWrapper} ${styles[type]}`} role="alert">
      <AlertIcon type={type} /> {message}
    </div>
  </div>
);

export default Alert;
