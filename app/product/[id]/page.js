//product/id.js

"use client";

import DOMPurify from "dompurify";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import PageLayout from "@/components/PageLayout";
import PreLoader from "@/components/Preloader";

import styles from "@/styles/Id.module.css";

import BehanceLogo from "@/icon/behance.png";
import DribbleLogo from "@/icon/dribble.png";
import FacebookLogo from "@/icon/facebook.png";
import InstagramLogo from "@/icon/instagram.png";
import PinterestLogo from "@/icon/pinterest.png";
import TwitterLogo from "@/icon/twitter.png";

import { getDirectDriveLink } from "@/utils/getDirectDriveLink";

export default function Id() {
  const [data, setData] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const [prevItems, setPrevItems] = useState([]);
  const [cardprevItems, setCardPrevItems] = useState([]);
  const [nextItems, setNextItems] = useState([]);
  const [cardnextItems, setCardNextItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const cleanPathname = pathname.replace("/product/", "");
  const pathParts = cleanPathname.split("+");
  const [type, mongoID, uniqueID, title] = pathParts;

  const isValidURL = type && mongoID && uniqueID && title;

  useEffect(() => {
    if (!isValidURL) {
      router.replace("/404");
      return;
    }

    if (mongoID && uniqueID && type) {
      fetch(`/api/getFiles?type=${type}&id=${mongoID}&uniqueID=${uniqueID}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error("Error fetching data:", data.error);
          } else {
            setData(data);
            getPrevNextData(mongoID, type, title, uniqueID);
          }
        })
        .catch((error) => console.error("Fetch error:", error));
    }
  }, [pathname]);

  const getPrevNextData = async (mongoID, type) => {
    try {
      // Fetch previous items
      const prevRes = await fetch(
        `/api/getFiles/getPrevFiles?currentID=${mongoID}&type=${type}`
      );
      const prevResult = await prevRes.json();
      // Fetch next items
      const nextRes = await fetch(
        `/api/getFiles/getNextFiles?currentID=${mongoID}&type=${type}`
      );
      const nextResult = await nextRes.json();
      if (prevResult.error) {
        // console.error("Error fetching previous data:", prevResult.error);
      } else {
        setPrevItems(prevResult.prevNav);
        setCardPrevItems(prevResult.cardPrev);
      }
      if (nextResult.error) {
        // console.error("Error fetching next data:", nextResult.error);
      } else {
        setNextItems(nextResult.nextNav);
        setCardNextItems(nextResult.cardNext);
      }
    } catch (error) {
      console.error("Error fetching previous/next data:", error);
    }
  };

  const copyToClipboard = (e) => {
    e.stopPropagation();
    const urlToCopy = `type=${encodeURIComponent(data?.type)}&${
      data?.uniqueID
    }&title=${encodeURIComponent(data?.title)}`;
    navigator.clipboard
      .writeText(urlToCopy)
      .then(() => {
        setCopySuccess("Image link copied to clipboard!");
        setTimeout(() => setCopySuccess(""), 5000);
      })
      .catch(() => {
        setCopySuccess("Failed to copy!");
      });
  };

  function getImageFormat(base64Image) {
    const prefix = base64Image.substring(0, 15);
    if (prefix.includes("png")) return "png";
    if (prefix.includes("jpeg")) return "jpeg";
    if (prefix.includes("svg")) return "svg+xml";
    return "webp"; // default to jpg if none found
  }

  // if (!data) {
  //   return <>{isLoading && <PreLoader />}</>;
  // }

  return (
    <>
      <Navbar />
      {isLoading && <PreLoader />}

      <div className={styles.copylink} onClick={copyToClipboard}>
        click to copy reference
      </div>
      {copySuccess && <div className={styles.copySuccess}>{copySuccess}</div>}

      <div className={styles.backbtn} onClick={() => router.back()}>
        <i className={`material-icons ${styles.icon}`} alt="close">
          arrow_back
        </i>
      </div>

      <div className={styles.socialmedialinkdiv}>
        <Link href="#" className={styles.socialmedialink}>
          <Image
            src={BehanceLogo}
            width={20}
            height={20}
            alt="behance-logo"
            className={styles.iconimage}
          />
        </Link>
        <Link href="#" className={styles.socialmedialink}>
          <Image
            src={DribbleLogo}
            width={20}
            height={20}
            alt="dribble-logo"
            className={styles.iconimage}
          />
        </Link>
        <Link href="#" className={styles.socialmedialink}>
          <Image
            src={FacebookLogo}
            width={20}
            height={20}
            alt="facebook-logo"
            className={styles.iconimage}
          />
        </Link>
        <Link href="#" className={styles.socialmedialink}>
          <Image
            src={InstagramLogo}
            width={20}
            height={20}
            alt="instagram-logo"
            className={styles.iconimage}
          />
        </Link>
        <Link href="#" className={styles.socialmedialink}>
          <Image
            src={PinterestLogo}
            width={20}
            height={20}
            alt="pinterest-logo"
            className={styles.iconimage}
          />
        </Link>
        <Link href="#" className={styles.socialmedialink}>
          <Image
            src={TwitterLogo}
            width={20}
            height={20}
            alt="twitter-logo"
            className={styles.iconimage}
          />
        </Link>
      </div>

      <PageLayout>
        <div className={styles.idmainbody}>
          {/* <p>Current pathname: {pathname}</p> */}

          <div className={styles.producttitle}>
            {data ? data.title : "Loading..."}
          </div>

          <div className={styles.producttypeowner}>
            <div className={styles.owner}>by sumit kumar duary</div>
            <div className={styles.type}>
              <Link
                href={`/product/category/${data.category1}`}
                className={styles.typelink}
              >
                {data ? data.category1 : "Loading..."}
              </Link>
              ,
              <Link
                href={`/product/category/${data.category2}`}
                className={styles.typelink}
              >
                {data ? data.category2 : "Loading..."}
              </Link>
              ,
              <Link
                href={`/product/category/${data.category3}`}
                className={styles.typelink}
              >
                {data ? data.category3 : "Loading..."}
              </Link>
            </div>
          </div>

          {/* details body */}
          <div className={styles.bodydatadiv}>
            {data ? (
              <>
                <div className={styles.dataparagraph} dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(data.details),
                  }} />
                {data.base64Image && (
                  <Image
                    src={`data:image/${getImageFormat(data.base64Image)};base64,${data.base64Image}`}
                    alt={data.title}
                    width={0}  // Setting width to 0 here since it's controlled via style
                    height={0}  // Same for height, we'll use 'style' to control dimensions
                    style={{
                      width: "100%",   // Set width to 100% to fill the container
                      height: "auto",  // Maintain the aspect ratio automatically
                    }}
                  />
                )}
              </>
            ) : (
              "Loading..."
            )}
          </div>

          {/* description details div */}
          <div className={styles.descriptiondiv}>
            <div className={styles.title}>description</div>
            <div className={styles.text}>{data.description}</div>
          </div>

          <div className={styles.clientdetailsdiv}>
            <div className={styles.title}>client</div>
            <div className={styles.text}>{data.clientdetails}</div>
          </div>

          {/* prev & next product link */}
          <div className={styles.productlink}>
            {prevItems.length > 0 ? (
              prevItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.type}+${item.id}+${item.uniqueID}+${item.title}`}
                  className={styles.pagelink1}
                >
                  <div>{"<"}</div>
                  {item.title}
                </Link>
              ))
            ) : (
              <div>Loading previous items...</div>
            )}

            {nextItems.length > 0 ? (
              nextItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.type}+${item.id}+${item.uniqueID}+${item.title}`}
                  className={styles.pagelink2}
                >
                  {item.title}
                  <div>{">"}</div>
                </Link>
              ))
            ) : (
              <div>Loading next items...</div>
            )}
          </div>

          <div className={styles.cardcarouselbody}>
            <div className={styles.cardcarouseltitle}>Related Body</div>
            <div className={styles.cardcarousel}>
              {[...cardprevItems, ...cardnextItems].map((item, index) => (
                <div className={styles.cardbody} key={`${item.id}-${index}`}>
                  {/* Fallback image if item.file is missing */}
                  <Image
                    src={getDirectDriveLink(item.file)} // Adjust the fallback image path
                    className={styles.cardimage}
                    width={100}
                    height={100}
                    alt={item.title || "Item Image"}
                    // format="webp"
                    // Fallback alt text if title is missing
                  />
                  <div className={styles.cardtext}>
                    <Link
                      href={`/product/${item.type}+${item.id}+${item.uniqueID}+${item.title}`}
                      className={styles.cardtitle}
                    >
                      {item.title}
                    </Link>
                    {item.description && (
                      <div className={styles.carddescription}>
                        {item.description}
                      </div>
                    )}
                    <Link
                      href={`/product/${item.type}+${item.id}+${item.uniqueID}+${item.title}`}
                      className={styles.cardlink}
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
