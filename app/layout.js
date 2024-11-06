
// "use client"

import dynamic from 'next/dynamic';
import "@/styles/global.css";

// Dynamically import the PageLayout component
const PageLayout = dynamic(() => import('@/components/PageLayout'), {
  ssr: false, // Server-Side Rendering disabled for this component
});


export const metadata = {
  title: "FRAME STUDIO",
  metacharSet: "utf-8",
  description: "This page invites people to see, buy and contact with us for purpose of the art/desing/codding in graphic, website, ai art, digital art, photography",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" charSet="UTF-8" content="width=device-width, initial-scale=1.0" />
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <PageLayout>
        {children}
        </PageLayout>
      </body>
    </html>
  );
}
