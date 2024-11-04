// components/ScrollToTopButton.js
import { useEffect, useState } from "react";

import styles from "./ScrollToTopButton.module.css"

function ScrollToTopButton () {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop} className={styles.taptotopbtn}
        >
          <div className={styles.line}></div>Tap to Top
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
