import { Navbar, Sidebar, SearchBar } from '@/components/index';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex flex-col overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-monochrome-200 relative">
      {/* Navbar */}
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-full max-w-[250px] min-w-[150px] h-full bg-monochrome-300">
          <Sidebar />
        </aside>
        
        {/* Main Content */}
        <div className="min-w-[80vw] max-w-[80vw] h-full flex flex-col">
          <SearchBar />
          <main className="w-full h-full overflow-auto py-10 px-[6vw]">
            {children}
          </main>
        </div>
        
      </div>
    </div>
  );
}