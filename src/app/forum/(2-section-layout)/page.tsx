'use client';
import Link from 'next/link';
import { Carousel, PostSection, SearchBar } from '@/components/index';
import { useRouter } from  'next/navigation';
import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: carousel_items, isLoading, isError } = trpc.queryTopic.useQuery();
  const { data: allTags, isLoading: isLoadingTags, isError: isTagsError } = trpc.getTags.useQuery();

  const handleTagClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonName = event.currentTarget.name;
    if (!session) {
      router.push('/login');
    } else {
      router.push(`/forum/search/?query=${encodeURIComponent(buttonName)}`);
    }
  };

  
  if (isLoading) return <div className="h-full w-full flex justify-center items-center">
    <svg className="animate-spin size-10 -ml-1 mr-3 text-monochrome-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>;
  if (isError) return <div>Error loading posts</div>;

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
          {carousel_items?<Carousel carousel_items={carousel_items} />:<div>Loading...</div>}
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

          <div className="w-full h-fit flex flex-wrap gap-2">
            {(allTags["คณะ"] as string[]).map((key) => (
              <button name={key} onClick={handleTagClicked} key={key} className="w-fit h-fit border border-monochrome-600 rounded-[1rem] py-2 px-3 hover:bg-primary-600 hover:border-primary-600 transform duration-200 group">
                <p className="text-monochrome-600 group-hover:text-monochrome-50">{key}</p>
              </button>
            ))}
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

          <div className="w-full h-fit flex flex-wrap gap-2">
            {(allTags["มหาวิทยาลัย"] as string[]).map((key) => (
              <button name={key} onClick={handleTagClicked} key={key} className="w-fit h-fit border border-monochrome-600 rounded-[1rem] py-2 px-3 hover:bg-primary-600 hover:border-primary-600 transform duration-200 group">
                <p className="text-monochrome-600 group-hover:text-monochrome-50">{key}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-full">
        <PostSection />
      </div>
    </div>
  )
}