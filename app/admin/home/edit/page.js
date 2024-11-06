"use client"

//admin/home/edit-index.js
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Layout from "@/components/PageLayout";
import Logout from "@/components/Logout";

import styles from "@/styles/AdminEdit.module.css";

export default function Edit() {
  const router = useRouter();

  const [selectedWindow, setSelectedWindow] = useState("none");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
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

  const handleEditClick = (item) => {
    // Construct the edit URL using uniqueID and type
    const editUrl = `/admin/home/edit/update/${item.type}+${item._id}+${item.uniqueID}+${encodeURIComponent(item.title)}`;
    router.push(editUrl);
};

  

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    const type = selectedWindow; // Get the type of the item to delete
    try {
      const response = await fetch('/api/deleteFile', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, uniqueID: itemToDelete }),
      });
  
      if (response.ok) {
        // If deletion is successful, update the state
        if (selectedWindow === "product") {
          setProductImages((prevImages) =>
            prevImages.filter((item) => item.uniqueID !== itemToDelete)
          );
        } else if (selectedWindow === "digitalart") {
          setDigitalArtImages((prevImages) =>
            prevImages.filter((item) => item.uniqueID !== itemToDelete)
          );
        } else if (selectedWindow === "photography") {
          setPhotographyImages((prevImages) =>
            prevImages.filter((item) => item.uniqueID !== itemToDelete)
          );
        }
  
        alert("Item has been deleted successfully."); // Confirmation message
      } else {
        // Check if response has content
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          alert(`Error: ${data.error}`); // Display error message
        } else {
          console.error("Unexpected response:", response);
          alert("Error: Unable to delete item. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error: An unexpected error occurred.");
    }
  
    setIsModalOpen(false);
    setItemToDelete(null);
  };
  

  const cancelDelete = () => {
    setIsModalOpen(false);
    setItemToDelete(null);
  };

  const getDirectDriveLink = (fileLink) => {
    const match = fileLink.match(/\/d\/(.*?)\//);
    return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : fileLink;
  };

  const renderImages = (images, title) => {
    const filteredImages = images.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.uniqueID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item._id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className={styles.productdisplaymaindiv}>
        <div className={styles.productdisplaybodytitle}>{title}</div>
        <div className={styles.productdisplaymaindiv}>
        {filteredImages.length === 0 ? (
          <div className={styles.noDataMessage}>No data found.</div> // Add this line
        ) : (
          filteredImages.map((item) => (
            <div key={item.uniqueID} className={styles.imagecard}>
              {item.file && (
                <Link className={styles.imagelink} href={`/${item.type}/${item._id}-${item.title}-${item.uniqueID}`}>
                    <Image
                      src={getDirectDriveLink(item.file)}
                      className={styles.image}
                      alt={item.title}
                      width={400}
                      height={450}
                      priority
                      quality={60}
                    />
                </Link>
              )}
              <div className={styles.textbody}>
                <div className={styles.title}>{item.title}</div>
                <div className={styles.uniqueId}>uniqueId : {item.uniqueID}</div>
                <div className={styles.description}>{item.description}</div>
                <div className={styles.btnsection}>
                  <button
                    type="submit"
                    className={styles.editbtn}
                    onClick={() => handleEditClick(item)}
                  >
                    edit
                  </button>
                  <button
                    type="submit"
                    className={styles.deletebtn}
                    onClick={() => handleDeleteClick(item.uniqueID)}
                  >
                    delete
                  </button>
                </div>
              </div>
            </div>
          )))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <Layout>

          <Logout />


          <div className={styles.titleandsearchbar}>
            <input
              type="text"
              placeholder="search by title or uniqueID"
              className={styles.searchbar}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              name="window"
              id="window"
              className={styles.selectwindow}
              onChange={(e) => setSelectedWindow(e.target.value)}
            >
              <option value="none">Select the edit section</option>
              <option value="product">Product</option>
              <option value="digitalart">Digital Art</option>
              <option value="photography">Photography</option>
            </select>
          </div>
          
        <div className={styles.editmainpagebody}>

          {selectedWindow === "product" && renderImages(productImages, "Product")}
          {selectedWindow === "digitalart" && renderImages(digitalArtImages, "Digital Art")}
          {selectedWindow === "photography" && renderImages(photographyImages, "Photography")}

          {isModalOpen && (
            <div className={styles.editpageconfirmmodal}>
              <div className={styles.modalContent}>
                <div className={styles.titlesection}>
                  <div className={styles.title}>
                    Are you sure you want to delete this item?
                  </div>
                  <p className={styles.subtitle}>This action cannot be undone.</p>
                  <div className={styles.itemDetails}>
                    <p><strong className={styles.pstrong}>object ID : </strong> {itemToDelete._id}</p>
                    <p><strong className={styles.pstrong}>Unique ID : </strong> {itemToDelete.uniqueID}</p>
                    <p><strong className={styles.pstrong}>Type : </strong> {itemToDelete.type}</p>
                    <p><strong className={styles.pstrong}>Title : </strong> {itemToDelete.title}</p>
                  </div>
                </div>
                <div className={styles.btnsection}>
                  <button className={styles.confirmbtn} onClick={confirmDelete}>
                    Confirm
                  </button>
                  <button className={styles.cancelbtn} onClick={cancelDelete}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </Layout>
    </>
  );
}
