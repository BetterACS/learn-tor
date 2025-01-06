'use client';
import Link from 'next/link';
import { Carousel } from '@/components/index';

export default function Home() {

  const mockup_faculty = [
    "แพทยฯ",
    "เภสัชฯ",
    "พยาบาลฯ",
    "วิศวฯ",
    "สถาปัตย์ฯ",
    "วิทยาฯ",
    "อักษรฯ - มนุษยฯ",
    "บัญชี - บริหาร",
    "ครุฯ - ศึกษาฯ",
    "ทันตะฯ",
    "สหเวชฯ",
    "จิตวิทยา",
    "นิเทศฯ",
    "นิติฯ",
    "รัฐฯ-สังคมฯ",
    "ศิลปกรรมฯ"
  ];

  const mockup_universities = [
    "เกษตรศาสตร์",
    "ธรรมศาสตร์",
    "จุฬาลงกรณ์",
    "ลาดกระบัง",
    "มหิดล",
    "พระจอมเกล้าธนบุรี",
    "ศรีนคริทรวิโรฒ",
    "พระนครเหนือ",
    "เชียงใหม่",
    "แม่โจ้",
    "สงขลานครินทร์",
    "วลัยลักษณ์",
    "แม่ฟ้าหลวง",
    "บูรพา",
    "พะเยา",
    "สุโขทัยธรรมาธิราช",
    "มหาสารคาม",
    "อุบลราชธานี",
    "รามคําแหง"
  ];

  const carousel_items = [
    {
      id: 1,
      img: "http://i.ibb.co/ncrXc2V/1.png",
      title: "หนูอยากยื่นมศว.ค่ะ ช่วยดูและแนะนำให้หน่อยได้ไหมคะ 1"
    },
    {
      id: 2,
      img: "http://i.ibb.co/B3s7v4h/2.png",
      title: "หนูอยากยื่นมศว.ค่ะ ช่วยดูและแนะนำให้หน่อยได้ไหมคะ 2"
    },
    {
      id: 3,
      img: "http://i.ibb.co/XXR8kzF/3.png",
      title: "หนูอยากยื่นมศว.ค่ะ ช่วยดูและแนะนำให้หน่อยได้ไหมคะ 3"
    },
    {
      id: 4,
      img: "http://i.ibb.co/yg7BSdM/4.png",
      title: "หนูอยากยื่นมศว.ค่ะ ช่วยดูและแนะนำให้หน่อยได้ไหมคะ 4"
    },
  ]

  return (
    <div className="h-full w-full flex flex-col items-center text-center gap-10">
      <div className="flex flex-col w-[90%] gap-6">
        <p className="text-headline-4 text-primary-600 font-bold text-balance">
          ค้นหาหัวข้อการพูดคุยที่คุณสนใจได้ที่นี่เลย!!
        </p>
        <div className="h-fit w-[80%] flex self-center py-2 px-3 bg-monochrome-100 rounded-md divide-x divide-monochrome-600">
          <input type="text" className="w-full bg-transparent outline-none text-body-large text-monochrome-950 placeholder-monochrome-600 caret-monochrome-600s mr-2 flex-1" placeholder="Search here" />
          <button className="w-auto pl-2">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="18px"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" className="fill-monochrome-600"/></svg>
          </button>
        </div>    
      </div>
      <div className="w-full self-start flex flex-col gap-4">
        <div className="w-fit border-b-4 border-primary-600">
          <p className="text-headline-4 text-primary-600 py-1">
            Portfolio Topic
          </p>
        </div>
        {/* Carosal */}
        <div className="w-auto h-fit">
          <Carousel carousel_items={carousel_items} />
        </div>
      </div>
      <div className="w-full h-fit flex gap-[12%]">
        {/* Left รีวิวคณะ */}
        <div className="relative flex flex-1 flex-col gap-4 overflow-hidden">
          <div className="flex">
            <div className="flex w-fit border-b-4 border-primary-600">
              <p className="text-headline-4 text-nowrap text-primary-600 py-1">
                รีวิวคณะ
              </p>
            </div>
            <div className="flex flex-auto border-b-2 border-monochrome-300 mb-[1px]"></div>
          </div>

          <div className="w-full h-fit flex flex-wrap gap-2">
            {mockup_faculty.map((key) => (
              <button key={key} className="w-fit h-fit border border-monochrome-600 rounded-[1rem] py-2 px-3 hover:bg-primary-600 hover:border-primary-600 transform duration-200 group">
                <p className="text-monochrome-600 group-hover:text-monochrome-50">{key}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right รีวิวมหาวิทยาลัย */}
        <div className="relative flex flex-1 flex-col gap-4 overflow-hidden">
          <div className="flex">
            <div className="flex w-fit border-b-4 border-primary-600">
              <p className="text-headline-4 text-nowrap text-primary-600 py-1">
                รีวิวมหาวิทยาลัย
              </p>
            </div>
            <div className="flex flex-auto border-b-2 border-monochrome-300 mb-[1px]"></div>
          </div>

          <div className="w-full h-fit flex flex-wrap gap-2">
            {mockup_universities.map((key) => (
              <button key={key} className="w-fit h-fit border border-monochrome-600 rounded-[1rem] py-2 px-3 hover:bg-primary-600 hover:border-primary-600 transform duration-200 group">
                <p className="text-monochrome-600 group-hover:text-monochrome-50">{key}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}