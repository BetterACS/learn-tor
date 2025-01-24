'use client';
import { Post, SortBy } from '@/components/index';
import { useState, useRef, useEffect } from 'react';

export default function PostSection() {

  const posts = [
    {
      id: 1,
      img: "http://i.ibb.co/ncrXc2V/1.png",
      title: "หนูอยากยื่นมศว.ค่ะ ช่วยดูและแนะนำให้หน่อยได้ไหมคะ 1",
      body: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque deserunt, quam qui nobis rerum veniam quis pariatur commodi reprehenderit neque delectus consectetur quae molestias sapiente, unde, culpa sunt numquam. Quas."
    },
    {
      id: 2,
      img: "http://i.ibb.co/B3s7v4h/2.png",
      title: "หนูอยากยื่นมศว.ค่ะ ช่วยดูและแนะนำให้หน่อยได้ไหมคะ 2",
      body: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque deserunt, quam qui nobis rerum veniam quis pariatur commodi reprehenderit neque delectus consectetur quae molestias sapiente, unde, culpa sunt numquam. Quas."
    },
    {
      id: 3,
      img: "http://i.ibb.co/XXR8kzF/3.png",
      title: "หนูอยากยื่นมศว.ค่ะ ช่วยดูและแนะนำให้หน่อยได้ไหมคะ 3",
      body: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque deserunt, quam qui nobis rerum veniam quis pariatur commodi reprehenderit neque delectus consectetur quae molestias sapiente, unde, culpa sunt numquam. Quas."
    },
    {
      id: 4,
      img: "http://i.ibb.co/yg7BSdM/4.png",
      title: "หนูอยากยื่นมศว.ค่ะ ช่วยดูและแนะนำให้หน่อยได้ไหมคะ 4",
      body: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque deserunt, quam qui nobis rerum veniam quis pariatur commodi reprehenderit neque delectus consectetur quae molestias sapiente, unde, culpa sunt numquam. Quas."
    },
  ]

  return (
    <div className="h-fit w-full flex flex-col gap-6">
      <div className="flex w-fit gap-2 items-center">
        <p className="text-monochrome-500 text-subtitle-large">
          Sort by: 
        </p>
        <SortBy filters={["Newest", "Oldest", "Popular"]} />
      </div>
      <div className="h-fit w-full px-[14vw] flex flex-col gap-6">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}