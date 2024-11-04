// admin/index.js

"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';



import Navbar from '@/components/Navbar';
import Layout from '@/components/PageLayout';
import PreLoader from '@/components/Preloader';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the /admin/login route
    router.push('/admin/login');
  }, [router]);

  return (
    <>
      <Navbar />
      <Layout>
        <div>
         <PreLoader/>
         admin
        </div>
      </Layout>
    </>
  );
}
