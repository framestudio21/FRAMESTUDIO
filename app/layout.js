
"use client"

import "@/styles/global.css";

import Head from "next/head";

import PageLayout from "@/components/PageLayout";
import ScrollToTopButton from "@/components/ScrollToTopButton";


// export const metadata = {
//   title: "FRAME STUDIO",
//   description: "This page invites people to see, buy and contact with us for purpose of the art/desing/codding in graphic, website, ai art, digital art, photography",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
            <Head>
        <title>FRAME STUDIO</title>
        <meta charSet="utf-8" />
        <meta name="description" content="This page invites people to see, buy and contact with us for purpose of the art/desing/codding in graphic, website, ai art, digital art, photography" />
      </Head>
      <body>
        <PageLayout>
        {children}
        </PageLayout>
        <ScrollToTopButton/>
      </body>
    </html>
  );
}
