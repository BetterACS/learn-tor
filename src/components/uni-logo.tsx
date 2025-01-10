import Image from 'next/image';

interface UniLogoProps {
  src: string;
  alt: string;
}

const UniLogo: React.FC<UniLogoProps> = ({ src, alt }) => {
  return (
    <div className="group relative">
      <Image
        src={src}
        alt={alt}
        width={130}
        height={130}
        quality={100}
        className="opacity-60 group-hover:opacity-100 transition-opacity duration-300 object-contain"
      />
    </div>
  );
};

interface UniversityLogosProps {
  logos: { src: string; alt: string }[];
}

const UniversityLogos: React.FC<UniversityLogosProps> = ({ logos }) => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto text-center px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-8 justify-center">
          {logos.map((logo, index) => (
            <UniLogo key={index} src={logo.src} alt={logo.alt} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniversityLogos;
