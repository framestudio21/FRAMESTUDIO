"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic"; // Import dynamic

// Dynamically import React-Quill without SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

import Navbar from "@/components/Navbar";
import Layout from "@/components/PageLayout";
import styles from "@/styles/Upload.module.css";

export default function Test() {
  const editorRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [type, setType] = useState("none");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [uploadInProgress, setUploadInProgress] = useState(false); // To track ongoing upload


    // Effect to hide upload status after 10 seconds
    useEffect(() => {
      let timer;
      if (uploadStatus && showSuccessPopup) {
        timer = setTimeout(() => {
          setUploadStatus("");
          setShowSuccessPopup(false);
        }, 20000); // 20 seconds
      }
      return () => clearTimeout(timer); // Cleanup on component unmount
    }, [uploadStatus, showSuccessPopup]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || title === "" || type === "none" || details === "") {
      setUploadStatus("Please provide all details, including file, title, and content.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("title", title);
    formData.append("details", details);

    setUploadStatus("Uploading...");
    setShowUploadPopup(true);
    setUploadInProgress(true); // Set the flag to indicate upload is in progress

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload", true);

      // Track the progress of the upload
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      };

      xhr.onload = function () {
        setShowUploadPopup(false);
        setUploadInProgress(false);

        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          if (result.success) {
            setUploadStatus(`File uploaded successfully: ${result.viewLink}`);
            setShowSuccessPopup(true);

            // Clear form data
            setFile(null);
            setType("none");
            setTitle("");
            setDetails("");
            editorRef.current.getEditor().setContents([]);
          } else {
            setUploadStatus("File upload failed: " + (result.error || "Unknown error"));
          }
        } else {
          setUploadStatus("File upload failed");
        }
      };

      xhr.onerror = function () {
        setShowUploadPopup(false);
        setUploadInProgress(false);
        setUploadStatus("File upload failed");
      };

      xhr.send(formData);
    } catch (error) {
      console.error("Error during file upload:", error);
      setUploadStatus("File upload failed");
      setShowUploadPopup(false);
      setUploadInProgress(false);
    }
  };
  


  return (
    <>
      <Navbar />
      <Layout>
        <div className={styles.uploadmainbody}>
          {/* Uploading Popup */}
          {showUploadPopup && (
            <div className={styles.popupwindow}>
              <div className={styles.uploadWindow}>
                <div className={styles.header}>
                <p className={styles.headertext}>Uploading....</p>
                <i className={`material-icons ${styles.icon}`} alt="close" onClick={() => setShowSuccessPopup(false)}>
                  close
                </i>
              </div>
                <div className={styles.subtext}>
                  Just give us a moment to process your file.
                </div>
                <div className={styles.progresslinediv}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${progress}%`, background: 'gold' }}
                ></div>
                <p>{progress}%</p>
                </div>
                <button onClick={() => setShowSuccessPopup(false)}  className={styles.donebtn}>
                  Cancel
                </button>
              </div>
            </div>
           )}

          {/* Success Popup */}
          {showSuccessPopup &&  (
          <div className={styles.popupwindow}>
            <div className={styles.successWindow}>
              <div className={styles.header}>
                <p className={styles.headertext}>Upload Successful!</p>
                <i className={`material-icons ${styles.icon}`} alt="close" onClick={() => setShowSuccessPopup(false)}>
                  close
                </i>
              </div>
              <div className={styles.subtext}>
                {/* Your file has been uploaded.  */}
                {uploadStatus}
              </div>
              <button className={styles.donebtn} onClick={() => setShowSuccessPopup(false)}>
                Done
              </button>
            </div>
          </div>
         )} 

          {uploadStatus && <div className={styles.uploadstatusdiv}>{uploadStatus}</div>}

          <form className={styles.uploadsectionbody} onSubmit={handleSubmit}>
            {/* Upload section selection */}
            <div className={styles.selectwindowsectiondiv}>
              <div className={styles.selectwindowsectiontitle}>
                Select the upload section
              </div>
              <select
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={styles.selectinputfield}
              >
                <option value="none">Select the upload section</option>
                <option value="product">Product</option>
                <option value="digitalart">Digital Art</option>
                <option value="photography">Photography</option>
              </select>
            </div>

            {/* Title */}
            <div className={styles.blocks}>
              <div className={styles.title}>Title</div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.inputfield}
              />
            </div>

            {/* File upload */}
            <div className={styles.blocks}>
              <div className={styles.title}>Upload File</div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className={styles.fileinputfield}
              />
            </div>

            {/* Jodit Editor */}
            <div className={styles.blocks}>
              <div className={styles.title}>Details</div>
              <ReactQuill
                ref={editorRef}
                theme="snow"
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ size: [] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    [{ align: [] }],
                    ["clean"], // Remove formatting button
                  ],
                }}
                formats={[
                  "header",
                  "font",
                  "size",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "list",
                  "bullet",
                  "link",
                  "image",
                  "align",
                ]}
                placeholder="Enter the product details"
                className={styles.reactquillinputfield}
                value={details}
                onChange={(newContent) => setDetails(newContent)}
              />
            </div>

            {/* Submit button */}
            <div className={styles.blocks}>
              <button type="submit" className={styles.submitbtn}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}
