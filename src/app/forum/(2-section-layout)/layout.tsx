import { Navbar, Sidebar } from '@/components/index';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex flex-col overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-monochrome-200">
      {/* Navbar */}
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-full max-w-[250px] min-w-[150px] h-full bg-monochrome-300">
          <Sidebar />
        </aside>
        
        {/* Main Content */}
        <main className="w-full h-full overflow-auto py-10 px-[6vw]">
          {children}
        </main>
      </div>
    </div>
  );
}