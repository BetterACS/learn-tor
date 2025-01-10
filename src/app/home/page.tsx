'use client'; 
import { useState } from 'react';
import { PreLoginNavbar, Navbar, Footer, UniLogo, FeatureSection } from '@/components/index';

const Section4 = () => {
  const cards = [
    { title: 'วิศวกรรมศาสตร์', imageUrl: '/images/career/eng.png' },
    { title: 'แพทยศาสตร์', imageUrl: '/images/career/med.png' },
    { title: 'บริหารธุรกิจ', imageUrl: '/images/career/business.png' },
    { title: 'วิทยาศาสตร์', imageUrl: '/images/career/science.png' },
    { title: 'เภสัชศาสตร์', imageUrl: '/images/career/pharmacy.png' },
    { title: 'ครุศาสตร์', imageUrl: '/images/career/education.png' }
  ];

  interface CardProps {
    title: string;
    imageUrl: string;
  }

  const Card: React.FC<CardProps> = ({ title, imageUrl }) => (
    <div
      className="bg-cover bg-center p-8 rounded-xl opacity-80  h-[200px] w-full sm:w-[500px] mx-auto flex items-center justify-center"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="text-headline-3 font-bold text-monochrome-50 drop-shadow text-center">
        {title}
      </div>
    </div>
  );

  return (
    <div className="bg-primary-600 py-12">
      <div className="container mx-auto text-center px-4 md:px-8 py-16">
        <div className="text-headline-3 font-bold text-monochrome-50 drop-shadow mb-8">
          มาดูกันซิว่าเรามีคณะอะไรกันบ้าง!!
        </div>
        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
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
    { src: '/images/uni-pic/cu.png', alt: 'University 1' },
    { src: '/images/uni-pic/tu.png', alt: 'University 2' },
    { src: '/images/uni-pic/ku.png', alt: 'University 3' },
    { src: '/images/uni-pic/mu.png', alt: 'University 4' },
    { src: '/images/uni-pic/su.png', alt: 'University 5' },
    { src: '/images/uni-pic/swu.png', alt: 'University 6' },
    { src: '/images/uni-pic/cmu.png', alt: 'University 7' },
    { src: '/images/uni-pic/kmitl.png', alt: 'University 8' },
    { src: '/images/uni-pic/kmutnb.png', alt: 'University 9' },
    { src: '/images/uni-pic/kmutt.png', alt: 'University 10' },
    { src: '/images/uni-pic/buu.png', alt: 'University 11' },
    { src: '/images/uni-pic/nmu.png', alt: 'University 12' },
    { src: '/images/uni-pic/sut.png', alt: 'University 13' },
    { src: '/images/uni-pic/nu.png', alt: 'University 14' },
    { src: '/images/uni-pic/mfu.png', alt: 'University 15' },
    { src: '/images/uni-pic/mju.png', alt: 'University 16' },
    { src: '/images/uni-pic/up.png', alt: 'University 17' },
    { src: '/images/uni-pic/kku.png', alt: 'University 18' },
  ];

  return (
    <div>
      {isLoggedIn ? <Navbar /> : <PreLoginNavbar />}

      {/* Section 1 */}
      <div className="flex flex-col md:flex-row items-center justify-between px-16 md:px-32 py-16 bg-white">
        <div className="md:w-1/2">
          <div className="text-headline-2 font-light text-primary-600 mb-4 drop-shadow">
            ยินดีต้อนรับเข้าสู่ LearnTor
          </div>
          <div className="text-headline-4 text-monochrome-950 mb-6 drop-shadow">
            Learntorช่วยให้คุณสามารถเปรียบเทียบหลักสูตรจากมหาวิทยาลัยต่างๆ ได้อย่างง่ายดาย โดยพิจารณาจากข้อมูลสำคัญ
            เครื่องมือคำนวณคะแนน TCAS ที่ช่วยให้คุณทราบโอกาสในการสอบติดในคณะที่คุณต้องการ มีฟอรั่มในการพูดคุย
            แลกเปลี่ยนประสบการณ์ แชร์คำแนะนำเกี่ยวกับการเตรียมตัวสอบและการเลือกคณะและแชตบอตอัจฉริยะ
          </div>
          {!isLoggedIn && (
            <div className="flex gap-4">
              <a
                href="/login"
                className="border border-primary-600 text-primary-600 py-3 px-6 rounded-lg text-big-button hover:bg-monochrome-100 transition duration-150"
              >
                Login
              </a>
              <a
                href="/register"
                className="bg-primary-600 text-monochrome-50 py-3 px-6 rounded-lg text-big-button hover:bg-primary-700 transition duration-150"
              >
                Sign Up
              </a>
            </div>
          )}
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img
            src="/images/logofooter.png"
            alt="LearnTor Logo"
            className="max-w-[160%] h-auto"
          />
        </div>
      </div>

      {/* Section 2 */}
      <div className="bg-primary-600 py-12">
        <div className="container mx-auto text-center px-4 md:px-8 py-16">
          <div className="text-headline-3 font-bold text-monochrome-50 drop-shadow">
            Learntor มีฟีเจอร์อะไรเพื่อน้องๆบ้าง!!
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-12 md:px-24">
          <div>
            <FeatureSection
              title="Compare Courses"
              description="ช่วยให้คุณสามารถเปรียบเทียบหลักสูตรจากมหาวิทยาลัยต่างๆ ได้อย่างง่ายดาย โดยพิจารณาจากข้อมูลสำคัญ"
              img="/images/feature/compare.png"
              link="/"
            />
          </div>
          <div className="border-l-2 border-white p-4">
            <FeatureSection
              title="Chatbot"
              description="แชตบอตที่จะสามารถตอบข้อมูลเกี่ยวกับการเรียนต่อที่คุณต้องการได้อย่างรวดเร็วและทันใจ"
              img="/images/feature/chatbot.png"
              link="/"
            />
          </div>
          <div className="border-l-2 border-white p-4">
            <FeatureSection
              title="TCAS Calculate"
              description="คำนวณคะแนน TCAS ที่ช่วยให้คุณทราบโอกาสในการสอบติดในคณะที่คุณต้องการ"
              img="/images/feature/calculate.png"
              link="/"
            />
          </div>
          <div className="border-l-2 border-white p-4">
            <FeatureSection
              title="Forum"
              description="ฟอรั่มในการพูดคุยแลกเปลี่ยนประสบการณ์ แชร์คำแนะนำเกี่ยวกับการเตรียมตัวสอบและการเลือกคณะ"
              img="/images/feature/forum.png"
              link="/forum"
            />
          </div>
        </div>
      </div>

      {/* Section 3 */}
      <div className="bg-white py-12">
        <div className="container mx-auto text-center px-4 md:px-8 py-16">
          <div className="text-headline-3 font-bold text-primary-600 drop-shadow">
            พวกเราข้อมีข้อมูลมหาวิทยาลัยชื่อดังทั่วประเทศไทย
          </div>
          <UniLogo logos={logos} />
        </div>
      </div>

      {/* Section 4 */}
      <Section4 />

      <Footer />
    </div>
  );
}