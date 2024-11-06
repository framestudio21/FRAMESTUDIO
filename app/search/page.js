//app/search/[id]/page.js

"use client"

import DOMPurify from "dompurify";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import Navbar from "@/components/Navbar";
import PageLayout from "@/components/PageLayout";
import PreLoader from "@/components/Preloader";

import styles from "@/styles/CategoryId.module.css";
import Link from "next/link";

export default function ProductCategory() {

  const [isLoading, setIsLoading] = useState(true);
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || ""; // Get search query from URL

  const pathname = usePathname();
  const router = useRouter();

// Fetch product data based on the category
const fetchFiles = async (type, setState) => {
  setLoading(true);
  try {
    const response = await fetch(`/api/getFiles?type=product`);
    const data = await response.json();
    if (response.ok) {
      setState(data); 
    } else {
      console.error("Error fetching data:", data.error);
    }
  } catch (error) {
    console.error("Error fetching files:", error);
  } finally {
    setLoading(false); 
  }
};

useEffect(() => {
  fetchFiles("product", setProductImages); 
}, []);

// Filter products that match the category from the URL
const filteredProducts = productImages.filter((product) => {
  const searchLower = searchQuery.toLowerCase();
  return (
    product.title.toLowerCase().includes(searchLower) ||
    product.clientdetails.toLowerCase().includes(searchLower) ||
    product.details.toLowerCase().includes(searchLower) ||
    product.description.toLowerCase().includes(searchLower)
  );
});

  // Utility function to highlight the searched text
  const highlightText = (text, query) => {
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className={styles.highlight}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const highlightHtml = (htmlString, query) => {
    const sanitizedHtml = DOMPurify.sanitize(htmlString); // Sanitize the HTML
    const regex = new RegExp(`(${query})`, "gi");
  
    const highlightedString = sanitizedHtml.replace(regex, (match) => {
      return `<span class="${styles.highlight}">${match}</span>`;
    });
  
    return highlightedString;
  };

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
                  <Link href={`/product/${product.type}+${product._id}+${product.uniqueID}+${encodeURIComponent(product.title)}`} className={styles.title}>
                  {highlightText(product.title, searchQuery)}
                  </Link>
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
                    Client: {highlightText(product.clientdetails, searchQuery)}
                  </div>
                  <div className={styles.description}>
                  {highlightText(product.description, searchQuery)}
                  </div>
                  <div className={styles.description}>
                  <div className={styles.title}>details: </div><div
    dangerouslySetInnerHTML={{
      __html: highlightHtml(product.details, searchQuery),
    }}
  />
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noproductmessage}>No products found for the selected category.</div>
            )}
          </div>
        </div>
      </PageLayout>
    </>
  );
}
