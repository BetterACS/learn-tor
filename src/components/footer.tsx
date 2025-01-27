import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  const socialLinks = [
    { href: "https://www.instagram.com", imgSrc: "/images/contact/instagram-logo.avif", alt: "Instagram", ariaLabel: "Instagram" },
    { href: "https://www.facebook.com", imgSrc: "/images/contact/facebook-logo.avif", alt: "Facebook", ariaLabel: "Facebook" },
    { href: "https://www.twitter.com", imgSrc: "/images/contact/twitter-logo.avif", alt: "Twitter", ariaLabel: "Twitter" },
    { href: "https://www.linkedin.com", imgSrc: "/images/contact/linkedIn-logo.avif", alt: "LinkedIn", ariaLabel: "LinkedIn" },
  ];

  const linkItems = [
    {
      title: "Learntor",
      links: [
        { name: "FAQ", href: "/faq" },
        { name: "About Us", href: "/about" },
        { name: "Our Services", href: "/services" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Affiliate Program", href: "/affiliate-program" },
      ],
    },
    {
      title: "Link for Function",
      links: [
        { name: "Home", href: "/home" },
        { name: "TCAS Info", href: "/tcas-info" },
        { name: "Compare Courses", href: "/compare-courses" },
        { name: "Forum", href: "/forum" },
        { name: "TCAS Calculate", href: "/tcascalculator" },
        { name: "Chatbot", href: "/chatbot" },
      ],
    },
  ];

  return (
    <div className="flex flex-col">
      <main className="flex-grow"></main>

      <footer className="bg-primary-600 py-6 text-monochrome-50">
        <div className="container mx-auto px-6 py-4 flex flex-col gap-6 md:flex-row md:items-start md:gap-8 lg:gap-16 justify-between">
          {/* Logo Section */}
          <div className="flex justify-center md:justify-start">
            <img
              src="/images/Learntorbgg.avif"
              alt="Learntor Logo Footer"
              className="max-h-[10rem] sm:max-h-[14rem] md:max-h-[36rem] lg:max-h-[40rem] w-auto"
            />
          </div>

          {/* Links Section */}
          <div className="flex justify-between w-full px-28 lg:px-60 gap-16">
            {/* Learntor Section */}
            <div>
            <div className="font-semibold text-headline-6 mb-4 sm:text-headline-5 lg:text-headline-4 lg:mb-8 lg:mt-8 relative">
              Learntor
              <div className="absolute left-0 bottom-[-10px] bg-monochrome-200 h-[3px] w-[60px]"></div>
            </div>
              <ul className="mt-8 space-y-2 text-body-small sm:text-body-large lg:text-headline-5 text-monochrome-200">
                {linkItems[0].links.map(({ name, href }) => (
                  <li key={name} className="hover:pl-3 transition-all duration-300 ease-in-out">
                    <Link href={href} className="hover:text-monochrome-50">
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Link for Function Section */}
            <div>
              <div className="font-semibold text-headline-6 mb-4 sm:text-headline-5 lg:text-headline-4 lg:mb-8 lg:mt-8 relative">
                Link For Function
                <div className="absolute left-0 bottom-[-10px] bg-monochrome-200 h-[3px] w-[160px]"></div>
              </div>
                <ul className="space-y-2 text-body-small sm:text-body-large lg:text-headline-5 text-monochrome-200">
                  {linkItems[1].links.map(({ name, href }) => (
                    <li key={name} className="hover:pl-3 transition-all duration-300 ease-in-out">
                      <Link href={href} className="hover:text-monochrome-50">
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          {/* Contact Us Section */}
          <div className="flex flex-col items-center md:items-start lg:mr-6">
              <div className="font-semibold text-headline-6 mb-4 sm:text-headline-5 lg:text-headline-4 lg:mb-8 lg:mt-8 relative">
                Contact Us
                <div className="absolute left-0 bottom-[-10px] bg-monochrome-200 h-[3px] w-[100px]"></div>
              </div>
            <div className="flex space-x-4">
              {socialLinks.map(({ href, imgSrc, alt, ariaLabel }) => (
                <Link
                  key={ariaLabel}
                  href={href}
                  className="bg-monochrome-200 rounded-full flex items-center justify-center h-12 w-12 opacity-50 hover:opacity-100 transition-opacity duration-300"
                  aria-label={ariaLabel}
                >
                  <img
                    src={imgSrc}
                    alt={alt}
                    className="h-8 w-8 object-contain"
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
