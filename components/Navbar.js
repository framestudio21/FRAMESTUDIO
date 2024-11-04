
"use client"

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

import styles from "./Navbar.module.css";

import NavBarMainLogo from "../image/spacelogowhite.svg"

// Remove dynamic export for the Navbar component, move it after the function declaration
export default function Navbar ({ onToggle }) {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle function for sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    onToggle(!isOpen); // Notify the parent component (Layout)
  };

  // Auto year update
  const year = new Date().getFullYear();

  return (
    <div>
      <nav className={styles.mainnavbody}>
        <div className={styles.sidenav}>
          <button className={styles.sidenavbtn} onClick={toggleSidebar}>
          <i className={`material-icons ${styles.icon}`} alt="menu" >menu</i>
          </button>
          <Link href="/">
            <Image
              src={NavBarMainLogo}
              className={styles.mainlogo}
              alt="Logo"
              width={120} // Correct width
              height={40} // Correct height
              optimized="true"
              id="mainlogo"
            />
          </Link>
        </div>

        {/* Full display navbar */}
        {isOpen && (
          <div className={styles.navbar}>
            <div className={styles.middlesection}>
              <Link href="/" className={styles.navlist}>
                <li>Home</li>
              </Link>
              <Link href="/digitalart" className={styles.navlist}>
                <li>Digital Art</li>
              </Link>
              <Link href="/photography" className={styles.navlist}>
                <li>Photography</li>
              </Link>
              <Link href="/about" className={styles.navlist}>
                <li>About</li>
              </Link>
              <Link href="/contact" className={styles.navlist}>
                <li>Contact</li>
              </Link>
            </div>

            <div className={styles.bottomsection}>
              Powered by Frame Studio
              <br />
              @ All rights reserved by Frame Studio. {year}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

// Dynamically export the Navbar (no SSR)
// export default dynamic(() => Promise.resolve(Navbar), { ssr: false });