//contact.js

"use client"


import { useState, useEffect } from "react";
import Link from "next/link";


import styles from "@/styles/Contact.module.css";
import Navbar from "@/components/Navbar";
import Layout from "@/components/PageLayout";

export default function Contact() {
    const [hoveredRadio, setHoveredRadio] = useState(null);
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      city: "",
      phone: "",
      subject: "",
      imagereference: "",
      category: "",
      message: "",
    });
    const [popupData, setPopupData] = useState(null);
    const [error, setError] = useState(""); // State for error messages
  
    const handleHover = (category) => {
      setHoveredRadio(category);
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();

        // Required field validation
  const { name, email, subject, category, phone } = formData;
  if (!name || !email || !subject || !category) {
    setError("Please fill out all required fields.");
    setTimeout(() => setError(""), 3000);
    return;
  }

            // Validation checks
            const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // Gmail validation regex
            const phonePattern = /^[0-9]{10}$/; // 10 digit phone number regex
        
            if (!emailPattern.test(email)) {
              setError("Please enter a valid Gmail address.");
              setTimeout(() => setError(""), 3000);
              return;
            }
        
            if (!phonePattern.test(phone)) {
              setError("Please enter a valid 10-digit phone number.");
              setTimeout(() => setError(""), 3000);
              return;
            }
        
            setError(""); // Clear any previous errors

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            category: formData.category,
            status: "incomplete",
            statusTimestamp: new Date().toISOString(),
          }),
        });
  
        if (!response.ok) throw new Error("Failed to submit");
  
        const data = await response.json();
        setPopupData(data);
        // Reset form
        setFormData({
          name: "",
          email: "",
          city: "",
          phone: "",
          subject: "",
          imagereference: "",
          category: "",
          message: "",
        });
      } catch (error) {
        console.error("Submission error:", error);
        // You might want to show an error popup or message here
      }
    };

  return (
    <>
      <Navbar />
      <Layout>
        <div className={styles.contactmainbody}>

             {/* Popup Component */}
          {popupData && (
            <div className={styles.popupwindow}>
              <div className={styles.popupContent}>

                <div className={styles.titlesection}>
                <div className={styles.title}>Success !</div>
                <i className={`material-icons ${styles.icon}`} alt="close" onClick={() => setPopupData(null)} >close </i>
                </div>
                <div className={styles.textbodysection}>
                <div className={styles.subtitle}>{popupData.message}</div>
                <div className={styles.subtitle}><div className={styles.subtexttitle}>Unique ID:</div><div className={styles.idtokenid}>{popupData.contactuniqueid}</div></div>
                <div className={styles.subtitle}><div className={styles.subtexttitle}>Token ID:</div><div className={styles.idtokenid}>{popupData.tokenID}</div></div>
                </div>

                <button className={styles.donebtn} onClick={() => setPopupData(null)}>Done</button>
              </div>
            </div>
          )}

           {/* Error Message */}
           {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.informationdivbody}>
            <div className={styles.details}>
              <div className={styles.informationdiv}>
                <i
                  className={`material-icons ${styles.icon}`}
                  alt="contact_support"
                >
                  contact_support
                </i>
                <div className={styles.textdiv}>
                  <div className={styles.titlesection}>
                    <div className={styles.title}>Chat to us</div>
                    <div className={styles.subtitle}>
                      Our friendly team is here to help
                    </div>
                  </div>
                  <div className={styles.email}>
                    info.framestudi21@gmail.com
                  </div>
                </div>
              </div>

              <div className={styles.informationdiv}>
                <i className={`material-icons ${styles.icon}`} alt="pin_drop">
                  pin_drop
                </i>
                <div className={styles.textdiv}>
                  <div className={styles.titlesection}>
                    <div className={styles.title}>Visit us</div>
                  </div>
                  <div className={styles.email}>
                    Kolkata, West Bengal-711316,
                    <br />
                    India
                  </div>
                </div>
              </div>

              <div className={styles.informationdiv}>
                <i className={`material-icons ${styles.icon}`} alt="call">
                  call
                </i>
                <div className={styles.textdiv}>
                  <div className={styles.titlesection}>
                    <div className={styles.title}>Call us</div>
                    <div className={styles.subtitle}>
                      Mon-Fri from 8am to 5pm
                    </div>
                  </div>
                  <div className={styles.email}>+91 6290985252</div>
                </div>
              </div>
            </div>

            <div className={styles.followlinks}>
              <div className={styles.title}>Follow us here</div>
              <div className={styles.links}>
                <div className={styles.link}>
                  <Link href="#">FACEBOOK</Link>
                </div>
                <div className={styles.link}>
                  <Link href="#">INSTAGRAM</Link>
                </div>
                <div className={styles.link}>
                  <Link href="#">PINTEREST</Link>
                </div>
                <div className={styles.link}>
                  <Link href="#">BEHANCE</Link>
                </div>
                <div className={styles.link}>
                  <Link href="#">TWITTER</Link>
                </div>
                <div className={styles.link}>
                  <Link href="#">DRIBBBLE</Link>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formdivbody}>
            <div className={styles.titlesection}>
              <div className={styles.title}>
                Got ideas? We've got the skills. Let's team up.
              </div>
              <div className={styles.subtitle}>
                Tell us more about yourself and what you've got in mind.
              </div>
            </div>

            <form className={styles.formsection} onSubmit={handleSubmit}>
              <div className={styles.blocks}>
                <input
                  type="text"
                  className={styles.textinput}
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.blocks}>
                <input
                  type="email"
                  className={styles.emailtextinput}
                  name="email"
                  placeholder="Your email (Gmail only)"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.blocks}>
                <input
                  type="text"
                  className={styles.textinput}
                  name="city"
                  placeholder="Your city"
                  value={formData.city}
                  onChange={handleChange}
                />
                <input
                  type="tel"
                  className={styles.textinput}
                  name="phone"
                  placeholder="Your phone (10 digits)"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.blocks}>
                <input
                  type="text"
                  className={styles.textinput}
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.blocks}>
                <input
                  type="text"
                  className={styles.textinput}
                  name="imagereference"
                  placeholder="image reference"
                  value={formData.imagereference}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.radioblocks}>
                <div className={styles.title}>
                  What is the matter of your query?
                </div>
                <div className={styles.inputfield}>
                  {[
                    "graphicdesign",
                    "logodesign",
                    "advertisementdesign",
                    "typographydesign",
                    "brandingdesign",
                    "visualdesign",
                    "layoutdesign",
                    "otherdesign",
                  ].map((category) => (
                    <div
                      key={category}
                      className={`${styles.radiodiv} ${
                        hoveredRadio === category ? styles.hovered : ""
                      }`}
                      onMouseEnter={() => handleHover(category)}
                      onMouseLeave={() => handleHover(null)}
                    >
                      <input
                        type="radio"
                        id={category}
                        value={category}
                        name="category"
                        className={styles.radio}
                        onChange={handleChange}
                      />
                      <label
                        className={styles.radioinputlabel}
                        htmlFor={category}
                      >
                        {category.replace("design", " Design")}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.blocks}>
                <textarea
                  className={styles.textarea}
                  name="message"
                  placeholder="Tell us about it..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.btnblocks}>
                <button type="submit" className={styles.sendbtn} >
                  Submit
                </button>
                <button type="button" className={styles.resetbtn}   onClick={() => setFormData({})} >
                  Reset
                </button>
              </div>
            </form>
          </div>

        </div>
      </Layout>
    </>
  );
}
