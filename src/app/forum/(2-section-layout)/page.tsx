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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading posts</div>;
  // const carousel_items = [
  //   {
  //     id: 1,
  //     img: "http://i.ibb.co/ncrXc2V/1.png",
  //     title: "หนูอยากยื่นมศว.ค่ะ ช่วยดูและแนะนำให้หน่อยได้ไหมคะ 1",
  //     body: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque deserunt, quam qui nobis rerum veniam quis pariatur commodi reprehenderit neque delectus consectetur quae molestias sapiente, unde, culpa sunt numquam. Quas."
  //   },
  //   {
  //     id: 2,
  //     img: "http://i.ibb.co/B3s7v4h/2.png",
  //     title: "หนูอยากยื่นมศว.ค่ะ ช่วยดูและแนะนำให้หน่อยได้ไหมคะ 2",
  //     body: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque deserunt, quam qui nobis rerum veniam quis pariatur commodi reprehenderit neque delectus consectetur quae molestias sapiente, unde, culpa sunt numquam. Quas."
  //   },
  //   {
  //     id: 3,
  //     img: "http://i.ibb.co/XXR8kzF/3.png",
  //     title: "หนูอยากยื่นมศว.ค่ะ ช่วยดูและแนะนำให้หน่อยได้ไหมคะ 3",
  //     body: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque deserunt, quam qui nobis rerum veniam quis pariatur commodi reprehenderit neque delectus consectetur quae molestias sapiente, unde, culpa sunt numquam. Quas."
  //   },
  //   {
  //     id: 4,
  //     img: "http://i.ibb.co/yg7BSdM/4.png",
  //     title: "หนูอยากยื่นมศว.ค่ะ ช่วยดูและแนะนำให้หน่อยได้ไหมคะ 4",
  //     body: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque deserunt, quam qui nobis rerum veniam quis pariatur commodi reprehenderit neque delectus consectetur quae molestias sapiente, unde, culpa sunt numquam. Quas."
  //   },
  // ]

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
      {/* <div className="flex flex-col w-[90%] gap-6">
        <p className="text-headline-4 text-primary-600 font-bold text-balance">
          ค้นหาหัวข้อการพูดคุยที่คุณสนใจได้ที่นี่เลย!!
        </p>
        <SearchBar />
      </div> */}
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
            {allTags["คณะ"].map((key) => (
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
            {allTags["มหาวิทยาลัย"].map((key) => (
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