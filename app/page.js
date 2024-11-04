//home.js

"use client";

import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";

import styles from "@/styles/Home.module.css";

import Navbar from "@/components/Navbar";
import PreLoader from "@/components/Preloader";
import PageLayout from "@/components/PageLayout";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    fetchFiles("product", setProductImages);
  }, []);

  const getDirectDriveLink = (fileLink) => {
    const match = fileLink.match(/\/d\/(.*?)\//);
    return match
      ? `https://drive.google.com/uc?export=view&id=${match[1]}`
      : fileLink;
  };

  const renderProductDisplay = (images) => (
    <div className={styles.homemainbody}>
      {images.map((item) => (
        <div key={item._id} className={styles.imagecard}>
          {item.file && (
            <Link href={`/product/${item.type}+${item._id}+${item.uniqueID}+${encodeURIComponent(item.title)}`}>
              <div className={styles.imagebody}>
                <Image
                  src={getDirectDriveLink(item.file)}
                  className={styles.image}
                  alt={item.title}
                  width={200}
                  height={250}
                  priority
                  quality={60}
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
          content="This page invites people to see, buy and contact with us for purpose of the art/desing/codding in graphic, website, ai art, digital art, photography"
        />
      </Head>

      <main>
        {isLoading && <PreLoader />}
        <Navbar />
        <PageLayout>
          {renderProductDisplay(productImages)}
        </PageLayout>
      </main>
    </>
  );
}
