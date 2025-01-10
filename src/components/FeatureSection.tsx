'use client';
import React from 'react';

interface FeatureSectionProps {
  title: string;
  description: string;
  img: string;
  link: string;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ title, description, img, link }) => (
  <div className="flex flex-col items-center text-monochrome-50 pl-8 pt-8">
    <img src={img} alt={title} className="max-h-[250px] w-auto mb-4" />
    <div className="text-headline-4 font-bold mb-4">{title}</div>
    <div className="text-headline-4 text-center mb-4">{description}</div>
    <a
      href={link}
      className="bg-monochrome-50 text-primary-600 rounded-lg py-4 px-6 text-big-button hover:bg-monochrome-100 transition duration-150"
    >
      เรียนรู้เพิ่มเติม
    </a>
  </div>
);

export default FeatureSection;
