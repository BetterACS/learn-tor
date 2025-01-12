import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  const socialLinks = [
    { href: "https://www.instagram.com", imgSrc: "/images/instagram-logo.png", alt: "Instagram", ariaLabel: "Instagram" },
    { href: "https://www.facebook.com", imgSrc: "/images/facebook-logo.png", alt: "Facebook", ariaLabel: "Facebook" },
    { href: "https://www.twitter.com", imgSrc: "/images/twitter-logo.png", alt: "Twitter", ariaLabel: "Twitter" },
    { href: "https://www.linkedin.com", imgSrc: "/images/linkedIn-logo.png", alt: "LinkedIn", ariaLabel: "LinkedIn" },
  ];

  return (
    <div className="flex flex-col">
      <main className="flex-grow"></main>

      <footer className="bg-primary-600 py-6 text-monochrome-50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between">
          <div className="flex flex-col items-start mb-6 md:mb-0">
            <img
              src="/images/logofooter.png"
              alt="Learntor Logo Footer"
              className="max-h-[20rem] w-auto"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-60">
            <div>
              <div className="text-headline-4 mb-4">Learntor</div>
              <ul className="space-y-2 text-headline-5">
                {["FAQ", "About Us", "Our Services", "Privacy Policy", "Affiliate Program"].map((text) => (
                  <li key={text}>
                    <Link href="/" className="hover:underline">
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 md:mt-0">
              <div className="text-headline-4 mb-4">Link For Function</div>
              <ul className="space-y-2 text-headline-5">
                {["Home", "TCAS Info", "Compare Courses", "Forum", "TCAS Calculate", "Chatbot"].map((text) => (
                  <li key={text}>
                    <Link href="/" className="hover:underline">
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <div className="text-headline-4 mb-4">Contact Us</div>
            <div className="flex space-x-4">
              {socialLinks.map(({ href, imgSrc, alt, ariaLabel }) => (
                <Link
                  key={ariaLabel}
                  href={href}
                  className="bg-white rounded-full flex items-center justify-center h-12 w-12 sm:h-10 sm:w-10"
                  aria-label={ariaLabel}
                >
                  <img
                    src={imgSrc}
                    alt={alt}
                    className="h-8 w-8 sm:h-6 sm:w-6 object-contain"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;