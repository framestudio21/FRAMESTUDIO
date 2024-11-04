// //photography.js

"use client";

import { useState, useEffect } from "react";

import Navbar from "@/components/Navbar";
import Layout from "@/components/PageLayout";
import Gallery from "@/components/Gallery";

import styles from "@/styles/Home.module.css";

export default function Photography() {
  const [productImages, setProductImages] = useState([]);

  const fetchFiles = async (type, setState) => {
    try {
      const response = await fetch(`/api/getFiles?type=${type}`);
      const data = await response.json();
      if (response.ok) {
        setState(data);
      } else {
        console.error("Error fetching data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const getDirectDriveLink = (fileLink) => {
    const match = fileLink.match(/\/d\/(.*?)\//);
    return match
      ? `https://drive.google.com/uc?export=view&id=${match[1]}`
      : fileLink;
  };

  useEffect(() => {
    fetchFiles("photography", (data) =>
      setProductImages(
        data.map((item) => ({
          ...item,
          src: getDirectDriveLink(item.file),
        }))
      )
    );
  }, []);

  return (
    <>
      <Navbar />
      <Layout>
        <div className={styles.photographymainbody}>
          <Gallery images={productImages} />
        </div>
      </Layout>
    </>
  );
}
