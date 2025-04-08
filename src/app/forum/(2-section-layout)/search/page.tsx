'use client';

import { usePathname, useSearchParams } from 'next/navigation';  // From Next.js 13+
import { useEffect, useState } from 'react';
import { SortBy, PostSection } from '@/components/index';

type TagWState = {
  tagname: string;
  category: string;
  state: 'included' | 'excluded';
}

// Search Tag Only
export default function Search() {
  const pathname = usePathname();  // Gets the current path
  const searchParams = useSearchParams();  // Gets the query params

  
  const [searchTerm, setSearchTerm] = useState<string | undefined>('');
  // const [tags, setTags] = useState<Record<string, "included" | "excluded">>({});
  const [tags, setTags] = useState<TagWState[]>([]);

  useEffect(() => {
    const queryParam = searchParams.get('query'); // Extract query parameter
    if (queryParam) {
      try {
        // Attempt to parse as JSON
        const parsedTags = JSON.parse(decodeURIComponent(queryParam));
        setTags(parsedTags);
      } catch {
        // If parsing fails, treat it as a plain string
        console.warn('Query is not JSON, treating as plain text:', queryParam);
        // setTags({ [queryParam]: 'included' }); // Example: Add the query as a single tag
      }
    } else {
      setTags([]); // Reset tags if query is missing
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-2">
      {/* <p className="text-headline-3">ผลการค้นหา "<span className="text-primary-500">{searchTerm}</span>"</p> */}
      <div className="flex gap-2">
      {tags && tags.map(({ tagname, category, state }, index) => (
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
      <PostSection searchTerm={searchTerm} filterTags={tags} />
    </div>
  );
}
