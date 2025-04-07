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
  category: string;
  count?: number;
}

type TagWState = {
  tagname: string;
  category: string;
  state: 'included' | 'excluded';
}

export default function SearchPopup({ isPopupOpen, setIsPopupOpen, setSearchTerm, searchTerm }: SearchPopupProps) {
  const TAG_LIMIT = 20;
  const CATEGORY_ORDER = ["ทั่วไป", "คณะ", "มหาวิทยาลัย"];

  const router = useRouter();
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  // const [selectedTags, setSelectedTags] = useState<{ [tagname: string]: 'included' | 'excluded' }>({});
  const [selectedTags, setSelectedTags] = useState<TagWState[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [tagList, setTagList] = useState<Record<string, Tag[]>>({});
  const popupRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isError } = trpc.getSearchTags.useQuery({ 
    query: tagSearchTerm
  });
  
  useEffect(() => {
    if (isLoading) return;
    if (data) {
      const ordered = CATEGORY_ORDER.reduce((acc, key) => {
        if (data[key]) acc[key] = data[key];
        return acc;
      }, {} as Record<string, Tag[]>);
      
      setTagList(ordered);
    }
  }, [isLoading, data]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTagSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagSearchTerm(e.target.value);
  };

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

  const toggleTagSelection = (tagname: string, category: string) => {
    setSelectedTags((prev = []) => {
      const existing = prev.find(
        (tag) => tag.tagname === tagname && tag.category === category
      );
  
      if (!existing) {
        return [...prev, { tagname, category, state: 'included' }];
      }
      if (existing.state === 'included') {
        return prev.map((tag) =>
          tag.tagname === tagname && tag.category === category
            ? { ...tag, state: 'excluded' }
            : tag
        );
      }
      if (existing.state === 'excluded') {
        return prev.filter(
          (tag) => !(tag.tagname === tagname && tag.category === category)
        );
      }
      return prev;
    });
  };
  

  const handleRemoveSelectedTag = (tagname: string, category: string) => {
    const updatedTags = selectedTags.filter(tag => !(tag.tagname === tagname && tag.category === category));
    setSelectedTags(updatedTags);
  };

  // Handle clicks outside to close the popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsPopupOpen(false);
        setSelectedTags([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsPopupOpen]);

  return (
    <div className={`fixed w-screen h-screen top-0 right-0 backdrop-filter backdrop-brightness-75 backdrop-blur-[2px] z-20 ${isPopupOpen ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-100`}>
      <div
        // ref={popupRef}
        className={`h-full w-full ml-0 mt-[3.1rem] pb-[2rem] z-20 flex justify-center ${isPopupOpen ? 'scale-100' : 'scale-90'} transition-transform duration-100`}
      >
        <div ref={popupRef} className="w-[90%] h-full px-4 flex flex-col gap-3 items-center justify-center">
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
          <div className="w-full h-[calc(100%-9rem)] overflow-y-auto bg-monochrome-50 rounded-md pb-3 flex flex-col gap-2">
            <div className="sticky top-0 flex flex-col gap-2 p-4 px-5 bg-monochrome-50 border-b">
              {/* Selected tag display area */}
              {selectedTags.length > 0 &&
              <div className="flex flex-col gap-1 text-nowrap">
                <p className="text-body-large font-medium self-start mt-2">Selected Tags</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedTags.map(({ tagname, category, state }, index) => (
                    <div
                      key={index}
                      onClick={() => handleRemoveSelectedTag(tagname, category)}
                      className={`text-body-1 ${
                        state === 'included' ? 'bg-green-600' : 'bg-red-600'
                      } rounded-[1rem] px-3 py-2 group hover:cursor-pointer flex gap-1 items-center`}
                    >
                      <p>{tagname}</p>
                      {/* <svg
                        className={`size-2 group-hover:size-3 transition-all duration-200`}
                        xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 14 14">
                        <path fill="currentColor" fillRule="evenodd" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" clipRule="evenodd"></path>
                      </svg> */}
                      <svg
                        className={`size-5 group-hover:size-6 transition-all duration-200`} 
                        xmlns="http://www.w3.org/2000/svg"
                        width={24} height={24} viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 4c-4.419 0-8 3.582-8 8s3.581 8 8 8s8-3.582 8-8s-3.581-8-8-8m3.707 10.293a.999.999 0 1 1-1.414 1.414L12 13.414l-2.293 2.293a.997.997 0 0 1-1.414 0a1 1 0 0 1 0-1.414L10.586 12L8.293 9.707a.999.999 0 1 1 1.414-1.414L12 10.586l2.293-2.293a.999.999 0 1 1 1.414 1.414L13.414 12z"></path>
                      </svg>
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
            {isLoading ? (
              <div className="w-full h-fit px-2 mb-2 flex flex-col gap-6 animate-pulse">
                <div className="divide-y divide-monochrome-300">
                  <p className="w-[15vw] mb-3 text-headline-6 text-transparent bg-monochrome-100 rounded-md">P</p>
                  <div className="flex flex-col gap-3 pt-3">
                    <p className="w-[80%] text-body-1 text-transparent bg-monochrome-100 rounded-md">P</p>
                    <p className="w-[80%] text-body-1 text-transparent bg-monochrome-100 rounded-md">P</p>
                  </div>
                </div>
                <div className="divide-y divide-monochrome-300">
                  <p className="w-[20vw] mb-3 text-headline-6 text-transparent bg-monochrome-100 rounded-md">P</p>
                  <div className="flex flex-col gap-3 pt-3">
                    <p className="w-[90%] text-body-1 text-transparent bg-monochrome-100 rounded-md">P</p>
                    <p className="w-[40%] text-body-1 text-transparent bg-monochrome-100 rounded-md">P</p>
                  </div>
                </div>
                <div className="divide-y divide-monochrome-300">
                  <p className="w-[15vw] mb-3 text-headline-6 text-transparent bg-monochrome-100 rounded-md">P</p>
                  <div className="flex flex-col gap-3 pt-3">
                    <p className="w-[90%] text-body-1 text-transparent bg-monochrome-100 rounded-md">P</p>
                    <p className="w-[80%] text-body-1 text-transparent bg-monochrome-100 rounded-md">P</p>
                    <p className="w-[100%] text-body-1 text-transparent bg-monochrome-100 rounded-md">P</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full px-2 mb-2 flex flex-col gap-6 overflow-y-auto">
              {tagList && Object.entries(tagList).map(([category, tags], index) => {
                const isExpanded = expandedCategories[category] || false;
                const tagsToShow = tagSearchTerm || isExpanded ? tags : tags.slice(0, TAG_LIMIT);

                return (
                  <div key={index} className="flex flex-col">
                    <div className="mb-2 divide-y divide-monochrome-300 px-3">
                      {/* Category Title */}
                      <h3 className="text-headline-6">{category}</h3>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 pt-3 items-center">
                        {tagsToShow?.map(({tagname, count}, index) => (
                          <div
                            key={index}
                            onClick={() => toggleTagSelection(tagname, category)}
                            className={`text-body-1 ${
                              selectedTags.find(
                                (tag) => tag.tagname === tagname && tag.category === category && tag.state === 'included'
                              ) ? 'border-green-600 border-2'
                                : selectedTags.find(
                                  (tag) => tag.tagname === tagname && tag.category === category && tag.state === 'excluded'
                                ) ? 'border-red-600 border-2'
                                : 'border-monochrome-500 border'
                            } rounded-[1rem] cursor-pointer flex gap-2 items-center group hover:bg-monochrome-100 transition-all duration-100`}
                          >
                            <p className="ml-3">{tagname}</p>
                            <p className="py-2 px-3 h-full rounded-r-[1rem] bg-monochrome-100 font-normal text-monochrome-600 group-hover:bg-monochrome-200 group-hover:text-monochrome-700 transition-all duration-100">{count}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {!tagSearchTerm && tags.length > TAG_LIMIT && !isExpanded && (
                      <div className="w-full flex items-center justify-center">
                        <button 
                          onClick={() => setExpandedCategories({ ...expandedCategories, [category]: true })}
                          className="w-fit text-primary-600 mt-3 hover:underline"
                        >
                          Show More
                        </button>
                      </div>
                    )}
                    {!tagSearchTerm && isExpanded && (
                      <div className="w-full flex items-center justify-center">
                        <button 
                          onClick={() => setExpandedCategories({ ...expandedCategories, [category]: false })}
                          className="w-fit text-primary-600 mt-3 hover:underline"
                        >
                          Show Less
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
