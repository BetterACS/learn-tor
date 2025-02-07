'use client';

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface UniLogoProps {
  src: string;
  alt: string;
}

const UniLogo: React.FC<UniLogoProps> = ({ src, alt }) => {
  const [isVisible, setIsVisible] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (logoRef.current) {
      observer.observe(logoRef.current);
    }

    return () => {
      if (logoRef.current) {
        observer.unobserve(logoRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={logoRef}
      className={`transition transform duration-700 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        width={100}
        height={100}
        quality={100}
        className="opacity-50 hover:opacity-100 hover:scale-110 transform transition duration-300 object-contain"
      />
    </div>
  );
};

interface UniversityLogosProps {
  logos: { src: string; alt: string }[];
}

const UniversityLogos: React.FC<UniversityLogosProps> = ({ logos }) => (
  <div className="bg-monochrome-50 py-12">
    <div className="container mx-auto text-center px-4 md:px-48 py-10">
      <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-6 gap-x-8 gap-y-16 justify-center">
        {logos.map((logo, index) => (
          <UniLogo key={index} src={logo.src} alt={logo.alt} />
        ))}
      </div>
    </div>
  </div>
);

export default UniversityLogos;
