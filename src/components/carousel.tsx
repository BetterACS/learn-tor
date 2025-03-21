'use client';

import React from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface CarouselProps {
  carousel_items: { _id: number, img: string; title: string, body: string}[];
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
        className="scale-[110%] fill-none stroke-black hover:stroke-primary-600 transition duration-100"
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
        className="scale-[110%] fill-none stroke-black hover:stroke-primary-600 transition duration-100"
      >
        <g strokeLinejoin="round" strokeWidth={3}>
          <path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"></path>
          <path strokeLinecap="round" d="m27 33l-9-9l9-9"></path>
        </g>
      </svg>
    </div>
  );
}

export default function Carousel({ carousel_items }: CarouselProps) {

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    speed: 600,
    slidesToShow: 4,
    swipeToSlide: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  return (
    <Slider {...settings}>
      {carousel_items.map((item) => (
        <Link 
        href={{ pathname: `/forum/${item._id}`,
                query: JSON.stringify(item)}} 
        key={item._id} 
        className="w-[15vw] h-full !flex flex-col my-4 gap-2 outline-none group hover:scale-105 transition duration-200 hover:cursor-pointer">
          {item.img && item.img.trim() !== "" ? (
            <img src={item.img} className="w-full h-[20vh] rounded-xl object-cover group-hover:drop-shadow-md"/>
          ) : (
            <div className="w-full h-[20vh] rounded-xl object-cover group-hover:drop-shadow-md bg-monochrome-200 flex items-center justify-center text-monochrome-500">
              No image
            </div>
          )}
          <p className="text-headline-6 text-monochrome-950 text-start group-hover:text-primary-600 transition duration-200 break-words">{item.title}</p>
        </Link>
      ))}
    </Slider>
  )

}
