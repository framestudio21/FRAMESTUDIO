"use client";

import { useState, useEffect } from "react";

import Navbar from "@/components/Navbar";
import Layout from "@/components/PageLayout";
import Gallery from "@/components/Gallery";
import { getDirectDriveLink } from "@/utils/getDirectDriveLink";

import styles from "@/styles/Home.module.css";

export default function Photography() {
  const [productImages, setProductImages] = useState([]);

  // Function to fetch photography files and update state
  const fetchFiles = async (type) => {
    try {
      const response = await fetch(`/api/getFiles?type=${type}`);
      const data = await response.json();

      if (response.ok) {
        // Map the data to create image URLs using getDirectDriveLink
        setProductImages(
          data.map((item) => ({
            ...item,
            src: getDirectDriveLink(item.file), // Generate the direct link for the image
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
    // Fetch photography files on component mount
    fetchFiles("photography");
  }, []);

  return (
    <>
      <Navbar />
      <Layout>
        <div className={styles.photographymainbody}>
          {/* Pass the fetched images to the Gallery component */}
          <Gallery images={productImages} />
        </div>
      </Layout>
    </>
  );
}
