'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/index';
import { trpc } from '@/app/_trpc/client';

interface AddTagPopupProps {
  isPopupOpen: boolean;
  setIsPopupOpen: (isPopupOpen: boolean) => void;
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
};

type Tag = {
  tagname: string;
  category: string;
  count?: number;
}

type TagNoCategory = {
  tagname: string;
  count?: number;
}

export default function AddTagPopup({ isPopupOpen, setIsPopupOpen, tags, setTags }: AddTagPopupProps) {
  // const [searchTerm, setSearchTerm] = useState('');
  const TAG_LIMIT = 20;
  const CATEGORY_ORDER = ["ทั่วไป", "คณะ", "มหาวิทยาลัย"];
  const router = useRouter();

  const [tagList, setTagList] = useState<Record<string, Tag[]>>({});
  const [newTag, setNewTag] = useState<Record<string, string>>({}); // Currently typing tag
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false); // Fully loaded state
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const popupRef = useRef<HTMLDivElement | null>(null);
  
  const { data, isLoading, isError } = trpc.getSearchTags.useQuery({ 
    query: tagSearchTerm
  });

  
  useEffect(() => {
    if(isLoading) return;
    if(data){
      tags.forEach((selectedTag) => {
        const tagCategory = selectedTag.category;
        const tagExists = data[tagCategory]?.some(
          (tag: TagNoCategory) => tag.tagname === selectedTag.tagname
        );
  
        if (!tagExists) {
          if (!data[tagCategory]) {
            data[tagCategory] = [];
          }
          data[tagCategory].push({
            tagname: selectedTag.tagname,
            category: selectedTag.category,
            count: selectedTag.count || 0,
          });
        }
      });

      const ordered = CATEGORY_ORDER.reduce((acc, key) => {
        if (data[key]) acc[key] = data[key];
        return acc;
      }, {} as Record<string, Tag[]>);
  
      setTagList(ordered);

    }
    
  }, [isLoading, data]);

  const handleAddTag = (category: string) => {
    const trimTagName = newTag[category]?.trim();

    if (tagList[category]?.some(item => item.tagname === trimTagName)) {}

    else if (trimTagName) {
      // setTagList((prev) => ({
      //   ...prev,
      //   [category]: [{ tagname: trimTagName, category, count: 0 }, ...(prev[category] || [])]
      // }));

      setTagList((prev) => {
        const updatedTagList = {
          ...prev,
          [category]: [{ tagname: trimTagName, category, count: 0 }, ...(prev[category] || [])],
        };
        console.log('Updated tag list:', updatedTagList);
        return updatedTagList;
      });

      setTags((prev) => ([ 
        ...prev, 
        { tagname: trimTagName, category: category, count: 0 },
      ]));
    }
    setNewTag({ [category]: "" });
    setActiveCategory(null);
  };

  const toggleTagSelection = (tagname: string, category: string) => {
    setTags((prevTags: Tag[]) => 
      prevTags.some(someTag => someTag.tagname === tagname && someTag.category === category)
        ? prevTags.filter((tag) => tag.tagname !== tagname)
        : ([ ...prevTags, { tagname: tagname, category: category, count: 0 }])
    );
  };

  const handleRemoveSelectedTag = (tag: Tag) => {
    const filteredTags = tags.filter(oldTag => oldTag.tagname !== tag.tagname);
    setTags(filteredTags);
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

  const handleTagSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagSearchTerm(e.target.value);
  };

  return (
    <div className="fixed w-screen h-screen top-0 right-0 backdrop-filter backdrop-brightness-75 backdrop-blur-[2px] z-20">
      <div
        // ref={popupRef}
        className="h-[calc(100%-5rem)] w-full ml-0 mt-[5.5rem] pb-[2rem] z-20 flex justify-center"
      >
        {/* Body */}
        <div ref={popupRef} className="w-[90%] h-full bg-monochrome-50 rounded-md flex flex-col gap-4">
          <div className="sticky top-0 flex flex-col gap-2 p-3 px-5 bg-monochrome-50 border-b">
            {/* Selected tag display area */}
            {tags && tags.length > 0 &&
            <div className="flex gap-2 items-center">
              <p>Selected Tags:</p>
              <div className="flex gap-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  onClick={() => handleRemoveSelectedTag(tag)}
                  className={`text-body-1 bg-green-600 rounded-[1rem] px-3 py-2 group hover:cursor-pointer flex gap-1 items-center`}
                >
                  <p>{tag.tagname}</p>
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
            <div className="w-full h-full px-5 mb-2 flex flex-col gap-6 animate-pulse">
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
            <div className="w-full h-full px-5 mb-2 flex flex-col gap-6 overflow-y-auto">
            {Object.entries(tagList).map(([category, allTags], index) => {
              const isExpanded = expandedCategories[category] || false;
              const tagsToShow = tagSearchTerm || isExpanded ? allTags : allTags.slice(0, TAG_LIMIT);

              return (
                <div key={index} className="flex flex-col">
                  <div key={index} className="divide-y divide-monochrome-300">
                    {/* Category Title */}
                    <h3 className="text-headline-6">{category}</h3>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-3 items-center">
                      {tagsToShow.map(({tagname, count}, index) => {
                        const isTagSelected = tags.some(
                          selectedTag => selectedTag.tagname === tagname && selectedTag.category === category
                        );

                        return (
                          <div
                            key={index}
                            onClick={() => toggleTagSelection(tagname, category)}
                            className={`text-body-1 ${isTagSelected ? 'border-green-600 border-2' : 'border-monochrome-500 border'} rounded-[1rem] cursor-pointer flex gap-2 items-center group hover:bg-monochrome-100 transition-all duration-100`}
                          >
                            <p className="ml-3">{tagname}</p>
                            <p className="py-2 px-3 h-full rounded-r-[1rem] bg-monochrome-100 font-normal text-monochrome-600 group-hover:bg-monochrome-200 group-hover:text-monochrome-700 transition-all duration-100">{count}</p>
                          </div>
                        );
                      })}
                      {!tagSearchTerm &&
                      (activeCategory === category ? (
                        <input
                          type="text"
                          value={newTag[category] || ""}
                          onChange={(e) =>
                            setNewTag({
                              [category]: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddTag(category);
                          }}
                          onBlur={() => setActiveCategory(null)} // Close input on blur/loose focus
                          className="text-body-1 text-monochrome-600 border border-monochrome-400 rounded-[1rem] px-3 py-2 outline-none"
                          placeholder="New tag"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => setActiveCategory(category)}
                          className="text-headline-6 px-2 py-2"
                        >
                          +
                        </button>
                      ))}
                    </div>
                  </div>
                  {!tagSearchTerm && allTags.length > TAG_LIMIT && !isExpanded && (
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
          <div className="bg-monochrome-50 h-fit w-full flex justify-end py-3 px-5 border-t">
            <Button button_name="Add" variant="primary" onClick={handleAddClick}/>
          </div>
        </div>
      </div>
    </div>
  );
}
