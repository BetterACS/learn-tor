'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/index';
import { trpc } from '@/app/_trpc/client';

interface AddTagPopupProps {
  isPopupOpen: boolean;
  setIsPopupOpen: (isPopupOpen: boolean) => void;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function AddTagPopup({ isPopupOpen, setIsPopupOpen, tags, setTags }: AddTagPopupProps) {
  // const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  // const [selectedTags, setSelectedTags] = useState<string[]>([]);
  // const [tagList, setTagList] = useState<Record<"ทั่วไป" | "มหาวิทยาลัย" | "คณะ", string[]>>({
  //   "ทั่วไป": ["TCAS", "Portfolio", "แนะนำคณะและมหาวิทยาลัย", "การเตรียมตัวสอบ"],
  //   "มหาวิทยาลัย": [
  //     "เกษตรศาสตร์",
  //     "ธรรมศาสตร์",
  //     "จุฬาลงกรณ์",
  //     "ลาดกระบัง",
  //     "มหิดล",
  //     "พระจอมเกล้าธนบุรี",
  //     "ศรีนคริทรวิโรฒ",
  //     "พระนครเหนือ",
  //     "เชียงใหม่",
  //     "แม่โจ้",
  //     "สงขลานครินทร์",
  //     "วลัยลักษณ์",
  //     "แม่ฟ้าหลวง",
  //     "บูรพา",
  //     "พะเยา",
  //     "สุโขทัยธรรมาธิราช",
  //     "มหาสารคาม",
  //     "อุบลราชธานี",
  //     "รามคําแหง"
  //   ],
  //   "คณะ": [
  //     "แพทยฯ",
  //     "เภสัชฯ",
  //     "พยาบาลฯ",
  //     "วิศวฯ",
  //     "สถาปัตย์ฯ",
  //     "วิทยาฯ",
  //     "อักษรฯ - มนุษยฯ",
  //     "บัญชี - บริหาร",
  //     "ครุฯ - ศึกษาฯ",
  //     "ทันตะฯ",
  //     "สหเวชฯ",
  //     "จิตวิทยา",
  //     "นิเทศฯ",
  //     "นิติฯ",
  //     "รัฐฯ-สังคมฯ",
  //     "ศิลปกรรมฯ"
  //   ],
  // });

  const { data: tagArray, isLoading, isError } = trpc.getTags.useQuery();

  const [tagList, setTagList] = useState<Record<"ทั่วไป" | "มหาวิทยาลัย" | "คณะ", string[]>>({
    "ทั่วไป": [],
    "มหาวิทยาลัย": [],
    "คณะ": []
  });
  // console.log(tagArray)

  useEffect(() => {
    if (tagArray) {
      setTagList(tagArray);
    }
  }, [tagArray]);



  const [newTag, setNewTag] = useState<{ [key in keyof typeof tagList]?: string }>({});
  const [activeCategory, setActiveCategory] = useState<keyof typeof tagList | null>(null);

  const popupRef = useRef<HTMLDivElement | null>(null);

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(e.target.value);
  // };

  // const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter' && searchTerm.trim()) {
  //     const query = JSON.stringify(selectedTags);
  //     router.push(`/forum/search/${encodeURIComponent(searchTerm)}?query=${encodeURIComponent(query)}`);
  //     setIsPopupOpen(false);
  //   }
  // };

  // Handle icon click to search
  // const handleSearch = () => {
  //   const query = JSON.stringify(selectedTags);
  //   router.push(`/forum/search/${encodeURIComponent(searchTerm)}?query=${encodeURIComponent(query)}`);
  //   setIsPopupOpen(false);
  //   setSearchTerm('');
  // };

  // Handle pressing enter to search
  // const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter') {
  //     handleSearch();
  //   }
  // };

  const handleAddTag = (category: keyof typeof tagList) => {
    if (newTag[category]?.trim()) {
      setTagList((prev) => ({
        ...prev,
        [category]: [...prev[category], newTag[category]!.trim()],
      }));
      setNewTag((prev) => ({ ...prev, [category]: "" }));
    }
    setActiveCategory(null);
  };

  const toggleTagSelection = (tag: string) => {
    setTags((prevTags: string[]) => 
      prevTags.includes(tag) 
        ? prevTags.filter((t) => t !== tag) // Remove if present
        : [...prevTags, tag] // Add if not present
    );
  };

  // Handle clicks outside to close the popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsPopupOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsPopupOpen]);

  const handleAddClick = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="fixed w-screen h-screen top-0 right-0 backdrop-filter backdrop-brightness-75 backdrop-blur-[2px] z-10">
      <div
        ref={popupRef}
        className="h-fit w-[calc(100%-260px)] ml-[250px] mt-[5.5rem] flex flex-col gap-3 items-center justify-center z-20"
      >
        {/* Body */}
        <div className="w-[65%] h-fit bg-monochrome-50 rounded-md py-3 px-3 flex flex-col gap-2">
          {/* Selected tag display area */}
          {tags.length > 0 &&
          <div className="flex gap-2 items-center">
            <p>Selected Tags:</p>
            <div className="flex gap-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className={`text-body-1 border border-green-600
                  rounded-[1rem] px-3 py-2`}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          }
          {/* Search tag area */}
          <div className="h-fit w-full flex py-2 px-3 bg-monochrome-100 rounded-md divide-x divide-monochrome-600">
            <input
              type="text"
              className="w-full bg-transparent outline-none text-body-large text-monochrome-950 placeholder-monochrome-600 caret-monochrome-600 mr-2 flex-1"
              placeholder="Search tag here"
            />
            <button className="w-auto pl-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="18px"
              >
                <path
                  d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
                  className="fill-monochrome-600"
                />
              </svg>
            </button>
          </div>
          {/* Tag display area */}
          {Object.entries(tagList).map(([category, allTags]) => (
            <div key={category} className="mb-4 divide-y divide-monochrome-300">
              {/* Category Title */}
              <h3 className="text-headline-6">{category}</h3>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-3 items-center">
                {allTags.map((tagName) => (
                  <span
                    key={tagName}
                    onClick={() => toggleTagSelection(tagName)}
                    className={`text-body-1 border ${
                      tags.includes(tagName) 
                      ? 
                      'border-green-600' : 'border-monochrome-500'
                    } rounded-[1rem] px-3 py-2 cursor-pointer`}
                  >
                    {tagName}
                  </span>
                ))}
                {activeCategory === category ? (
                  <input
                    type="text"
                    value={newTag[category as keyof typeof tagList] || ""}
                    onChange={(e) =>
                      setNewTag((prev) => ({
                        ...prev,
                        [category]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddTag(category as keyof typeof tagList);
                    }}
                    onBlur={() => setActiveCategory(null)} // Close input on blur/loose focus
                    className="text-body-1 text-monochrome-600 border border-monochrome-400 rounded-[1rem] px-3 py-2 outline-none"
                    placeholder="New tag"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => setActiveCategory(category as keyof typeof tagList)}
                    className="text-headline-6 px-2 py-2"
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="h-fit w-full flex justify-end p-2">
            <Button button_name="Add" variant="primary" onClick={handleAddClick}/>
          </div>
        </div>
      </div>
    </div>
  );
}
