'use client';

import { usePathname, useSearchParams } from 'next/navigation';  // From Next.js 13+
import { useEffect, useState } from 'react';
import { PostSection } from '@/components/index';

type TagWState = {
  tagname: string;
  category: string;
  state: 'included' | 'excluded';
}

// Search Tag and Text
export default function Search() {
  const pathname = decodeURIComponent(usePathname());  // Gets the current path
  const searchParams = useSearchParams();  // Gets the query params
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  // const [tags, setTags] = useState<Record<string, "included" | "excluded">>({});
  const [tags, setTags] = useState<TagWState[]>([]);

  useEffect(() => {
    // Extract searchTerm from path (Assuming path like /forum/search/term)
    const pathParts = pathname.split('/');
    const term = pathParts[pathParts.length - 1];  // Get the search term from the URL path
    console.log(pathname);

    setSearchTerm(term);  // Set the search term from the path

    // Extract the query params if available
    const queryParam = searchParams.get('query');  // Assuming query is passed like ?query=someQuery
    if (queryParam) {
      try {
        const parsedTags = JSON.parse(decodeURIComponent(queryParam)); // Decode and parse the tags
        setTags(parsedTags);
      } catch (error) {
        console.error('Error parsing query params', error);
      }
    }
  }, [pathname, searchParams]);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-headline-4">ผลการค้นหา "<span className="text-primary-500">{searchTerm}</span>"</p>
      <div className="flex gap-2">
      {tags && tags.map(({ tagname, category, state}, index) => (
        <div
          key={index}
          className={`text-body-1 border rounded-[1rem] px-3 py-2 cursor-pointer ${
            state === 'included' ? 'border-green-600' : 
            state === 'excluded' ? 'border-red-600' : 'border-monochrome-600'
          }`}
        >
          {tagname}
        </div>
      ))}
      </div>
      {/* {isLoading ? 
        (<p>Loading...</p>) 
        : 
        (<p>{data}</p>)} */}
      <PostSection searchTerm={searchTerm} filterTags={tags}/>
    </div>
  );
}
