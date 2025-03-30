'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';

interface SearchPopupProps {
  isPopupOpen: boolean;
  setIsPopupOpen: (isPopupOpen: boolean) => void;
  setSearchTerm: (searchTerm: string) => void;
  searchTerm: string;
};

type Tag = {
  tagname: string;
  count: number;
}

export default function SearchPopup({ isPopupOpen, setIsPopupOpen,  setSearchTerm, searchTerm }: SearchPopupProps) {
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<{ [key: string]: 'included' | 'excluded' }>({});
  const [tagList, setTagList] = useState<Record<string, Tag[]>>({});
  const popupRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isError } = trpc.getSearchTags.useQuery({ 
    query: tagSearchTerm
  });
  
  useEffect(() => {
    if (isLoading) return;
    console.log(data);
    setTagList(data);
  }, [isLoading, data]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTagSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagSearchTerm(e.target.value);
  };

  // const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter' && searchTerm.trim()) {
  //     const query = JSON.stringify(selectedTags);
  //     router.push(`/forum/search/${encodeURIComponent(searchTerm)}?query=${encodeURIComponent(query)}`);
  //     setIsPopupOpen(false);
  //   }
  // };

  // Handle icon click to search
  const handleSearch = () => {
    const query = JSON.stringify(selectedTags);
    router.push(`/forum/search/${encodeURIComponent(searchTerm)}?query=${encodeURIComponent(query)}`);
    setIsPopupOpen(false);
    setSearchTerm('');
  };

  // Handle pressing enter to search
  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleTagSelection = (tag: string) => {
    setSelectedTags((prev) => {
      if (!prev[tag]) return { ...prev, [tag]: 'included' };
      if (prev[tag] === 'included') return { ...prev, [tag]: 'excluded' };
      const { [tag]: _, ...rest } = prev;
      return rest;
    });
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

  return (
    <div className="fixed w-screen h-screen top-0 right-0 backdrop-filter backdrop-brightness-75 backdrop-blur-[2px] z-10">
      <div
        // ref={popupRef}
        className="h-fit w-[calc(100%-260px)] ml-[250px] mt-[5.5rem] z-20 flex justify-center"
      >
        <div ref={popupRef} className="h-full w-[65%] flex flex-col gap-3 items-center justify-center">
          {/* Search area */}
          <div className="h-fit w-full flex py-2 px-3 bg-monochrome-50 rounded-md divide-x divide-monochrome-600">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearchSubmit}
              className="w-full bg-transparent outline-none text-body-large text-monochrome-950 placeholder-monochrome-600 caret-monochrome-600 mr-2 flex-1"
              placeholder="Search here"
            />
            <button onClick={handleSearch} className="w-auto pl-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="18px"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" className="fill-monochrome-600"/>
              </svg>
              <div onClick={(e) => {e.stopPropagation(); setIsPopupOpen(false);}}>
                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path className="fill-monochrome-600" d="M3 4.5A1.5 1.5 0 0 1 4.5 3h15A1.5 1.5 0 0 1 21 4.5v2.086A2 2 0 0 1 20.414 8L15 13.414v7.424a1.1 1.1 0 0 1-1.592.984l-3.717-1.858A1.25 1.25 0 0 1 9 18.846v-5.432L3.586 8A2 2 0 0 1 3 6.586zM5 5v1.586l5.56 5.56a1.5 1.5 0 0 1 .44 1.061v5.175l2 1v-6.175c0-.398.158-.78.44-1.06L19 6.585V5z"></path></g></svg>
              </div>
            </button>
          </div>

          {/* Body */}
          <div className="w-full h-[80vh] overflow-y-auto bg-monochrome-50 rounded-md pb-3 flex flex-col gap-4">
            <div className="sticky top-0 flex flex-col gap-2 p-3 px-3 bg-monochrome-50 border-b">
              {/* Selected tag display area */}
              {Object.keys(selectedTags).length > 0 &&
              <div className="flex gap-2 items-center">
                <p>Selected Tags:</p>
                <div className="flex gap-2">
                  {Object.entries(selectedTags).map(([tag, status]) => (
                    <div
                      key={tag}
                      className={`text-body-1 ${
                        status === 'included' ? 'bg-green-600' : 'bg-red-600'
                      } rounded-[1rem] px-3 py-2`}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
              }
              {/* Search tag area */}
              <div className="h-fit w-full flex py-2 px-3 bg-monochrome-100 rounded-md">
                <div className="w-auto pr-2">
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
                </div>
                <input
                  type="text"
                  className="w-full bg-transparent outline-none text-body-large text-monochrome-950 placeholder-monochrome-600 caret-monochrome-600 mr-2 flex-1"
                  placeholder="Search tag here"
                  onChange={handleTagSearchChange}
                  value={tagSearchTerm}
                />
              </div>
            </div>
            {/* Tag display area */}
            {tagList && Object.entries(tagList).map(([category, tags], index) => (
              <div key={index} className="mb-2 divide-y divide-monochrome-300 px-3">
                {/* Category Title */}
                <h3 className="text-headline-6">{category}</h3>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-3 items-center">
                  {tags?.map(({tagname, count}, index) => (
                    <div
                      key={index}
                      onClick={() => toggleTagSelection(tagname)}
                      className={`text-body-1 ${
                        selectedTags[tagname] === 'included'
                          ? 'border-green-600 border-2'
                          : selectedTags[tagname] === 'excluded'
                          ? 'border-red-600 border-2'
                          : 'border-monochrome-500 border'
                      } rounded-[1rem] cursor-pointer flex gap-2 items-center`}
                    >
                      <p className="ml-3">{tagname}</p>
                      <p className="py-2 px-3 h-full rounded-r-[1rem] bg-monochrome-100 font-normal text-monochrome-600">{count}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
