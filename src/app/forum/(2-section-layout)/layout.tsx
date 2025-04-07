'use client';

import { useState, useRef, useEffect } from 'react';
import { Navbar, Sidebar, SearchBar, CompactSidebar, LoadingCircle } from '@/components/index';

export default function Layout({ children }: { children: React.ReactNode }) {
  const isResizing = useRef(false);

  // Default widths
  const defaultWidth = 250;
  const defaultMinWidth = 200;
  const defaultMaxWidth = 280;

  // Sidebar width states
  const [width, setWidth] = useState<number>(defaultWidth);

  // Responsive min/max widths
  const [minWidth, setMinWidth] = useState(defaultMinWidth);
  const [maxWidth, setMaxWidth] = useState(defaultMaxWidth);

  const [compactSidebar, setCompactSidebar] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCompactSidebar(true);
        setWidth(0);
        setMinWidth(0);
        setMaxWidth(0);
        return;
      }

      setCompactSidebar(false);

      if (window.innerWidth <= 1024 && window.innerWidth > 768) {
        setMinWidth(175);
        setMaxWidth(225);
      } else {
        // Large screens
        setMinWidth(defaultMinWidth);
        setMaxWidth(defaultMaxWidth);
      }
    };

    handleResize();
    setIsFullyLoaded(true);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize); 
    };
  }, []);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResizing);
  };

  const resize = (e: MouseEvent) => {
    if (!isResizing.current) return;
    setWidth(Math.min(Math.max(e.clientX, minWidth), maxWidth));
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResizing);
  };

  return !isFullyLoaded ? (
    <div className="fixed w-full h-full z-50">
      <LoadingCircle />
    </div>
  ) : (
    <div className="h-screen w-full flex flex-col overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-monochrome-200 relative">
      {/* Navbar */}
      <Navbar />
      <div className="flex w-full">
        {/* Sidebar */}
        <aside
          style={{ 
            width,
            minWidth,
            maxWidth
          }}
          className={`relative h-full bg-monochrome-300 z-10`}
        >
          {!compactSidebar && <Sidebar />}

          {/* Resize handle */}
          <div
            className="absolute right-0 top-0 h-full z-20 border border-r border-monochrome-100 cursor-ew-resize"
            onMouseDown={startResizing}
          />
        </aside>
        
        {/* Main Content */}
        <div
          className="h-full flex flex-col w-full flex-1"
          // style={{ width: `calc(100% - ${width > minWidth && width <= maxWidth && width}px)` }}
        >
          {compactSidebar 
            && 
            <div className="sticky top-[5.15rem] w-full h-fit bg-monochrome-50 z-10">
              <div className="w-full h-fit">
                <CompactSidebar />
              </div>
              <SearchBar />
            </div>
          }
          {!compactSidebar 
            && 
            <div className="h-[4rem] w-full sticky z-10 bg-monochrome-50 top-[5.25rem]">
              <SearchBar />
            </div>
          }
          <main className="w-full h-full overflow-auto py-10 px-[4%]">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}