//admin/home/contact.js

"use client";
import React, { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import Layout from "@/components/PageLayout";
import Logout from "@/components/Logout";

import styles from "@/styles/AdminContact.module.css";

// Reusable component for rendering each contact item
function ContactItem({ item, formatTimestamp, markAsComplete, deleteContact }) {
  return (
    <div className={styles.contactdatabody}>
      <div className={styles.iddatediv}>
        <div className={styles.uniqueIDdiv}>
          <div className={styles.title}>uniqueID :</div>
          <div className={styles.iddetails}>{item.contactuniqueid}</div>
        </div>
        <div className={styles.uniqueIDdiv}>
          <div className={styles.title}>date :</div>
          <div className={styles.iddetails}>{formatTimestamp(item.timestamp)}</div>
        </div>
      </div>
      <div className={styles.iddatediv}>
        <div className={styles.uniqueIDdiv}>
          <div className={styles.title}>token ID :</div>
          <div className={styles.iddetails}>{item.tokenID}</div>
        </div>
      </div>
      <br />
      <div className={styles.iddatediv}>
        <div className={styles.uniqueIDdiv}>
          <div className={styles.title}>name :</div>
          <div className={styles.iddetails}>{item.name}</div>
        </div>
      </div>
      <div className={styles.iddatediv}>
        <div className={styles.uniqueIDdiv}>
          <div className={styles.title}>email :</div>
          <div className={styles.iddetails}>{item.email}</div>
        </div>
      </div>
      <div className={styles.iddatediv}>
        <div className={styles.uniqueIDdiv}>
          <div className={styles.title}>city :</div>
          <div className={styles.iddetails}>{item.city}</div>
        </div>
        <div className={styles.uniqueIDdiv}>
          <div className={styles.title}>phone :</div>
          <div className={styles.iddetails}>{item.phone}</div>
        </div>
      </div>
      <div className={styles.iddatediv}>
        <div className={styles.uniqueIDdiv}>
          <div className={styles.title}>subject :</div>
          <div className={styles.iddetails}>{item.subject}</div>
        </div>
      </div>
      <div className={styles.iddatediv}>
        <div className={styles.uniqueIDdiv}>
          <div className={styles.title}>product / image reference :</div>
          <div className={styles.iddetails}>{item.imagereference}</div>
        </div>
      </div>
      <div className={styles.iddatediv}>
        <div className={styles.uniqueIDdiv}>
          <div className={styles.title}>category :</div>
          <div className={styles.iddetails}>{item.category}</div>
        </div>
      </div>
      <br />
      <div className={styles.massagediv}>
        <div className={styles.title}>message :</div>
        <div className={styles.iddetails}>{item.message}</div>
      </div>
      <br />
      <div className={styles.btnsection}>
        <button className={styles.donebtn} onClick={() => markAsComplete(item.contactuniqueid, item.tokenID)}>done</button>
        <button className={styles.deletebtn} onClick={() => deleteContact(item.contactuniqueid, item.tokenID)}>delete</button>
      </div>
    </div>
  );
}

export default function AdminContact() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("/api/contact");
        if (!response.ok) throw new Error("Failed to fetch contacts");
        const data = await response.json();

              // Sort contacts by timestamp in descending order (latest first)
      const sortedContacts = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));


        setContacts(sortedContacts);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchContacts();
  }, []);

    // Function to format the timestamp
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString("en-US", {
          weekday: 'short', // Mon
          year: 'numeric',   // 2024
          month: '2-digit',  // 01
          day: '2-digit',    // 18
          hour: '2-digit',    // 02
          minute: '2-digit',  // 20
          hour12: true       // AM/PM format
        }).replace(',', ''); // Remove the comma between date and time
      };

      const markAsComplete = async (contactId, tokenID) => {
        try {
            const response = await fetch(`/api/contact`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    contactuniqueid: contactId,
                    tokenID: tokenID,
                    status: "complete", 
                    statusTimestamp: new Date().toISOString() 
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json(); // Get detailed error message
                throw new Error(errorData.message || "Failed to update status");
            }
    
            setContacts((prev) =>
                prev.map((contact) =>
                    contact.contactuniqueid === contactId ? { ...contact, status: "complete", statusTimestamp: new Date().toISOString() } : contact
                )
            );
        } catch (error) {
            setError("Error updating status: " + error.message);
        }
    };
    


    //delete data function
    const deleteContact = async (contactId, tokenID) => {
      console.log("Attempting to delete contact:", "uniqueID", contactId, "tokenID", tokenID);
      try {
          const response = await fetch(`/api/contact`, {
              method: "DELETE",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ contactuniqueid: contactId, tokenID: tokenID }),
          });
          
          if (!response.ok) {
              const errorData = await response.json(); // Get detailed error message
              throw new Error(errorData.message || "Failed to delete contact");
          }
  
          setContacts((prev) => prev.filter((contact) => contact.contactuniqueid !== contactId));
      } catch (error) {
          setError("Error deleting contact: " + error.message);
      }
  };
  
    

  // Separate contacts by status
  const incompleteContacts = contacts.filter((contact) => contact.status === "incomplete");
  const completeContacts = contacts.filter((contact) => contact.status === "complete");

      

  return (
    <>
      <Navbar />
      <Layout>
          <Logout />
        <div className={styles.admincontactmainbody}>
          <div className={styles.contactbody}>
            <div className={styles.mainpagetitle}>contact data</div>
            {error && <div className={styles.errorMessage}>{error}</div>}
            {contacts.length === 0 ? (
              <div className={styles.nodatafound}>No contacts found.</div>
            ) : (
                <>
                 {/* Incomplete Contacts */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitleIncomplete}>Incomplete Projects</h2>
              {incompleteContacts.length === 0 ? (
                <div className={styles.nodatafound}>No incomplete contacts found.</div>
              ) : (
                <div className={styles.contactdatamainbody}>
                  {incompleteContacts.map((item) => (
                    <ContactItem
                      key={item._id}
                      item={item}
                      formatTimestamp={formatTimestamp}
                      markAsComplete={markAsComplete}
                      deleteContact={deleteContact}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Completed Contacts */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitleComplete}>Completed Status</h2>
              {completeContacts.length === 0 ? (
                <div className={styles.nodatafound}>No completed contacts found.</div>
              ) : (
                <div className={styles.contactdatamainbody}>
                  {completeContacts.map((item) => (
                    <ContactItem
                      key={item._id}
                      item={item}
                      formatTimestamp={formatTimestamp}
                      markAsComplete={markAsComplete}
                      deleteContact={deleteContact}
                    />
                  ))}
                </div>
              )}
            </div>
              </>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
