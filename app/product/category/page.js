//product/category/page.js

"use client"

import React, { useState, useEffect } from 'react'

import Navbar from '@/components/Navbar'
import PageLayout from '@/components/PageLayout'

import styles from "@/styles/Category.module.css"
import Link from 'next/link'
export default function CategoryPage() {

  const liLinkData = [
    {
      id: 1,
      category: "logo design",
    },
    {
      id: 2,
      category: "Brand design (visual identity design / corporate design)",
    },
    {
      id: 3,
      category: "illustration design",
    },
    {
      id: 4,
      category: "layout design",
    },
    {
      id: 5,
      category: "Typography design",
    },
    {
      id: 6,
      category: "Advertising design",
    },
    {
      id: 7,
      category: "Marketing design",
    },
    {
      id: 8,
      category: "Packaging design",
    },
    {
      id: 9,
      category: "Label & sticker design",
    },
    {
      id: 10,
      category: "Publication graphic design",
    },
    {
      id: 11,
      category: "Environmental graphic design",
    },
    {
      id: 12,
      category: "Web design (digital design)",
    },
    {
      id: 13,
      category: "3D Graphic design",
    },
    {
      id: 14,
      category: "UI design",
    },
    {
      id: 15,
      category: "Motion graphics design",
    },
    {
      id: 16,
      category: "Powerpoint design",
    },
    {
      id: 17,
      category: "Vehicle wraps and decal design",
    },
    {
      id: 18,
      category: "other design",
    },
  ]

  return (
    <>
    <Navbar/>
    <PageLayout>
        <div className={styles.categorypagemainbody}>
           <div className={styles.title}>list of categories</div>
           <ol className={styles.ul}>
           {liLinkData.map((item) => (
              <Link
                href={`/product/category/${item.category}`} // Pass the category id to the dynamic route
                className={styles.lilink}
                key={item.id}
              >
                <li className={styles.li}>{item.category}</li>
              </Link>
            ))}
           </ol>
        </div>
    </PageLayout>
    </>
  )
}
