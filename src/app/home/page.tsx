'use client';
import { useState } from 'react';
import { Navbar, Footer, UniLogo, FeatureSection } from '@/components/index';

const Section4 = () => {
  const cards = [
    { title: 'วิศวกรรมศาสตร์', imageUrl: '/images/career/eng.avif' },
    { title: 'แพทยศาสตร์', imageUrl: '/images/career/med.avif' },
    { title: 'บริหารธุรกิจ', imageUrl: '/images/career/business.avif' },
    { title: 'วิทยาศาสตร์', imageUrl: '/images/career/science.avif' },
    { title: 'เภสัชศาสตร์', imageUrl: '/images/career/pharmacy.avif' },
    { title: 'ครุศาสตร์', imageUrl: '/images/career/education.avif' },
    { title: 'เทคโนโลยีสารสนเทศ', imageUrl: '/images/career/it.avif' },
    { title: 'นิเทศศาสตร์', imageUrl: '/images/career/comart2.avif' },
    { title: 'นิติศาสตร์', imageUrl: '/images/career/law-4.avif' },
  ];

  interface CardProps {
    title: string;
    imageUrl: string;
  }

  const Card: React.FC<CardProps> = ({ title, imageUrl }) => (
    <div
      className="bg-cover bg-center p-8 rounded-xl opacity-60 hover:opacity-100 hover:scale-105 transform transition duration-300 h-[250px] w-full mx-auto flex items-center justify-center"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="sm:text-headline-5 md:text-headline-4 lg:text-headline-3 font-bold text-monochrome-50 drop-shadow text-center">
        {title}
      </div>
    </div>
  );

  return (
    <div className="bg-primary-600 py-12">
      <div className="container mx-auto text-center px-4 md:px-8 py-16">
        <div className="text-headline-4 font-bold md:text-headline-3 md:font-bold text-monochrome-50 drop-shadow mb-8">
          มาดูกันซิว่าเรามีคณะอะไรกันบ้าง!!
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 px-6 max-w-full overflow-hidden py-10">
          {cards.map((card, index) => (
            <Card key={index} title={card.title} imageUrl={card.imageUrl} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logos = [
    { src: '/images/uni-pic/cu.avif', alt: 'University 1' },
    { src: '/images/uni-pic/tu.avif', alt: 'University 2' },
    { src: '/images/uni-pic/ku.avif', alt: 'University 3' },
    { src: '/images/uni-pic/mu.avif', alt: 'University 4' },
    { src: '/images/uni-pic/su.avif', alt: 'University 5' },
    { src: '/images/uni-pic/swu.avif', alt: 'University 6' },
    { src: '/images/uni-pic/cmu.avif', alt: 'University 7' },
    { src: '/images/uni-pic/kmitl.avif', alt: 'University 8' },
    { src: '/images/uni-pic/kmutnb.avif', alt: 'University 9' },
    { src: '/images/uni-pic/kmutt.avif', alt: 'University 10' },
    { src: '/images/uni-pic/buu.avif', alt: 'University 11' },
    { src: '/images/uni-pic/nmu.avif', alt: 'University 12' },
    { src: '/images/uni-pic/sut.avif', alt: 'University 13' },
    { src: '/images/uni-pic/nu.avif', alt: 'University 14' },
    { src: '/images/uni-pic/mfu.avif', alt: 'University 15' },
    { src: '/images/uni-pic/mju.avif', alt: 'University 16' },
    { src: '/images/uni-pic/up.avif', alt: 'University 17' },
    { src: '/images/uni-pic/kku.avif', alt: 'University 18' },
  ];

  return (
    <div>
      <Navbar />
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between px-6 sm:px-12 md:px-16 lg:px-32 py-16 sm:py-24 lg:py-32 bg-monochrome-50">
        <div className="w-full md:w-1/2 flex justify-center order-1 md:order-2 mb-8 md:mb-0">
          <img
            src="/images/logofooter.avif"
            alt="LearnTor Logo"
            className="w-3/5 sm:w-4/5 md:w-3/4 lg:max-w-[600px] h-auto animate-floatsImage"
          />
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left order-2 md:order-1">
          <div className="text-headline-4 md:text-headline-2 font-bold text-primary-600 mb-4 drop-shadow">
            <strong>ยินดีต้อนรับเข้าสู่ LearnTor</strong>
          </div>
          <div className="sm:text-body-large md:text-headline-5 lg:text-headline-4 text-monochrome-950 mb-6 drop-shadow leading-relaxed">
            Learntor ช่วยให้คุณสามารถเปรียบเทียบหลักสูตรจากมหาวิทยาลัยต่างๆ ได้อย่างง่ายดาย
            โดยพิจารณาจากข้อมูลสำคัญ เครื่องมือคำนวณคะแนน TCAS ที่ช่วยให้คุณทราบโอกาสในการสอบติดในคณะที่คุณต้องการ
            มีฟอรั่มในการพูดคุย แลกเปลี่ยนประสบการณ์ แชร์คำแนะนำเกี่ยวกับการเตรียมตัวสอบและการเลือกคณะและแชตบอตอัจฉริยะ
          </div>
          {!isLoggedIn && (
            <div className="flex sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="/login"
                className="border border-primary-600 text-primary-600 py-3 px-6 rounded-lg text-big-button hover:bg-primary-600 hover:text-white hover:border-whitetransition duration-150"
              >
                Login
              </a>
              <a
                href="/register"
                className="
                  bg-primary-600 text-monochrome-50 border border-primary-600 
                  py-3 px-6 rounded-lg text-big-button 
                  transition duration-150 
                  hover:bg-monochrome-50 hover:text-primary-600 hover:border-primary-600 
                "
              >
                Sign Up
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="bg-primary-600 py-12">
        <div className="container mx-auto text-center px-4 md:px-8 py-16">
          <div className="text-headline-4 px-2 font-bold md:text-headline-3 md:font-bold text-monochrome-50 drop-shadow">
            Learntor มีฟีเจอร์อะไรเพื่อน้องๆบ้าง!!
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-12 md:px-24">
          <div className="mt-4">
            <FeatureSection
              title="Compare Courses"
              description="ช่วยให้คุณสามารถเปรียบเทียบหลักสูตรจากมหาวิทยาลัยต่างๆ ได้อย่างง่ายดาย โดยพิจารณาจากข้อมูลสำคัญ"
              img="/images/feature/compare.avif"
              link="/"
            />
          </div>
          <div className="border-l-2 border-monochrome-50 p-4">
            <FeatureSection
              title="Chatbot"
              description="แชตบอตที่จะสามารถตอบข้อมูลเกี่ยวกับการเรียนต่อที่คุณต้องการได้อย่างรวดเร็วและทันใจ"
              img="/images/feature/chatbot.avif"
              link="/"
            />
          </div>
          <div className="border-0 md:border-l-2 border-monochrome-50 p-4">
            <FeatureSection
              title="TCAS Calculate"
              description="คำนวณคะแนน TCAS ที่ช่วยให้คุณทราบโอกาสในการสอบติดในคณะที่คุณต้องการ"
              img="/images/feature/calculate.avif"
              link="/"
            />
          </div>
          <div className="border-l-2 border-monochrome-50 p-4">
            <FeatureSection
              title="Forum"
              description="ฟอรั่มในการพูดคุยแลกเปลี่ยนประสบการณ์ แชร์คำแนะนำเกี่ยวกับการเตรียมตัวสอบและการเลือกคณะ"
              img="/images/feature/forum.avif"
              link="/forum"
            />
          </div>
        </div>
      </div>

      <div className="bg-monochrome-50 py-12">
        <div className="container mx-auto text-center px-4 md:px-8 py-16">
          <div className="text-headline-4 font-bold md:text-headline-3 md:font-bold text-primary-600 drop-shadow">
            พวกเราข้อมีข้อมูลมหาวิทยาลัยชื่อดังทั่วประเทศไทย
          </div>
          <UniLogo logos={logos} />
        </div>
      </div>
      <Section4 />
      <Footer />
    </div>
  );
}
