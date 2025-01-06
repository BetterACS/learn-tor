import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow"></main>

      <footer className="bg-primary-600 py-6 text-monochrome-50 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between">

          {/* Left Section - Logo */}
          <div className="flex flex-col items-start mb-6 md:mb-0">
            <img
              src="/images/logofooter.png"
              alt="Learntor Logo Footer"
              className="max-h-[20rem] w-auto"
            />
          </div>

          {/* Middle Section */}
          <div className="flex flex-col md:flex-row gap-60">
            {/* Left Column - Learntor Links */}
            <div>
              <h3 className="font-regular text-3xl mb-4">Learntor</h3>
              <ul className="space-y-2 text-xl">
                <li>
                  <Link href="/" className="hover:underline">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:underline">
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:underline">
                    Affiliate Program
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right Column - Function Links */}
            <div className="mt-6 md:mt-0">
              <h3 className="font-regular text-3xl mb-4">Link For Function</h3>
              <ul className="space-y-2 text-xl">
                <li>
                  <Link href="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:underline">
                    TCAS Info
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:underline">
                    Compare Courses
                  </Link>
                </li>
                <li>
                  <Link href="/forum" className="hover:underline">
                    Forum
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:underline">
                    TCAS Calculate
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:underline">
                    Chatbot
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Section - Contact Us */}
          <div className="flex flex-col items-start">
            <h3 className="font-regular text-3xl mb-4">Contact Us</h3>
            <div className="flex space-x-4">
              <Link href="https://www.instagram.com" className="bg-white p-2 rounded-full" aria-label="Instagram">
                <img
                  src="/images/instagram-logo.png"
                  alt="Instagram"
                  className="h-10 w-10"
                />
              </Link>
              <Link href="https://www.facebook.com" className="bg-white p-2 rounded-full" aria-label="Facebook">
                <img
                  src="/images/facebook-logo.png"
                  alt="Facebook"
                  className="h-10 w-10"
                />
              </Link>
              <Link href="https://www.twitter.com" className="bg-white p-2 rounded-full" aria-label="Twitter">
                <img
                  src="/images/twitter-logo.png"
                  alt="Twitter"
                  className="h-10 w-10"
                />
              </Link>
              <Link href="https://www.linkedin.com" className="bg-white p-2 rounded-full" aria-label="LinkedIn">
                <img
                  src="/images/linkedIn-logo.png"
                  alt="LinkedIn"
                  className="h-10 w-10"
                />
              </Link>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Footer;
