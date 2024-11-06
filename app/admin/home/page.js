// admin/home.js

"use client"


import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Layout from "@/components/PageLayout";
import Navbar from "@/components/Navbar";
import Logout from "@/components/Logout";
import styles from "@/styles/AdminHome.module.css";

export default function AdminHome() {
  const router = useRouter();
  const [productImages, setProductImages] = useState([]);
  const [digitalArtImages, setDigitalArtImages] = useState([]);
  const [photographyImages, setPhotographyImages] = useState([]);

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

  useEffect(() => {
    fetchFiles("product", setProductImages);
    fetchFiles("digitalart", setDigitalArtImages);
    fetchFiles("photography", setPhotographyImages);
  }, []);

  const getDirectDriveLink = (fileLink) => {
    const match = fileLink.match(/\/d\/(.*?)\//);
    return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : fileLink;
  };
  

  const renderProductDisplay = (images, title) => (
    <div className={styles.prouctdisplaybody}>
      <div className={styles.productdisplaybodytitle}>{title}</div>
      <div className={styles.productdisplay}>
        {images.map((item) => (
          <div key={item._id} className={styles.imagecard}>
            {item.file && (
                <div className={styles.imagebody}>
                  <Image
                    src={getDirectDriveLink(item.file)} // Convert to direct link
                    className={styles.image}
                    alt={item.title}
                    width={200}
                    height={250}
                    priority
                    quality={60} // Reduce quality to 60% for faster loading
                    // sizes="(max-width: 600px) 100px, (max-width: 1200px) 200px, 400px" // Use responsive sizes
                    // layout="responsive" // Ensure images are loaded only when in view
                  />
                  <div className={styles.text}>
                    <br />
                    <p>{item.title}</p>
                  </div>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <Layout>
          <Logout />
        <div className={styles.adminhomemainpage}>

          {/* Product display sections */}
          {renderProductDisplay(productImages, "Product Display")}
          {renderProductDisplay(digitalArtImages, "Digital Art Product Display")}
          {renderProductDisplay(photographyImages, "Photography Product Display")}
        </div>
      </Layout>
    </>
  );
}
