'use client';
import React from 'react';

interface FeatureSectionProps {
  title: string;
  description: string;
  img: string;
  link: string;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ title, description, img, link }) => (
  <div className="flex flex-col items-center text-monochrome-50 pl-8 pt-8 h-full">
    <div className="w-[70px] h-[70px] md:w-[130px] md:h-[130px] lg:w-[200px] lg:h-[200px] mb-4 flex items-center justify-center overflow-hidden rounded-lg">
      <img
        src={img}
        alt={title}
        className="w-full h-full object-contain"
      />
    </div>
    <div className="text-headline-5 font-bold lg:text-headline-4 lg:font-bold mb-4 text-center">{title}</div>
    <div className="text-headline-6 lg:text-headline-5 text-center mb-4 min-h-[72px]">{description}</div>
    <a
      href={link}
      className="bg-monochrome-50 text-primary-600 rounded-lg py-4 px-2 lg:px-6 text-button lg:text-big-button mb-6 hover:bg-monochrome-200 transition duration-150"
    >
      เรียนรู้เพิ่มเติม
    </a>
  </div>
);

export default FeatureSection;
