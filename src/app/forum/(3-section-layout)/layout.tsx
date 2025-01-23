import { Navbar, Sidebar, TrendingTopic, SearchBar } from '@/components/index';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen w-full flex flex-col overflow-auto">
      {/* Navbar */}
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-full max-w-[250px] min-w-[190px] h-full bg-monochrome-300">
          <Sidebar />
        </aside>

        <div className="flex-1 h-full flex flex-col">
          <SearchBar />
          <main className="h-full overflow-auto py-6 px-[6vw]">
            {children}
          </main>
        </div>

        {/* Right Sidebar */}
        <aside className="w-full max-w-[350px] min-w-[250px] h-full bg-monochrome-300">
          <TrendingTopic />
        </aside>
      </div>
    </div>
  );
}