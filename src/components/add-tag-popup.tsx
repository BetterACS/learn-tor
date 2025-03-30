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
  tagsWCategory: Record<string, Tag[]>;
  setTagsWCategory: React.Dispatch<React.SetStateAction<Record<string, Tag[]>>>;
};

type Tag = {
  tagname: string;
  count: number;
}

interface TagsWCategory {
  [category: string]: Tag[]; // The key is a string (category), the value is an array of Tag objects
}

interface TagList extends TagsWCategory {}

export default function AddTagPopup({ isPopupOpen, setIsPopupOpen, tags, setTags, tagsWCategory, setTagsWCategory }: AddTagPopupProps) {
  // const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const [tagList, setTagList] = useState<Record<string, Tag[]>>({});
  const [newTag, setNewTag] = useState<{ [key in keyof typeof tagList]?: string }>({}); // Currently typing tag
  const [allNewTag, setAllNewTag] = useState<Record<string, Tag[]>>({}); // Only not existing tag
  const [activeCategory, setActiveCategory] = useState<keyof typeof tagList | null>(null);
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  const { data, isLoading, isError } = trpc.getSearchTags.useQuery({ 
    query: tagSearchTerm
  });

  const popupRef = useRef<HTMLDivElement | null>(null);

  const handleTagSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagSearchTerm(e.target.value);
  };

  // const handleAddTag = (category: keyof typeof tagList) => {
  //   if (newTag[category]?.trim()) {
  //     setTagList((prev) => ({
  //       ...prev,
  //       [category]: [...prev[category], newTag[category]!.trim()],
  //     }));
  //     setNewTag((prev) => ({ ...prev, [category]: "" }));
  //   }
  //   setActiveCategory(null);
  // };
  
  useEffect(() => {
    console.log("tagsWCategory: ", tagsWCategory);
  }, []);

  const handleAddTag = (category: keyof typeof tagList) => {
    if (tagList[category]?.some(item => item.tagname === newTag[category])) {}
    // if (tagsWCategory[category]?.some(item => item.tagname === newTag[category])) {}
    else if (newTag[category]?.trim()) {
      setTagList((prev) => ({
        ...prev,
        [category]: [...(prev[category] || []), { tagname: newTag[category]!.trim(), count: 0 }]
      }));

      // setTagsWCategory((prev) => ({
      //   ...prev,
      //   [category]: [...(prev[category] || []), { tagname: newTag[category]!.trim(), count: 0 }]
      // }));
      
      setAllNewTag((prev) => ({
        ...prev,
        [category]: [...(prev[category] || []), { tagname: newTag[category]!.trim(), count: 0 }]
      }));
    }
    setTags((prev) => ([ ...prev, newTag[category]!.trim() ]));
    setTagsWCategory((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), { tagname: newTag[category]!.trim(), count: 0 }]
    }));
    setNewTag((prev) => ({ ...prev, [category]: "" }));
    setActiveCategory(null);
  };

  const toggleTagSelection = (tag: string, category: string) => {
    setTags((prevTags: string[]) => 
      prevTags.includes(tag) 
        ? prevTags.filter((t) => t !== tag) // Remove if present
        : [...prevTags, tag] // Add if not present
    );

    setTagsWCategory((prevTags: Record<string, Tag[]>) => ({
      ...prevTags,
      [category]: prevTags[category]?.some((t) => t.tagname === tag)
        ? prevTags[category].filter((t) => t.tagname !== tag) // Remove if tagname exists
        : [
            ...(prevTags[category] || []), // Fallback to an empty array if category is not yet present
            { tagname: tag!.trim(), count: 0 }, // Add the new tag
          ],
    }));
  };

  useEffect(() => {
    if (isLoading) return;
  
    setTagList((prevTagList) => {
      // Merge tagsWCategory with data while preserving the order of data
      const mergedData = Object.keys(data).reduce((acc, category) => {
        // If the category exists in tagsWCategory, merge without changing the order of data
        if (tagsWCategory[category]) {
          // We add tags from tagsWCategory that are not already in data
          acc[category] = [
            ...data[category],
            ...tagsWCategory[category].filter(tag => 
              !data[category].some((existingTag: Tag) => existingTag.tagname === tag.tagname)
            )
          ];
        } else {
          // If the category only exists in data, just add it
          acc[category] = data[category];
        }
        return acc;
      }, {} as TagsWCategory);
  
      // Return the merged object, combining it with any existing prevTagList
      return { ...prevTagList, ...mergedData };
    });
  }, [isLoading, data, tagsWCategory]);
  

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
    <div className="fixed w-screen h-screen top-0 right-0 backdrop-filter backdrop-brightness-75 backdrop-blur-[2px] z-10 flex justify-center">
      <div
        // ref={popupRef}
        className="h-fit w-[calc(100%-260px)] mt-[5.5rem] flex flex-col gap-3 items-center justify-center z-20"
      >
        {/* Body */}
        <div ref={popupRef} className="w-[65%] h-[80vh] overflow-y-auto bg-monochrome-50 rounded-md flex flex-col gap-4">
          <div className="sticky top-0 flex flex-col gap-2 p-3 px-3 bg-monochrome-50 border-b">
            {/* Selected tag display area */}
            {Object.keys(tagsWCategory).length > 0 &&
            <div className="flex gap-2 items-center">
              <p>Selected Tags:</p>
              <div className="flex gap-2">
              {Object.entries(tagsWCategory).map(([category, tags]) => (
                tags.map((tag) => (
                  <div
                    key={tag.tagname}
                    className={`text-body-1 bg-green-600 rounded-[1rem] px-3 py-2`}
                  >
                    {tag.tagname}
                  </div>
                ))
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
          {/* {Object.entries(tagList).map(([category, allTags]) => ( */}
          {Object.entries(tagList).map(([category, allTags]) => (
            <div key={category} className="mb-2 divide-y divide-monochrome-300 px-3">
              {/* Category Title */}
              <h3 className="text-headline-6">{category}</h3>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-3 items-center">
                {allTags.map(({tagname, count}, index) => (
                  <div
                    key={tagname}
                    onClick={() => toggleTagSelection(tagname, category)}
                    className={`text-body-1 ${
                      tags.includes(tagname) 
                      ? 
                      'border-green-600 border-2' : 'border-monochrome-500 border'
                    } rounded-[1rem] cursor-pointer flex gap-2 items-center`}
                  >
                    <p className="ml-3">{tagname}</p>
                    <p className="py-2 px-3 h-full rounded-r-[1rem] bg-monochrome-100 font-normal text-monochrome-600">{count}</p>
                  </div>
                ))}
                {!tagSearchTerm &&
                (activeCategory === category ? (
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
                ))}
              </div>
            </div>
          ))}
          <div className="sticky bottom-0 bg-monochrome-50 h-fit w-full flex justify-end p-3 border-t">
            <Button button_name="Add" variant="primary" onClick={handleAddClick}/>
          </div>
        </div>
      </div>
    </div>
  );
}
