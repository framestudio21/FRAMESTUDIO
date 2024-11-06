"use client";

import { useState, useEffect } from "react";

import Navbar from "@/components/Navbar";
import Layout from "@/components/PageLayout";
import Gallery from "@/components/Gallery";
import { getDirectDriveLink } from "@/utils/getDirectDriveLink";

import styles from "@/styles/Home.module.css";

export default function Digitalart() {
  const [productImages, setProductImages] = useState([]);

  // Fetch files from API and format them for the gallery
  const fetchFiles = async (type) => {
    try {
      const response = await fetch(`/api/getFiles?type=${type}`);
      const data = await response.json();

      if (response.ok) {
        // Map the data to prepare for gallery display, setting the src for each image
        setProductImages(
          data.map((item) => ({
            ...item,
            src: getDirectDriveLink(item.file),
          }))
        );
      } else {
        console.error("Error fetching data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    // Fetch digital art files when the component mounts
    fetchFiles("digitalart");
  }, []);

  return (
    <>
      <Navbar />
      <Layout>
        <div className={styles.digitalartmainbody}>
          {/* Pass the fetched images to the Gallery component */}
          <Gallery images={productImages} />
        </div>
      </Layout>
    </>
  );
}
