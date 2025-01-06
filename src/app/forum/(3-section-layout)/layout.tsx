import { Navbar, Sidebar } from '@/components/index';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex flex-col overflow-auto">
      {/* Navbar */}
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-full max-w-[250px] min-w-[150px] h-full bg-monochrome-300">
          <Sidebar />
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 h-full overflow-auto py-16 px-[6vw]">
          {children}
        </main>

        {/* Right Sidebar */}
        <aside className="w-full max-w-[350px] min-w-[150px] h-full bg-monochrome-300">
          
        </aside>
      </div>
    </div>
  );
}