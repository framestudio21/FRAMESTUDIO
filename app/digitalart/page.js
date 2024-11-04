// //digitalart.js

// "use client";

// import Image from "next/image";
// import { useState, useEffect } from "react";

// import styles from "@/styles/Home.module.css";

// import Navbar from "@/components/Navbar";
// import Layout from "@/components/PageLayout";
// import Gallery from "@/components/Gallery";

// export default function Digitalart() {

//   const [productImages, setProductImages] = useState([]);

//   const fetchFiles = async (type, setState) => {
//     try {
//       const response = await fetch(`/api/getFiles?type=${type}`);
//       const data = await response.json();
//       if (response.ok) {
//         setState(data);
//       } else {
//         console.error("Error fetching data:", data.error);
//       }
//     } catch (error) {
//       console.error("Error fetching files:", error);
//     }
//   };

//   useEffect(() => {
//     fetchFiles("digitalart", setProductImages);
//   }, []);

//   const getDirectDriveLink = (fileLink) => {
//     const match = fileLink.match(/\/d\/(.*?)\//);
//     return match
//       ? `https://drive.google.com/uc?export=view&id=${match[1]}`
//       : fileLink;
//   };

//     const [IMAGES, setIMAGES] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(null);
//   const [copySuccess, setCopySuccess] = useState("");
//   const [scale, setScale] = useState(1);



//   // Close image viewer
//   const close = (e) => {
//     e.stopPropagation();
//     setCurrentIndex(null);
//     setCopySuccess("");
//   };

//   // Copy image reference to clipboard
//   const copyToClipboard = (e) => {
//     e.stopPropagation();
//     const image = IMAGES[currentIndex];
//     const urlToCopy = `${window.location.origin}/digitalart/query?s=${
//       image.id
//     }&title=${encodeURIComponent(image.title)}`;
//     navigator.clipboard
//       .writeText(urlToCopy)
//       .then(() => {
//         setCopySuccess("Image link copied to clipboard!");
//         setTimeout(() => {
//           setCopySuccess("");
//         }, 5000);
//       })
//       .catch(() => {
//         setCopySuccess("Failed to copy!");
//       });
//   };

//   // View the clicked image in full size
//   const viewImage = (index) => {
//     setCurrentIndex(index);
//     setScale(1);
//   };

//   // View the previous image
//   const previousImage = (e) => {
//     e.stopPropagation();
//     if (currentIndex !== null) {
//       const newIndex =
//         currentIndex === 0 ? IMAGES.length - 1 : currentIndex - 1;
//       setCurrentIndex(newIndex);
//     }
//   };

//   // View the next image
//   const nextImage = (e) => {
//     e.stopPropagation();
//     if (currentIndex !== null) {
//       const newIndex =
//         currentIndex === IMAGES.length - 1 ? 0 : currentIndex + 1;
//       setCurrentIndex(newIndex);
//     }
//   };

//   // Handle image zoom on scroll
//   const handleScroll = (e) => {
//     e.preventDefault();
//     setScale((prevScale) =>
//       Math.max(1, Math.min(prevScale + (e.deltaY < 0 ? 0.1 : -0.1), 5))
//     );
//   };

//   const renderProductDisplay = (images) => (
//     <Gallery
//       images={images.map((item, index) => ({
//         src: getDirectDriveLink(item.file), // Ensure valid src
//         width: item.width || 300, // Set default width, 300 is more reasonable than 10
//         height: item.height || 300, // Set default height, 300 is more reasonable than 10
//         title: item.title || "Untitled", // Provide fallback title
//         onClick: () => viewImage(index), // Call viewImage with the image index
//       }))}
//     />
//   );

//   return (
//     <>
//         <Navbar />
//       <Layout>
//         <div className={styles.digitalartmainbody}>
//           {currentIndex !== null && IMAGES[currentIndex] && (
//             <div
//               className={styles.imagedisplaydiv}
//               onClick={close}
//               onWheel={handleScroll}
//             >
//               <div className={styles.leftside} onClick={previousImage}>
//                 <button className={styles.btn} onClick={previousImage}>
//                   <i
//                     className={`material-icons ${styles.icon}`}
//                     alt="arrow_back_ios"
//                   >
//                     arrow_back_ios
//                   </i>
//                 </button>
//               </div>

//               <div
//                 className={styles.imageContainer}
//                 style={{
//                   transform: `scale(${scale})`,
//                   transformOrigin: "center",
//                   transition: "transform 0.2s ease",
//                   zIndex: 1,
//                 }}
//               >
//                 <Image
//                   src={IMAGES[currentIndex].src}
//                   className={styles.image}
//                   priority
//                   width={IMAGES[currentIndex]?.width || 600}
//                   height={IMAGES[currentIndex]?.height || 300}
//                   alt={IMAGES[currentIndex].title}
//                   style={{
//                     maxHeight: "700px",
//                     width: "auto",
//                   }}
//                 />
//               </div>

//               <div
//                 className={styles.imagereferencelink}
//                 onClick={copyToClipboard}
//               >
//                 click to copy reference
//               </div>

//               {copySuccess && (
//                 <p className={styles.copySuccess}>{copySuccess}</p>
//               )}

//               <div className={styles.rightside} onClick={nextImage}>
//                 <button className={styles.btn} onClick={nextImage}>
//                   <i
//                     className={`material-icons ${styles.icon}`}
//                     alt="arrow_forward_ios"
//                   >
//                     arrow_forward_ios
//                   </i>
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//           {renderProductDisplay(productImages)}
//       </Layout>
//     </>
//   );
// }


"use client";

import { useState, useEffect } from "react";

import Navbar from "@/components/Navbar";
import Layout from "@/components/PageLayout";
import Gallery from "@/components/Gallery";

import styles from "@/styles/Home.module.css";

export default function Digitalart() {
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
    fetchFiles("digitalart", (data) =>
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
        <div className={styles.digitalartmainbody}>
          <Gallery images={productImages} />
        </div>
      </Layout>
    </>
  );
}
