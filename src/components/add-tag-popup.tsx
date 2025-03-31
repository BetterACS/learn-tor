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
  const router = useRouter();

  const [tagList, setTagList] = useState<Record<string, Tag[]>>({});
  const [newTag, setNewTag] = useState<Record<string, string>>({}); // Currently typing tag
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [tagSearchTerm, setTagSearchTerm] = useState('');

  const popupRef = useRef<HTMLDivElement | null>(null);

  
  const { data, isLoading, isError } = trpc.getSearchTags.useQuery({ 
    query: tagSearchTerm
  });

  
  useEffect(() => {
    if(isLoading) return;
    if(data){
      tags.forEach((selectedTag) => {
        const tagCategory = selectedTag.category;
        console.log(data);
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
  
      setTagList(data);
    }
    
  }, [isLoading, data, tags]);

  const handleAddTag = (category: string) => {
    const trimTagName = newTag[category]?.trim();

    if (tagList[category]?.some(item => item.tagname === trimTagName)) {}

    else if (trimTagName) {
      setTagList((prev) => ({
        ...prev,
        [category]: [...(prev[category] || []), { tagname: newTag[category]!.trim(), category: category, count: 0 }]
      }));
      setTags((prev) => ([ 
        ...prev, 
        { tagname: trimTagName, category: category, count: 0 }
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
    <div className="fixed w-screen h-screen top-0 right-0 backdrop-filter backdrop-brightness-75 backdrop-blur-[2px] z-10 flex justify-center">
      <div
        // ref={popupRef}
        className="h-fit w-[calc(100%-260px)] mt-[5.5rem] flex flex-col gap-3 items-center justify-center z-20"
      >
        {/* Body */}
        <div ref={popupRef} className="w-[65%] h-[80vh] overflow-y-auto bg-monochrome-50 rounded-md flex flex-col gap-4">
          <div className="sticky top-0 flex flex-col gap-2 p-3 px-3 bg-monochrome-50 border-b">
            {/* Selected tag display area */}
            {tags && tags.length > 0 &&
            <div className="flex gap-2 items-center">
              <p>Selected Tags:</p>
              <div className="flex gap-2">
              {tags.map(tag => (
                <div
                  key={tag.tagname}
                  className={`text-body-1 bg-green-600 rounded-[1rem] px-3 py-2`}
                >
                  {tag.tagname}
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
                onChange={handleTagSearchChange}
                value={tagSearchTerm}
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
          </div>
          {/* Tag display area */}
          <div className="w-full h-full px-3 mb-2 flex flex-col gap-6">
          {Object.entries(tagList).map(([category, allTags], index) => (
            <div key={index} className="divide-y divide-monochrome-300">
              {/* Category Title */}
              <h3 className="text-headline-6">{category}</h3>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-3 items-center">
                {allTags.map(({tagname, category, count}, index) => {
                  const isTagSelected = tags.some(
                    selectedTag => selectedTag.tagname === tagname && selectedTag.category === category
                  );

                  return (
                    <div
                      key={index}
                      onClick={() => toggleTagSelection(tagname, category)}
                      className={`text-body-1 ${isTagSelected ? 'border-green-600 border-2' : 'border-monochrome-500 border'} rounded-[1rem] cursor-pointer flex gap-2 items-center`}
                    >
                      <p className="ml-3">{tagname}</p>
                      <p className="py-2 px-3 h-full rounded-r-[1rem] bg-monochrome-100 font-normal text-monochrome-600">{count}</p>
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
          ))}
          </div>
          <div className="sticky bottom-0 bg-monochrome-50 h-fit w-full flex justify-end p-3 border-t">
            <Button button_name="Add" variant="primary" onClick={handleAddClick}/>
          </div>
        </div>
      </div>
    </div>
  );
}
