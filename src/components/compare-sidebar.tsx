'use client'
import { useState, ChangeEvent, useEffect, useRef, useMemo } from 'react';
import type { University } from '@/db/models';
import { trpc } from '@/app/_trpc/client';
interface CompareSidebarProps {
  onToggleSidebar: (isOpen: boolean) => void;
  onAddToCompare: (item: any) => void;
}

const CompareSidebar: React.FC<CompareSidebarProps> = ({ onToggleSidebar, onAddToCompare }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const mutation = trpc.searchUniversities.useMutation();
  const [universities, setUniversities] = useState<University[]>([]);
  const [error, setError] = useState<string>();
  useEffect(() => {
    mutation.mutate(
      // แก้ตรงนี้
      {
        "sortBy": "institution", //จริงควรใช้ "view_today"
        "order": "asc",
        "limit": 10,
        "page": 1
      },
      {
        onSuccess: (data) => {
          if (data.status !== 200) {
            console.log("Mutation Failed:", data.data);
          } else if (data.status === 200) {
            // console.log("Mutation Success:", data.data);
            if ("universities" in data.data){
              setUniversities(data.data.universities.map((university: any) => ({
                ...university,
                // set logo&image
                logo: '/images/logofooter.avif',
                image: '/images/uni-pic/mock.avif',
              })));}
          }
        },
        onError: (error) => {
          console.error("Mutation Failed:", error);
          setError(error.message);
        },
      }
    )
  },[])

  

  // const mockup_top10popular = [
  //   { rank: 1, logo: 'images/uni-pic/kmutt.avif', major: 'kmutt วิทยาการคอมพิวเตอร์ประยุกต์', addImage: 'images/uni-pic/add.avif', tuition: 50000 },
  //   { rank: 2, logo: 'images/uni-pic/cu.avif', major: 'cu คณะแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย', addImage: 'images/uni-pic/add.avif', tuition: 45000 },
  //   { rank: 3, logo: 'images/uni-pic/cu.avif', major: 'cu สาขา วิศวกรรมศาสตร์คอมพิวเตอร์', addImage: 'images/uni-pic/add.avif', tuition: 35000 },
  //   { rank: 4, logo: 'images/uni-pic/tu.avif', major: 'tu คณะนิติศาสตร์ มหาวิทยาลัยธรรมศาสตร์', addImage: 'images/uni-pic/add.avif', tuition: 55000 },
  //   { rank: 5, logo: 'images/uni-pic/mu.avif', major: 'mu คณะแพทยศาสตร์ศิริราชพยาบาล', addImage: 'images/uni-pic/add.avif', tuition: 61000 },
  //   { rank: 6, logo: 'images/uni-pic/ku.avif', major: 'ku คณะบริหารธุรกิจ การบัญชี', addImage: 'images/uni-pic/add.avif', tuition: 28000 },
  //   { rank: 7, logo: 'images/uni-pic/swu.avif', major: 'swu วิทยาลัยนวัตกรรม การจัดการการสื่อสาร', addImage: 'images/uni-pic/add.avif', tuition: 30000 },
  //   { rank: 8, logo: 'images/uni-pic/cmu.avif', major: 'cmu คณะมนุษยศาสตร์ อักษรศาสตร์', addImage: 'images/uni-pic/add.avif', tuition: 40000 },
  //   { rank: 9, logo: 'images/uni-pic/kku.avif', major: 'kku สาขา วิศวกรรมศาสตร์คอมพิวเตอร์', addImage: 'images/uni-pic/add.avif', tuition: 60000 },
  //   { rank: 10, logo: 'images/uni-pic/kmutnb.avif', major: 'kmutnb สาขา วิศวกรรมหุ่นยนต์', addImage: 'images/uni-pic/add.avif', tuition: 75000 }
  // ];
  const mockup_top10popular = universities.map((university, index) => ({
    rank: index + 1,
    logo: university.logo,
    major: university.institution + ' ' + university.program,
    addImage: '/images/uni-pic/add.avif',
    tuition: university.info.ค่าใข้จ่าย //บางอันเป็น text ผสมเลข บางอันเป็น link ให้กดดู
  }));

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleSortOptionSelect = (option: string) => {
    setSortOption(option);
    setIsDropdownOpen(false);
  };
  // แจ๊คลองอ่านดูคือค่าใช้จ่ายทื่เก็บมาบางทีมันติด text อื่นมาด้วย บางอันก็ไม่เป็นตัวเลขเป็น link ให้กดดู
  const getSortLabel = (option: string) => {
    switch (option) {
      case 'A-Z':
        return "ชื่อมหาลัย “ ก - ฮ “";
      case 'Z-A':
        return "ชื่อมหาลัย “ ฮ - ก “";
      case 'low-high':
        return "ค่าเทอม ต่ำ - สูง";
      case 'high-low':
        return "ค่าเทอม สูง - ต่ำ";
      default:
        return "Sort by";
    }
  };

  const sortedData = useMemo(() => {
    let sortedList = [...mockup_top10popular];
    if (sortOption === 'A-Z') {
      sortedList.sort((a, b) => a.major.localeCompare(b.major));
    } else if (sortOption === 'Z-A') {
      sortedList.sort((a, b) => b.major.localeCompare(a.major));
    }
    // ปิดไว้ก่อน
    // } else if (sortOption === 'low-high') {
    //   sortedList.sort((a, b) => a.tuition - b.tuition);
    // } else if (sortOption === 'high-low') {
    //   sortedList.sort((a, b) => b.tuition - a.tuition);
    // }
    return sortedList;
  }, [sortOption]);

  const handleToggleSidebar = () => {
    const newSidebarState = !isSidebarOpen;
    setIsSidebarOpen(newSidebarState);
    onToggleSidebar(newSidebarState);
  };

  const handleAddClick = (item: any) => {
    setSelectedItems((prevItems) => [...prevItems, item]);
    onAddToCompare(item);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // ปัจจุบันยังไม่มีส่วนที่ render หัวข้อเรื่องตามวันจริงที่พิมพ์ไป
  return (
    <div>
      <div
        className="absolute top-28 left-10 cursor-pointer z-20 flex items-center "
        onClick={handleToggleSidebar}
      >
        <img src="images/feature/hide.avif" alt="Hide Icon" className="w-10 h-10 fixed top-28 left-10 md:hidden lg:hidden" />
      </div>

      <div
        className={`fixed top-20 left-0 ${isSidebarOpen ? 'block' : 'hidden'} w-full sm:w-full md:w-1/2 lg:w-1/4 h-screen bg-monochrome-50 p-4 transition-all duration-300 z-10`}
      >
        <div className="h-[calc(100vh-5.25rem)] w-full max-w-full bg-monochrome-50 sticky overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-monochrome-100 scrollbar-thumb-rounded-md top-[5.25rem] flex flex-col items-center px-6 py-6 sm:border-r-0 md:border-r-2 border-monochrome-200 mr-0 pt-4 pb-4 z-30">
          <div className="ml-8 w-full flex flex-col py-4 items-start gap-6">
            <p className="w-full text-headline-5 text-center sm:text-left">Search your interest</p>
            <div className="w-[95%] flex self-start py-2 px-3 bg-monochrome-100 rounded-md divide-x divide-monochrome-600">
              <input
                type="text"
                className="pl-2 w-full bg-transparent outline-none text-body-large text-monochrome-950 placeholder-monochrome-600 caret-monochrome-600 mr-2 flex-1"
                placeholder="Search here"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button className="w-auto flex items-center justify-center pl-2">
                <img src="/images/uni-pic/search.avif" alt="Search Icon" className="h-8 w-6 object-contain mx-1" />
              </button>
            </div>
          </div>

          <div className="ml-8 w-full flex flex-col py-4 items-start gap-6">
            <p className="w-full text-headline-5">Sort by</p>
            <div className="relative w-[95%]" ref={dropdownRef}>
              <button
                className="w-full flex items-center justify-between py-2 px-3 bg-monochrome-100 rounded-md text-body-large caret-monochrome-600 hover:bg-monochrome-100 focus:bg-monochrome-100 active:bg-monochrome-200 transition duration-150"
                onClick={handleDropdownToggle}
              >
                <span className={`ml-2 py-1 ${sortOption ? 'text-monochrome-950' : 'text-monochrome-600'}`}>
                  {getSortLabel(sortOption)}
                </span>
                <div className="flex items-center">
                  <div className="border-r-2 border-monochrome-300 h-8 mr-3"></div>
                  <svg className="h-6 w-6 text-monochrome-600 object-contain" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              <div className={`absolute left-0 w-full mt-1 bg-monochrome-50 rounded-md shadow-lg ${isDropdownOpen ? 'block' : 'hidden'}`}>
                <ul className="flex flex-col divide-y divide-monochrome-200">
                  <li>
                    <button
                      className="w-full py-2 px-3 text-left text-body-large text-monochrome-950 mx-3 my-2 hover:bg-monochrome-100 focus:bg-monochrome-100 transform transition-all duration-200 hover:scale-105"
                      onClick={() => handleSortOptionSelect('A-Z')}
                    >
                      ชื่อมหาลัย “ ก - ฮ “
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full py-2 px-3 text-left text-body-large text-monochrome-950 mx-3 my-2 hover:bg-monochrome-100 focus:bg-monochrome-100 transform transition-all duration-200 hover:scale-105"
                      onClick={() => handleSortOptionSelect('Z-A')}
                    >
                      ชื่อมหาลัย “ ฮ - ก “
                    </button>
                  </li>
                  <li>
                    <button 
                      className="w-full py-2 px-3 text-left text-body-large text-monochrome-950 mx-3 my-2 hover:bg-monochrome-100 focus:bg-monochrome-100 transform transition-all duration-200 hover:scale-105"
                      onClick={() => handleSortOptionSelect('low-high')}
                    >
                      ค่าเทอม ต่ำ - สูง
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full py-2 px-3 text-left text-body-large text-monochrome-950 mx-3 my-2 hover:bg-monochrome-100 focus:bg-monochrome-100 transform transition-all duration-200 hover:scale-105"
                      onClick={() => handleSortOptionSelect('high-low')}
                    >
                      ค่าเทอม สูง - ต่ำ
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col py-6 px-4 last:pb-4 items-start gap-6">
            <p className="text-headline-5">Top 10 Popular</p>
            <div className="flex flex-col pl-1 gap-4 text-body-small">
              {sortedData
                .filter(item => item.major.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item, index) => (
                  <div key={item.rank} className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-4">
                      <p className="font-regular mr-1">{index + 1}.</p>
                      <img className="w-10 h-10 rounded-full object-cover" src={item.logo} alt="Uni Logo" />
                      <p className="text-monochrome-950">{item.major}</p>
                    </div>
                    <button
                      className="flex items-center justify-center bg-monochrome-50 hover:bg-monochrome-200 rounded-md p-2"
                      onClick={() => handleAddClick(item)}
                    >
                      <img className="w-5 h-5 object-contain" src={item.addImage} alt="Add Button" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareSidebar;