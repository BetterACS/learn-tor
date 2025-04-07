'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { trpc } from '@/app/_trpc/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

interface Topic {
  _id: string, 
  img: string, 
  title: string, 
  body: string, 
  created_at: string, 
  n_like: number, 
  user_id: { username: string }, 
  isLiked : boolean,
  n_comment: number
}

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

function SampleNextArrow(props: ArrowProps) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} block absolute right-0 top-1/2 transform -translate-y-1/2`}
      style={{
        ...style,
      }}
      onClick={onClick}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 48 48"
        className="scale-[110%] maxsm:scale-[90%] fill-none stroke-black hover:stroke-primary-600 transition duration-100"
      >
        <g strokeLinejoin="round" strokeWidth={3}>
          <path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"></path>
          <path strokeLinecap="round" d="m21 33l9-9l-9-9"></path>
        </g>
      </svg>
    </div>
  );
}

function SamplePrevArrow(props: ArrowProps) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} block absolute left-0 top-1/2 transform -translate-y-1/2`}
      style={{
        ...style,
      }}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="scale-[110%] maxsm:scale-[90%] fill-none stroke-black hover:stroke-primary-600 transition duration-100"
      >
        <g strokeLinejoin="round" strokeWidth={3}>
          <path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"></path>
          <path strokeLinecap="round" d="m27 33l-9-9l9-9"></path>
        </g>
      </svg>
    </div>
  );
}

export default function Carousel() {
  const TOPIC_LIMIT = 10;

  const [slideToShow, setSlideToShow] = useState(4);

  const { data: carousel_items, isLoading, isError } = trpc.searchQuery.useQuery({
      sortBy: "Popular",
      filterTags: [{ tagname: "Portfolio", category: "ทั่วไป", state: "included" }],
      limit: TOPIC_LIMIT
    });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSlideToShow(4);
      } else if (window.innerWidth <= 1024 && window.innerWidth > 480) {
        setSlideToShow(3);
      } else if (window.innerWidth <= 480) {
        setSlideToShow(2);
      };
    }
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const settings = {
    dots: false,
    infinite: carousel_items?.data.length >= slideToShow ? true : false,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    speed: 600,
    slidesToShow: slideToShow,
    swipeToSlide: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return isLoading ? (
    <div className="h-fit w-full px-4 flex justify-between gap-4">
      {Array.from({ length: slideToShow }).map((_, index) => (
        <div key={index} className="w-full h-fit flex flex-col gap-2 animate-pulse">
          <div className="w-full h-[10rem] bg-monochrome-100 rounded-md my-4"></div>
          <p className="w-fit text-headline-6 text-transparent text-start bg-monochrome-100 rounded-md">Placeholderrrrrrrrrrrr</p>
          <p className="w-fit text-transparent text-start bg-monochrome-100 rounded-md">Placeholderrrrr</p>
        </div>
        
      ))}
    </div>
  ) : (
    <div className="h-fit w-full px-4">
      <Slider {...settings}>
        {carousel_items?.data.map((item: Topic, index: number) => (
        <Link 
        href={{ pathname: `/forum/${item._id}`,
                query: JSON.stringify(item)}} 
        key={index} 
        className="w-[15vw] h-full !flex flex-col my-4 gap-2 outline-none group hover:scale-105 transition duration-200 hover:cursor-pointer">
          {item.img && item.img.trim() !== "" ? (
            <img src={item.img} className="w-full h-[20vh] rounded-xl object-cover group-hover:drop-shadow-md"/>
          ) : (
            <div className="w-full h-[20vh] rounded-xl object-cover group-hover:drop-shadow-md bg-monochrome-200 flex items-center justify-center text-monochrome-500">
              No image
            </div>
          )}
          <p className="text-headline-6 text-monochrome-950 text-start group-hover:text-primary-600 transition duration-200 break-words">
            {item.title}
          </p>
          <div className="flex gap-2 text-monochrome-500">
            <p>{item.n_like} likes</p>
            <p>•</p>
            <p>{item.n_comment} comments</p>
          </div>
        </Link>
        ))}
      </Slider>
    </div>
  )
}
