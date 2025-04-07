'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { trpc } from '@/app/_trpc/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface Topic {
  _id: string, 
  img: string, 
  title: string, 
  body: string, 
  created_at: string, 
  n_like: number, 
  user_id: { username: string }, 
  isLiked : boolean,
  n_comment: number,
  tags: string[]
}

export default function TrendingTopicCarousel() {
  const TOPIC_LIMIT = 6;

  const [slideToShow, setSlideToShow] = useState(3);

  const { data: carousel_items, isLoading, isError } = trpc.searchQuery.useQuery({
    sortBy: "Popular",
    limit: TOPIC_LIMIT
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && window.innerWidth > 640) {
        setSlideToShow(3);
      } else if (window.innerWidth <= 640 && window.innerWidth > 340) {
        setSlideToShow(2);
      } else if (window.innerWidth <= 340) {
        setSlideToShow(1);
      };
    }
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const settings = {
    dots: true,
    infinite: carousel_items?.data.length >= slideToShow ? true : false,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    speed: 600,
    slidesToShow: slideToShow,
    swipeToSlide: true,
  };

  return (
    <div className="h-full w-full px-10 my-10">
      <p className="w-full text-headline-5 text-primary-600 my-2">Stayed on Trend Topics</p>
      <Slider {...settings}>
        {carousel_items?.data.map((item: Topic, index: number) => (
        <Link 
        href={{ pathname: `/forum/${item._id}`,
                query: JSON.stringify(item)}} 
        key={index} 
        className="w-[14vw] h-full !flex flex-col my-4 gap-2 outline-none group hover:scale-105 transition duration-200 hover:cursor-pointer">
          <div className="flex content-center items-center gap-2">
            <div className="size-10">
              <img src={item.user_id && 'avatar' in item.user_id ? item.user_id.avatar : '/images/profile.avif'} className="w-full h-full object-cover rounded-full"/>
            </div>
            <div>
              <p className="text-body-large">
              {item.user_id.username}
              </p>
              <p className="text-subtitle-small text-monochrome-400">
                {dayjs(item.created_at).fromNow()}
              </p>
            </div>
          </div>
          <div>
          {/* {item.tags.length > 0 && 
          <div className="flex gap-2 flex-wrap">
            {item.tags.map((tag) => (
              <div key={tag} className="text-subtitle-small rounded-lg border border-primary-500 text-primary-500 px-2 py-1 w-fit">
                {tag}
              </div>
            ))}
          </div>
          } */}
          </div>
          {item.img && item.img.trim() !== "" && (
            <img src={item.img} className="w-full h-[20vh] rounded-xl object-cover group-hover:drop-shadow-md"/>
          )}
          <p className="text-headline-6 text-monochrome-950 text-start group-hover:text-primary-600 transition duration-200 break-words">
            {item.title}
          </p>
          <p className="text-body-small text-monochrome-500">
            {item.n_like} likes • {item.n_comment} comments
          </p>
        </Link>
        ))}
      </Slider>
    </div>
  )
}
