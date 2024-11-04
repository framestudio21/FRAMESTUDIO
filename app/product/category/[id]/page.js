//product/category/[id].js

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import PageLayout from "@/components/PageLayout";
import PreLoader from "@/components/Preloader";

import styles from "@/styles/CategoryId.module.css";
import Link from "next/link";

export default function ProductCategory() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const pathname = usePathname();
  const router = useRouter();

// Extract the category from the URL by removing '/product/category/'
const cleanPathname = pathname.replace("/product/category/", "");
const categoryFromUrl = decodeURIComponent(cleanPathname); // Decodes URL encoded string like "logo%20design" to "logo design"

const [productImages, setProductImages] = useState([]);
const [loading, setLoading] = useState(true); // Loading state

// Fetch product data based on the category
const fetchFiles = async (type, setState) => {
  setLoading(true); // Set loading to true when fetch starts
  try {
    const response = await fetch(`/api/getFiles?type=${type}`);
    const data = await response.json();
    if (response.ok) {
      setState(data); // Set the fetched product data
    } else {
      console.error("Error fetching data:", data.error);
    }
  } catch (error) {
    console.error("Error fetching files:", error);
  } finally {
    setLoading(false); // Set loading to false once fetch is done
  }
};

useEffect(() => {
  fetchFiles("product", setProductImages); // Fetch product files on component load
}, []);

// Filter products that match the category from the URL
const filteredProducts = productImages.filter((product) =>
  [product.category1, product.category2, product.category3].includes(categoryFromUrl)
);

// Loading state: show a spinner or message until data is fetched and filtered
if (loading) {
  return (
    <>
    { isLoading && <PreLoader/>}
    </>
  );
}


  return (
    <>
      <Navbar />
      <PageLayout>
        <div className={styles.productcateogryidpagemainbody}>
          <div className={styles.cardcontainermainbody}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div key={index} className={styles.cardcontainer}>
                  <Link href={`/product/${product.type}+${product._id}+${product.uniqueID}+${encodeURIComponent(product.title)}`} className={styles.title}>{product.title}</Link>
                  <div className={styles.ownerdatedetails}>
                    <Link href="/about" className={styles.name}>
                      by sumit kumar duary
                    </Link>
                    <div className={styles.text}>:</div>
                    <div className={styles.date}>
                      {new Date(product.uploadedAt).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short", // Mon, Tue, etc.
                          day: "numeric", // 15
                          month: "2-digit", // 10
                          year: "numeric", // 2024
                        }
                      )}{" "}
                      {new Date(product.uploadedAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                    <div className={styles.text}>:</div>
                    <Link href="/" className={styles.type}>
                      in {product.type}
                    </Link>
                    <div className={styles.text}>:</div>
                    <div className={styles.categorydiv}>
                      {product.category1 && (
                        <Link href={`/product/category/${product.category1}`} className={styles.category}>
                          {product.category1},
                        </Link>
                      )}
                      {product.category2 && (
                        <Link href={`/product/category/${product.category2}`} className={styles.category}>
                          {product.category2},
                        </Link>
                      )}
                      {product.category3 && (
                        <Link href={`/product/category/${product.category3}`} className={styles.category}>
                          {product.category3}
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className={styles.clientdiv}>
                    Client: {product.clientdetails}
                  </div>
                  <div className={styles.description}>
                    {product.description}
                  </div>
                </div>
              ))
            ) : (
              <div>No products found for the selected category.</div>
            )}
          </div>
        </div>
      </PageLayout>
    </>
  );
}
