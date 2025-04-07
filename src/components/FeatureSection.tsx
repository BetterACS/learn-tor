'use client';
import React from 'react';

interface FeatureSectionProps {
  title: string;
  description: string;
  descriptionClassName?: string;
  img: string;
  link: string;
  buttonClassName?: string;
  imageClassName?: string;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  description,
  descriptionClassName = "",
  img,
  buttonClassName = "",
  imageClassName = "",
  link
}) => (
  <div className="flex flex-col items-center text-monochrome-50 h-full">
    <div className={`w-[70px] h-[70px] md:w-[130px] md:h-[130px] lg:w-[200px] lg:h-[200px] mb-4 flex items-center justify-center overflow-hidden rounded-lg ${imageClassName}`}>
      <img src={img} alt={title} className="w-full h-full object-contain" />
    </div>

    <div className={"text-headline-5 font-bold lg:text-headline-4 lg:font-bold mb-4 mt-4 text-center"}>
      {title}
    </div>

    <div
      className={`text-headline-6 lg:text-headline-5 text-center flex flex-col justify-between flex-grow ${descriptionClassName || ""}`}
    >
      <div>{description}</div>
      
      <div className="mt-20">
        <a
          href={link}
          className={`bg-monochrome-50 text-primary-600 rounded-lg py-4 px-2 lg:px-6 text-button lg:text-big-button border-2 border-transparent hover:border-monochrome-50 hover:bg-primary-600 hover:text-monochrome-50 transition duration-150 ${buttonClassName}`}
        >
          เรียนรู้เพิ่มเติม
        </a>
      </div>
    </div>

  </div>
);

export default FeatureSection;
