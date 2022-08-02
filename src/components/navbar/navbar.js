
import React from 'react'
import styles from "./navbar.module.css";
import { useEffect, useState } from "react";


const Navbar = () => {
  return (
    <div>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          DETAINED || !
        </div>
      </nav>
    </div>
  )
}

export default Navbar