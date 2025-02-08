'use client';
import { useState, ChangeEvent } from 'react';

interface CompareSidebarProps {
  onToggleSidebar: (isOpen: boolean) => void;
  onSelectItem: (item: string) => void;
}

const CompareSidebar: React.FC<CompareSidebarProps> = ({ onToggleSidebar }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const mockup_top10popular = [
    { rank: 1, image: 'images/uni-pic/kmutt.avif', detail: 'kmutt วิทยาการคอมพิวเตอร์ประยุกต์', addImage: 'images/uni-pic/add.avif', tuition: 50000 },
    { rank: 2, image: 'images/uni-pic/cu.avif', detail: 'cu คณะแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย', addImage: 'images/uni-pic/add.avif', tuition: 45000 },
    { rank: 3, image: 'images/uni-pic/cu.avif', detail: 'cu สาขา วิศวกรรมศาสตร์คอมพิวเตอร์', addImage: 'images/uni-pic/add.avif', tuition: 35000 },
    { rank: 4, image: 'images/uni-pic/tu.avif', detail: 'tu คณะนิติศาสตร์ มหาวิทยาลัยธรรมศาสตร์', addImage: 'images/uni-pic/add.avif', tuition: 55000 },
    { rank: 5, image: 'images/uni-pic/mu.avif', detail: 'mu คณะแพทยศาสตร์ศิริราชพยาบาล', addImage: 'images/uni-pic/add.avif', tuition: 60000 },
    { rank: 6, image: 'images/uni-pic/ku.avif', detail: 'ku คณะบริหารธุรกิจ การบัญชี', addImage: 'images/uni-pic/add.avif', tuition: 28000 },
    { rank: 7, image: 'images/uni-pic/swu.avif', detail: 'swu วิทยาลัยนวัตกรรม การจัดการการสื่อสาร', addImage: 'images/uni-pic/add.avif', tuition: 30000 },
    { rank: 8, image: 'images/uni-pic/cmu.avif', detail: 'cmu คณะมนุษยศาสตร์ อักษรศาสตร์', addImage: 'images/uni-pic/add.avif', tuition: 40000 },
    { rank: 9, image: 'images/uni-pic/kku.avif', detail: 'kku สาขา วิศวกรรมศาสตร์คอมพิวเตอร์', addImage: 'images/uni-pic/add.avif', tuition: 60000 },
    { rank: 10, image: 'images/uni-pic/kmutnb.avif', detail: 'kmutnb สาขา วิศวกรรมหุ่นยนต์', addImage: 'images/uni-pic/add.avif', tuition: 75000 }
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => setSortOption(e.target.value);

  const sortedData = () => {
    let sortedList = [...mockup_top10popular];
    if (sortOption === 'A-Z') {
      sortedList.sort((a, b) => a.detail.localeCompare(b.detail));
    } else if (sortOption === 'Z-A') {
      sortedList.sort((a, b) => b.detail.localeCompare(a.detail));
    } else if (sortOption === 'low-high') {
      sortedList.sort((a, b) => a.tuition - b.tuition);
    } else if (sortOption === 'high-low') {
      sortedList.sort((a, b) => b.tuition - a.tuition);
    }
    return sortedList;
  };

  const handleToggleSidebar = () => {
    const newSidebarState = !isSidebarOpen;
    setIsSidebarOpen(newSidebarState);
    onToggleSidebar(newSidebarState);
  };

  return (
    <div>
      <div
        className="absolute top-28 left-10 cursor-pointer z-50 flex items-center "
        onClick={handleToggleSidebar}
      >
        <img src="images/feature/hide.avif" alt="Hide Icon" className="w-10 h-10 fixed top-28 left-10 md:hidden lg:hidden" />
      </div>

      <div
        className={`fixed top-20 left-0 ${isSidebarOpen ? 'block' : 'hidden'} w-full sm:w-full md:w-1/2 lg:w-1/4 h-screen bg-white p-4 transition-all duration-300 z-10`}
      >
        <div className="h-[calc(100vh-5.25rem)] w-full max-w-full bg-monochrome-50 sticky overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-monochrome-100 scrollbar-thumb-rounded-md top-[5.25rem] flex flex-col items-center px-6 py-6 border-r-2 border-monochrome-200 mr-0 pt-4 pb-4 z-30">
          <div className="ml-8 w-full flex flex-col py-4 items-start gap-6">
            <p className="w-full text-headline-5">Search your interest</p>
            <div className="w-[95%] flex self-start py-2 px-3 bg-monochrome-100 rounded-md divide-x divide-monochrome-600">
              <input
                type="text"
                className="pl-2 w-full bg-transparent outline-none text-body-large text-monochrome-950 placeholder-monochrome-600 caret-monochrome-600 mr-2 flex-1"
                placeholder="Search here"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button className="w-auto flex items-center justify-center pl-2">
                <img src="/images/uni-pic/search.avif" alt="Search Icon" className="h-8 w-6 object-contain" />
              </button>
            </div>
          </div>

          <div className="ml-8 w-full flex flex-col py-4 items-start gap-6">
            <p className="w-full text-headline-5">Sort by</p>
            <div className="h-fit w-[95%] flex self-start py-2 px-3 bg-monochrome-100 rounded-md divide-x divide-monochrome-600">
              <select
                className="pl-2 w-full bg-transparent outline-none text-body-large text-monochrome-950 caret-monochrome-600 mr-2 flex-1 hover:bg-monochrome-100 focus:bg-monochrome-100 active:bg-monochrome-200 transition duration-150"
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="" disabled>Sort by</option>
                <option value="A-Z">ชื่อมหาวิทยาลัย " ก - ฮ "</option>
                <option value="Z-A">ชื่อมหาวิทยาลัย " ฮ - ก "</option>
                <option value="low-high">ค่าเทอม ต่ำ - สูง</option>
                <option value="high-low">ค่าเทอม สูง - ต่ำ</option>
              </select>
            </div>
          </div>

          <div className="w-full flex flex-col py-6 px-4 last:pb-4 items-start gap-6">
            <p className="text-headline-5">Top 10 Popular</p>
            <div className="flex flex-col pl-4 gap-4 text-body-small">
              {sortedData()
                .filter(item => item.detail.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item) => (
                  <div key={item.rank} className="flex items-center justify-between w-full gap-4">
                    <div className="flex items-center gap-2">
                      <p className="font-regular mr-2">{item.rank}.</p>
                      <img src={item.image} alt={item.detail} className="w-12 h-12 rounded-full mr-2" />
                      <p className="font-regular">{item.detail}</p>
                    </div>
                    <div className="ml-auto">
                      <button className="p-2 bg-monochrome-50 rounded-md hover:bg-monochrome-100 transition">
                        <img src={item.addImage} alt="Add" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompareSidebar;
