
import React from 'react'
import styles from "./footer.module.css";
import { useEffect, useState } from "react";


const Footer = () => {
  return (
    <div>
      <nav className={styles.footer}>
        <div className={styles.logo}>
          GET THE CODE <a href="https://github.com/areeburrub/detain-or-not" target='__blank'>@areeburrub</a>
        </div>
      </nav>
    </div>
  );
}

export default Footer