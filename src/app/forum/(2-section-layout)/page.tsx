'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Carousel, LoadingCircle, PostSection, SearchBar } from '@/components/index';
import { useRouter } from  'next/navigation';
import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';

type Tag = {
  tagname: string,
  count: number,
}

export default function Home() {
  const TAG_LIMIT = 15;

  const router = useRouter();
  const { data: session } = useSession();

  // const { data: topic, isLoading, isError } = trpc.queryTopic.useQuery();
  const { data: allTags, isLoading: isLoadingTags, isError: isTagsError } = trpc.getSearchTags.useQuery({
    query: "",
  });

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const handleTagClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonName = event.currentTarget.name;
    if (!session) {
      router.push('/login');
    } else {
      router.push(`/forum/search/?query=${encodeURIComponent(buttonName)}`);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center text-center gap-12">
      <div className="w-full self-start flex flex-col gap-4">
        <div className="w-fit border-b-4 border-primary-600">
          <p className="text-headline-4 text-primary-600 py-1">
            Portfolio Topic
          </p>
        </div>
        {/* Carosal */}
        <div className="w-auto h-fit">
          <Carousel />
        </div>
      </div>
      <div className="w-full h-fit flex gap-[12%]">
        {/* Left รีวิวคณะ */}
        <div className="relative flex flex-1 flex-col gap-4 overflow-hidden">
          <div className="flex">
            <div className="flex w-fit border-b-4 border-primary-600">
              <p className="text-headline-4 text-nowrap text-primary-600 py-1">
                รีวิวคณะ
              </p>
            </div>
            <div className="flex flex-auto border-b-2 border-monochrome-300 mb-[1px]"></div>
          </div>

          <div className="w-full h-fit">
            {isLoadingTags ? (
              <div className="w-full h-full my-3">
                <LoadingCircle />
              </div>
            ) : isTagsError ? (
              <div className="text-body-large text-monochrome-500">Error loading tags</div>
            ) : (
              (() => {
                const category = "คณะ"
                const isExpanded = expandedCategories[category] || false;
                const tagsToShow = isExpanded ? allTags[category] : allTags[category].slice(0, TAG_LIMIT);

                return (
                  <div className="flex flex-wrap gap-2">
                    {tagsToShow.map((tag: Tag, index: number) => (
                      <button name={tag.tagname} onClick={handleTagClicked} key={index} className="w-fit h-fit border border-monochrome-600 rounded-[1rem] py-2 px-3 hover:bg-primary-600 hover:border-primary-600 transform duration-200 group">
                        <p className="text-monochrome-600 group-hover:text-monochrome-50">{tag.tagname}</p>
                      </button>
                    ))}
                    {allTags[category].length > TAG_LIMIT && !isExpanded && (
                      <div className="w-full flex items-center justify-center">
                        <button 
                          onClick={() => setExpandedCategories({ ...expandedCategories, [category]: true })}
                          className="w-fit text-primary-600 mt-3 hover:underline"
                        >
                          Show More
                        </button>
                      </div>
                    )}
                    {isExpanded && (
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
                );
              })()
            )}
          </div>
        </div>

        {/* Right รีวิวมหาวิทยาลัย */}
        <div className="relative flex flex-1 flex-col gap-4 overflow-hidden">
          <div className="flex">
            <div className="flex w-fit border-b-4 border-primary-600">
              <p className="text-headline-4 text-nowrap text-primary-600 py-1">
                รีวิวมหาวิทยาลัย
              </p>
            </div>
            <div className="flex flex-auto border-b-2 border-monochrome-300 mb-[1px]"></div>
          </div>
          <div className="w-full h-fit">
          {isLoadingTags ? (
            <div className="w-full h-full my-3">
              <LoadingCircle />
            </div>
          ) : isTagsError ? (
            <div className="text-body-large text-monochrome-500">Error loading tags</div>
          ) : (
            (() => {
              const category = "มหาวิทยาลัย"
              const isExpanded = expandedCategories[category] || false;
              const tagsToShow = isExpanded ? allTags[category] : allTags[category].slice(0, TAG_LIMIT);

              return (
                <div className="flex flex-wrap gap-2">
                  {tagsToShow.map((tag: Tag, index: number) => (
                    <button name={tag.tagname} onClick={handleTagClicked} key={index} className="w-fit h-fit border border-monochrome-600 rounded-[1rem] py-2 px-3 hover:bg-primary-600 hover:border-primary-600 transform duration-200 group">
                      <p className="text-monochrome-600 group-hover:text-monochrome-50">{tag.tagname}</p>
                    </button>
                  ))}
                  {allTags[category].length > TAG_LIMIT && !isExpanded && (
                    <div className="w-full flex items-center justify-center">
                      <button 
                        onClick={() => setExpandedCategories({ ...expandedCategories, [category]: true })}
                        className="w-fit text-primary-600 mt-3 hover:underline"
                      >
                        Show More
                      </button>
                    </div>
                  )}
                  {isExpanded && (
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
              );
            })()
          )}
          </div>
        </div>
      </div>
      <div className="w-full h-full">
        <PostSection />
      </div>
    </div>
  )
}