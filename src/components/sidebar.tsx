'use client'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const mockup_forum_name = [
    "Portfolio",
    "TCAS",
    "แนะนำคณะและมหาวิทยาลัย",
    "การเตรียมตัวสอบ",
    "ทุนการศึกษา",
    "การเตรียมตัวเรียนต่อต่างประเทศ",
    "เส้นทางอาชีพ",
    "กิจกรรมและค่าย",
    "test",
    "testststt",
    "testestsseasd",
  ];

  const isUserLoggedIn = false;

  const handleTagClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonName = event.currentTarget.name;
    router.push(`/forum/search/?query=${encodeURIComponent(buttonName)}`);
  };

  const handleLinkClick = (path: string) => {
    if (!isUserLoggedIn) {
      router.push('/login');
    } else {
      router.push(path);
    }
  };

  return (
    <div className="h-[calc(100vh-5.25rem)] w-full bg-monochrome-50 sticky overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-monochrome-100 top-[5.25rem] flex flex-col divide-y divide-monochrome-200 items-center px-6 py-6 border-r border-monochrome-400">
      <div className="w-full flex flex-col py-6 first:pt-0 items-start">
        <Link href="/forum" className="w-full h-20 flex gap-3 items-center px-4 hover:bg-monochrome-100 transform duration-100 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house w-8 min-w-8"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          <p className="text-headline-5">
            Homepage
          </p>
        </Link>
        <div onClick={() => handleLinkClick('/forum/my-topic')} className="w-full h-20 flex gap-3 items-center px-4 hover:bg-monochrome-100 transform duration-100 rounded-lg">
          <p className="text-headline-5">
            My Topic
          </p>
        </div>
      </div>

      <div className="w-full flex items-center gap-4 py-6 px-4">
        <p className="w-full text-nowrap text-headline-5">
          Create Topic
        </p>
        <div onClick={() => handleLinkClick('/forum/create-topic')}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 min-w-8"><path fill="currentColor" d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"/></svg>
        </div>
      </div>

      <div className="w-full flex flex-col py-6 px-4 last:pb-0 items-start gap-6">
        <h1 className="text-headline-5">
          Forum
        </h1>
        <div className="flex flex-col pl-4 gap-4 text-headline-6">
          {mockup_forum_name.map((item) => (
            <button name={item} onClick={handleTagClicked} key={item} className="hover:underline w-fit text-start">{item}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
