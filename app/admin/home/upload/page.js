//admin/home/upload.js

"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import React-Quill without SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

import Navbar from "@/components/Navbar";
import Layout from "@/components/PageLayout";
import Logout from "@/components/Logout";

import styles from "@/styles/Upload.module.css";

export default function Upload() {
  const quillRef = useRef(null);

  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        [{ align: [] }],
        ["clean"],
      ],
    },
  };

  const formats = [
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
  ];

  const [formData, setFormData] = useState({
    type: "none",
    title: "",
    description: "",
    details: "",
    file: null,
    category1: "none",
    category2: "none",
    category3: "none",
    clientdetails: "",
  });
  const [selectedSection, setSelectedSection] = useState("none");
  const [uploadStatus, setUploadStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [uploadInProgress, setUploadInProgress] = useState(false);

  const options = [
    { value: "none", label: "Select product category" },
    { value: "logo", label: "Logo Design" },
    {
      value: "Brand design (visual identity design / corporate design)",
      label: "Brand design (visual identity design / corporate design)",
    },
    { value: "illustration design", label: "Illustration Design" },
    { value: "typography design", label: "Typography Design" },
    { value: "advertisement design", label: "Advertisement Design" },
    { value: "marketing design", label: "Marketing Design" },
    { value: "Packaging design", label: "Packaging Design" },
    { value: "Label & sticker design", label: "Label & sticker Design" },
    { value: "Publication graphic design", label: "Publication graphic Design" },
    { value: "Environmental graphic design", label: "Environmental graphic Design" },
    {
      value: "Web design (digital design)",
      label: "Web design (digital design) Design",
    },
    { value: "3D Graphic design", label: "3D Graphic Design" },
    { value: "UI design", label: "UI Design" },
    { value: "Motion graphics design", label: "Motion graphics Design" },
    { value: "Powerpoint design", label: "Powerpoint Design" },
    { value: "layout design", label: "Layout Design" },
    {
      value: "Vehicle wraps and decal design",
      label: "Vehicle wraps and decal Design",
    },
    { value: "other design", label: "Other Design" },
  ];

  const getFilteredOptions = (selectedCategory) => {
    const selectedValues = Object.values(formData);
    return options.filter(
      (option) =>
        option.value === "none" ||
        !selectedValues.includes(option.value) ||
        option.value === selectedCategory
    );
  };

  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    setSelectedSection(value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Effect to hide upload status after 20 seconds
  useEffect(() => {
    let timer;
    if (uploadStatus && showSuccessPopup) {
      timer = setTimeout(() => {
        setUploadStatus("");
        setShowSuccessPopup(false);
      }, 15000);
    }
    return () => clearTimeout(timer);
  }, [uploadStatus, showSuccessPopup]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
      // file: files ? files[0].name : prevData.file.name || "", // Store thumbnail name
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file || formData.title === "" || formData.type === "none") {
      setUploadStatus(
        "Please provide all details, including file, title, and type."
      );
      return;
    }
    const uploadData = new FormData();
    uploadData.append("file", formData.file);
    uploadData.append("type", formData.type);
    uploadData.append("title", formData.title);
    uploadData.append("description", formData.description);
    uploadData.append("category1", formData.category1);
    uploadData.append("category2", formData.category2);
    uploadData.append("category3", formData.category3);
    uploadData.append("details", formData.details);
    uploadData.append("clientdetails", formData.clientdetails);

    // Log all data being sent
    console.log("Data being sent to /api/upload:");
    uploadData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    setUploadStatus("Uploading...");
    setShowUploadPopup(true);
    setUploadInProgress(true);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload", true);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setProgress(percentComplete);
        }
      };
      xhr.onload = function () {
        setShowUploadPopup(false);
        setUploadInProgress(false);
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          if (result.success) {
            // setUploadStatus(`File uploaded successfully: ${result.viewLink}`);
            setUploadStatus(`${result.uniqueID}`);
            // setUploadStatus(`File uploaded successfully.`);
            setShowSuccessPopup(true);
            setFormData({
              type: "none",
              title: "",
              description: "",
              details: "",
              file: null,
              category1: "none",
              category2: "none",
              category3: "none",
              clientdetails: "",
            });
            quillRef.current.getEditor().setContents([]);
          } else {
            setUploadStatus(
              "File upload failed: " + (result.error || "Unknown error")
            );
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
      xhr.send(uploadData);
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
          <Logout />

          {showUploadPopup && (
            <div className={styles.popupwindow}>
              <div className={styles.uploadWindow}>
                <div className={styles.header}>
                  <p className={styles.headertext}>Uploading....</p>
                  <i
                    className={`material-icons ${styles.icon}`}
                    alt="close"
                    onClick={() => setShowSuccessPopup(false)}
                  >
                    close
                  </i>
                </div>
                <div className={styles.subtext}>
                  Just give us a moment to process your file.
                </div>
                <div className={styles.progresslinediv}>
                  {/* <div
                    className={styles.progressBar}
                    style={{ width: `${progress}%`, background: "gold" }}
                  ></div> */}
                  {progress}%
                </div>
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className={styles.donebtn}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {showSuccessPopup && (
            <div className={styles.popupwindow}>
              <div className={styles.successWindow}>
                <div className={styles.header}>
                  <p className={styles.headertext}>Upload Successful!</p>
                  <i
                    className={`material-icons ${styles.icon}`}
                    alt="close"
                    onClick={() => setShowSuccessPopup(false)}
                  >
                    close
                  </i>
                </div>
                <div className={styles.subtext}>
                  File uploaded successfully.
                  <br />
                  {uploadStatus}
                </div>
                <button
                  className={styles.donebtn}
                  onClick={() => setShowSuccessPopup(false)}
                >
                  Done
                </button>
              </div>
            </div>
          )}
          {uploadStatus && (
            <div className={styles.uploadstatusdiv}>{uploadStatus}</div>
          )}
          <form className={styles.uploadsectionbody} onSubmit={handleSubmit}>
            <div className={styles.selectwindowsectiondiv}>
              <div className={styles.selectwindowsectiontitle}>
                Select the upload section
              </div>
              <select
                name="type"
                id="type"
                className={styles.selectinputfield}
                onChange={handleSectionChange}
                value={formData.type}
              >
                <option value="none">Select the upload section</option>
                <option value="product">Product</option>
                <option value="digitalart">Digital Art</option>
                <option value="photography">Photography</option>
              </select>
            </div>
            {selectedSection === "product" && (
              <div className={styles.homeproductwindow}>
                <div className={styles.windowtitle}>Home Product Window</div>
                <div className={styles.blocks}>
                  <div className={styles.title}>Product Title</div>
                  <input
                    type="text"
                    className={styles.inputfield}
                    placeholder="Enter product title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.blocks}>
                  <div className={styles.title}>Product Categories</div>
                  {[1, 2, 3].map((num) => (
                    <select
                      key={`category${num}`}
                      name={`category${num}`}
                      className={styles.inputfield}
                      onChange={handleInputChange}
                      value={formData[`category${num}`]}
                    >
                      {getFilteredOptions(formData[`category${num}`]).map(
                        (option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        )
                      )}
                    </select>
                  ))}
                </div>

                <div className={styles.blocks}>
                  <div className={styles.title}>Upload Product File</div>
                  <input
                    type="file"
                    className={styles.fileinputfield}
                    name="file"
                    accept="image/png, image/jpeg, image/svg+xml"
                    onChange={handleInputChange}
                  />
                  {formData.file && (
                    <div className={styles.thumbnailpreview}>
                      <div className={styles.thumbnailname}>
                        {formData.file.name || "Thumbnail Selected"}
                      </div>
                      <img
                        src={URL.createObjectURL(formData.file)}
                        alt="Thumbnail Preview"
                        className={styles.thumbnailimg}
                        width={500}
                        height={500}
                      />
                    </div>
                  )}
                </div>

                <div className={styles.blocks}>
                  <div className={styles.title}>Product client details</div>
                  <input
                    type="text"
                    className={styles.inputfield}
                    placeholder="Enter client details"
                    name="clientdetails"
                    value={formData.clientdetails}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.blocks}>
                  <div className={styles.title}>Product Description</div>
                  <textarea
                    className={styles.textarea}
                    placeholder="Enter the product description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.blocks}>
                  <div className={styles.title}>Product Details</div>
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    placeholder="Enter the product details"
                    className={styles.reactquillinputfield}
                    value={formData.details}
                    onChange={(content) =>
                      setFormData({ ...formData, details: content })
                    }
                  />
                </div>

                {/* Submit button */}
                <div className={styles.blocks}>
                  <button
                    type="submit"
                    className={styles.submitbtn}
                    disabled={uploadInProgress}
                  >
                    {uploadInProgress ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            )}

            {selectedSection === "digitalart" && (
              <div className={styles.digitalartwindow}>
                <div className={styles.windowtitle}>Digital Art Window</div>
                <div className={styles.blocks}>
                  <div className={styles.title}>Product Title</div>
                  <input
                    type="text"
                    className={styles.inputfield}
                    placeholder="Enter product title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.blocks}>
                  <div className={styles.title}>digital art Category</div>
                  {[1].map((num) => (
                    <select
                      key={`category${num}`}
                      name={`category${num}`}
                      className={styles.inputfield}
                      onChange={handleInputChange}
                      value={formData[`category${num}`]}
                    >
                      {getFilteredOptions(formData[`category${num}`]).map(
                        (option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        )
                      )}
                    </select>
                  ))}
                </div>
                <div className={styles.blocks}>
                  <div className={styles.title}>Upload Product File</div>
                  <input
                    type="file"
                    className={styles.fileinputfield}
                    name="file"
                    accept="image/png, image/jpeg, image/svg+xml"
                    onChange={handleInputChange}
                  />
                  {formData.file && (
                    <div className={styles.thumbnailpreview}>
                      <div className={styles.thumbnailname}>
                        {formData.file.name || "Thumbnail Selected"}
                      </div>
                      <img
                        src={URL.createObjectURL(formData.file)}
                        alt="Thumbnail Preview"
                        className={styles.thumbnailimg}
                        width={500}
                        height={500}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.blocks}>
                  <div className={styles.title}>Product Description</div>
                  <textarea
                    className={styles.textarea}
                    placeholder="Enter the product description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Submit button */}
                <div className={styles.blocks}>
                  <button
                    type="submit"
                    className={styles.submitbtn}
                    disabled={uploadInProgress}
                  >
                    {uploadInProgress ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            )}
            
            {selectedSection === "photography" && (
              <div className={styles.photographywindow}>
                <div className={styles.windowtitle}>Photography Window</div>
                <div className={styles.blocks}>
                  <div className={styles.title}>Product Title</div>
                  <input
                    type="text"
                    className={styles.inputfield}
                    placeholder="Enter product title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.blocks}>
                  <div className={styles.title}>Product client details</div>
                  <input
                    type="text"
                    className={styles.inputfield}
                    placeholder="Enter client details"
                    name="clientdetails"
                    value={formData.clientdetails}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.blocks}>
                  <div className={styles.title}>Upload Product File</div>
                  <input
                    type="file"
                    className={styles.fileinputfield}
                    name="file"
                    accept="image/png, image/jpeg, image/svg+xml"
                    onChange={handleInputChange}
                  />
                  {formData.file && (
                    <div className={styles.thumbnailpreview}>
                      <div className={styles.thumbnailname}>
                        {formData.file.name || "Thumbnail Selected"}
                      </div>
                      <img
                        src={URL.createObjectURL(formData.file)}
                        alt="Thumbnail Preview"
                        className={styles.thumbnailimg}
                        width={500}
                        height={500}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.blocks}>
                  <div className={styles.title}>Product Description</div>
                  <textarea
                    className={styles.textarea}
                    placeholder="Enter the product description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Submit button */}
                <div className={styles.blocks}>
                  <button
                    type="submit"
                    className={styles.submitbtn}
                    disabled={uploadInProgress}
                  >
                    {uploadInProgress ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </Layout>
    </>
  );
}
