"use client";

import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";

import styles from "@/styles/Home.module.css";

import Navbar from "@/components/Navbar";
import PreLoader from "@/components/Preloader";
import PageLayout from "@/components/PageLayout";
import { getDirectDriveLink } from "@/utils/getDirectDriveLink";

export default function Home() {
  const [productImages, setProductImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [imageLoaded, setImageLoaded] = useState({});

  const fetchFiles = async (type) => {
    try {
      const response = await fetch(`/api/getFiles?type=${type}`);
      const data = await response.json();
      if (response.ok) {
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
    fetchFiles("product");

    const loadingTimer = setTimeout(() => {
      setIsLoading(false); 
    }, 10000); // 10 seconds

    return () => clearTimeout(loadingTimer); 
  }, []);

  const handleImageLoad = (id) => {
    setImageLoaded((prev) => ({ ...prev, [id]: true }));
  };

  const renderProductDisplay = (images) => (
    <div className={styles.homemainbody}>
      {images.map((item) => (
        <div key={item._id} className={styles.imagecard}>
          {item.file && (
            <Link
              href={`/product/${item.type}+${item._id}+${item.uniqueID}+${encodeURIComponent(item.title)}`}
            >
              <div className={styles.imagebody}>
                {!imageLoaded[item._id] && (
                  <div className={styles.imagePreloader}>Loading ...</div> // Placeholder while the image is loading
                )}
                <Image
                  src={item.src}
                  className={styles.image}
                  alt={item.title}
                  width={200}
                  height={250}
                  priority
                  onLoad={() => handleImageLoad(item._id)}
                  // onLoadingComplete={() => handleImageLoad(item._id)} // Set image as loaded
                />
                <div className={styles.text}>
                  <br />
                  <p>{item.title}</p>
                </div>
              </div>
            </Link>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Head>
        <title>FRAME STUDIO</title>
        <meta
          name="description"
          content="This page invites people to see, buy and contact with us for purpose of the art/design/coding in graphic, website, AI art, digital art, photography"
        />
      </Head>

      <main>
        {isLoading ? (
          <PreLoader /> // Show preloader while loading
        ) : (
          <>
            <Navbar />
            <PageLayout>
              {renderProductDisplay(productImages)} {/* Render the products when loading is done */}
            </PageLayout>
          </>
        )}
      </main>
    </>
  );
}
