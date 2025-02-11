'use client';
import { Navbar, CompareSidebar, InfoCard, AlertBox } from '@/components/index';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isCompareListOpen, setIsCompareListOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [universities, setUniversities] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/university');
        const data = await response.json();
        setUniversities(data.map((university: any) => ({
          ...university,
          // set logo&image
          logo: '/images/logofooter.avif',
          image: '/images/uni-pic/mock.avif',
        })));
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddToCompare = (item: any) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.length < 3 && !prevSelectedItems.some(selected => selected.university === item.university)) {
        return [...prevSelectedItems, item];
      }
      return prevSelectedItems;
    });
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      return prevSelectedItems.filter((_, i) => i !== index);
    });
  };

  const handleToggleSidebar = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  const handleToggleCompareList = () => {
    setIsCompareListOpen(!isCompareListOpen);
  };

  const handleCompare = () => {
    if (selectedItems.length >= 1 && selectedItems.length <= 3) {
      const query = selectedItems.map((item, i) => `uni${i}=${encodeURIComponent(item.university)}`).join('&');
      router.push(`/compare-result?${query}`);
    } else {
      setAlertMessage("Please select at least one university.");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="sm:w-full md:w-1/2 lg:w-1/4">
          <CompareSidebar
            onToggleSidebar={handleToggleSidebar}
            onAddToCompare={handleAddToCompare}
          />
        </div>
        {alertMessage && (
          <AlertBox
            alertType="info"
            title="Info Message"
            message={alertMessage}
          />
        )}
        <div className="lg:w-3/4 p-6 ml-6">
          <p className="text-headline-4 mr-5 mb-4">Compare Universities List</p>

          <div className="grid sm:grid-cols-1 md:grid-cols-1 gap-6 lg:grid-cols-2">
            {universities.map((university, index) => (
              <InfoCard
                key={index}
                institution={university.name}
                faculty={university.faculty}
                program={university.major}
                logo={university.logo}
                image={university.image}
                rounds={university.rounds}
                onAddToCompare={handleAddToCompare}
              />
            ))}
          </div>

          <div className="fixed bottom-4 right-4 flex flex-col items-end">
            <div
              className={`bg-primary-700 text-monochrome-50 p-4 rounded-lg shadow-lg cursor-pointer w-[370px] transition-all duration-300 ${isCompareListOpen ? 'translate-y-[-165px] z-10' : 'translate-y-0'}`}
              onClick={handleToggleCompareList}
            >
              <div className="flex items-center justify-between">
                <p className="text-headline-6 text-monochrome-50 sm:text-headline-5">
                  Compare List ({selectedItems.length})
                </p>
                <svg
                  className={`h-6 w-6 text-monochrome-50 transition-transform ${isCompareListOpen ? '' : 'rotate-180'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div
              className={`absolute h-[170px] bottom-0 right-0 bg-monochrome-50 p-4 shadow-lg rounded-b-lg w-[360px] overflow-hidden transition-all duration-300 ${isCompareListOpen ? 'translate-y-0 opacity-100' : 'translate-y-[70px] opacity-0 pointer-events-none'}`}
            >
              {selectedItems.length > 0 ? (
                selectedItems.map((item, index) => (
                  <div key={index} className="mt-4 flex text-body-large items-center justify-between">
                    <div className="flex items-center">
                      <img src={item.logo} alt={item.university} className="h-8 w-8 mr-4" />
                      <span>{item.major}</span>
                    </div>
                    <button onClick={() => handleRemoveItem(index)}>
                      <img src="/images/uni-pic/cancel.avif" alt="remove" className="h-6 w-6" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="mt-12 text-center text-monochrome-500">
                  ไม่มีรายการที่เลือก.. <br />
                  ( เลือกได้สูงสุด 3 รายการ )
                </p>
              )}
              <div className="border-t border-monochrome-300 absolute bottom-16 left-2 right-2"></div>
              <button
                className="absolute bottom-4 right-4 bg-primary-600 text-monochrome-50 py-2 px-4 rounded-lg hover:bg-primary-700 transition-all"
                onClick={handleCompare}
              >
                Compare
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
