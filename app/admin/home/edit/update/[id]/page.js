//admin/home/edit/update.js

"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Image from "next/image";

// Dynamically import React-Quill without SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

import Navbar from "@/components/Navbar";
import Layout from "@/components/PageLayout";
import Logout from "@/components/Logout";
import { getDirectDriveLink } from "@/utils/getDirectDriveLink";

import styles from "@/styles/Upload.module.css";

export default function Upload() {
  const pathname = usePathname();
  const router = useRouter();
  // const { id } = router.query || {};
  // const [mongoID, uniqueID, type] = id ? id.split('+') : [null, null];
  // const [mongoID] = id ? id.split('+') : [null, null];

  const quillRef = useRef(null);

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

  const [selectedSection, setSelectedSection] = useState("none");
  const [uploadStatus, setUploadStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [uploadInProgress, setUploadInProgress] = useState(false);

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

  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    setSelectedSection(value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  useEffect(() => {
    if (!pathname) return;

    const cleanPathname = pathname.replace("/admin/home/edit/update/", "");
    const pathParts = cleanPathname.split("+");
    const [type, mongoID, uniqueID, title] = pathParts;

    if (mongoID && uniqueID && type) {
      fetch(`/api/getFiles?type=${type}&id=${mongoID}&uniqueID=${uniqueID}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error("Error fetching data:", data.error);
          } else {
            setFormData({
              type: data.type || "none",
              title: data.title || "",
              description: data.description || "",
              details: data.details || "",
              file: data.file || "", // Handle file separately for uploads
              category1: data.category1 || "none",
              category2: data.category2 || "none",
              category3: data.category3 || "none",
              clientdetails: data.clientdetails || "",
            });
          }
        })
        .catch((error) => console.error("Fetch error:", error));
    }
  }, [pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title === "" || formData.type === "none") {
      setUploadStatus(
        "Please provide all details, including file, title, and type."
      );
      return;
    }

    if (!pathname) return;

    const cleanPathname = pathname.replace("/admin/home/edit/update/", "");
    const pathParts = cleanPathname.split("+");
    const [type, mongoID, uniqueID, title] = pathParts;

    const isUpdate = !!mongoID && !!uniqueID;

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
    uploadData.append("isUpdate", isUpdate);

    console.log("Data being sent to /api/upload:");

    if (isUpdate) {
      uploadData.append("_id", mongoID);
      uploadData.append("uniqueID", uniqueID);
    }

        // Only append file if a new file is selected
  if (formData.file && typeof formData.file === "object") {
    uploadData.append("file", formData.file);
  }

    // uploadData.forEach((value, key) => {
    //   console.log(`${key}:`, value);
    // });

    setUploadStatus("Uploading...");
    setShowUploadPopup(true);
    setUploadInProgress(true);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload", true);
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
            setUploadStatus(`Success! UniqueID: ${result.uniqueID}`);
            setShowSuccessPopup(true);
            resetForm();
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
  
      xhr.send(uploadData);
    } catch (error) {
      console.error("Error during file upload:", error);
      setUploadStatus("File upload failed");
      setShowUploadPopup(false);
      setUploadInProgress(false);
    }
  };

  // Helper function to reset form after successful upload
  const resetForm = () => {
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
    quillRef.current.getEditor().setContents([]); // Clear ReactQuill editor
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
                <div className={styles.progresslinediv}>{progress}%</div>
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
                  {/* Display the old file link from Google Drive if no new file is selected */}
                  {formData.file && typeof formData.file === "string" && (
                    <div className={styles.thumbnailpreview}>
                      <div className={styles.thumbnailname}>
                        {formData.file.split("/").pop() ||
                          "Thumbnail Available"}{" "}
                        {/* Show file name */}
                      </div>
                      <Image
                        src={getDirectDriveLink(formData.file)}
                        alt="Thumbnail Preview"
                        className={styles.thumbnailimg}
                        width={500}
                        height={500}
                      />
                    </div>
                  )}
                  {/* Display the new file preview if a new file is selected */}
                  {formData.file && typeof formData.file === "object" && (
                    <div className={styles.thumbnailpreview}>
                      <div className={styles.thumbnailname}>
                        {formData.file.name || "Thumbnail Selected"}
                      </div>
                      <Image
                        src={URL.createObjectURL(formData.file)}
                        alt="Thumbnail Preview"
                        className={styles.thumbnailimg}
                        width={500}
                        height={500}
                        onLoad={() => URL.revokeObjectURL(formData.file)} // Free memory
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
                  {/* Display the old file link from Google Drive if no new file is selected */}
                  {formData.file && typeof formData.file === "string" && (
                    <div className={styles.thumbnailpreview}>
                      <div className={styles.thumbnailname}>
                        {formData.file.split("/").pop() ||
                          "Thumbnail Available"}{" "}
                        {/* Show file name */}
                      </div>
                      <Image
                        src={getDirectDriveLink(formData.file)}
                        alt="Thumbnail Preview"
                        className={styles.thumbnailimg}
                        width={500}
                        height={500}
                      />
                    </div>
                  )}
                  {/* Display the new file preview if a new file is selected */}
                  {formData.file && typeof formData.file === "object" && (
                    <div className={styles.thumbnailpreview}>
                      <div className={styles.thumbnailname}>
                        {formData.file.name || "Thumbnail Selected"}
                      </div>
                      <Image
                        src={URL.createObjectURL(formData.file)}
                        alt="Thumbnail Preview"
                        className={styles.thumbnailimg}
                        width={500}
                        height={500}
                        onLoad={() => URL.revokeObjectURL(formData.file)} // Free memory
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
                  {/* Display the old file link from Google Drive if no new file is selected */}
                  {formData.file && typeof formData.file === "string" && (
                    <div className={styles.thumbnailpreview}>
                      <div className={styles.thumbnailname}>
                        {formData.file.split("/").pop() ||
                          "Thumbnail Available"}{" "}
                        {/* Show file name */}
                      </div>
                      <Image
                        src={getDirectDriveLink(formData.file)}
                        alt="Thumbnail Preview"
                        className={styles.thumbnailimg}
                        width={500}
                        height={500}
                      />
                    </div>
                  )}
                  {/* Display the new file preview if a new file is selected */}
                  {formData.file && typeof formData.file === "object" && (
                    <div className={styles.thumbnailpreview}>
                      <div className={styles.thumbnailname}>
                        {formData.file.name || "Thumbnail Selected"}
                      </div>
                      <Image
                        src={URL.createObjectURL(formData.file)}
                        alt="Thumbnail Preview"
                        className={styles.thumbnailimg}
                        width={500}
                        height={500}
                        onLoad={() => URL.revokeObjectURL(formData.file)} // Free memory
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
