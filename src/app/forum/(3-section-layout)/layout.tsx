'use client';

import { useState, useRef, useEffect } from 'react';
import { Navbar, Sidebar, TrendingTopic, CompactSidebar, TrendingTopicCarousel, LoadingCircle } from '@/components/index';

export default function Layout({ children }: { children: React.ReactNode }) {
  const isResizingLeft = useRef(false);
  const isResizingRight = useRef(false);

  // Default widths
  const defaultWidthLeft = 250, defaultWidthRight = 325;
  const defaultMinWidthLeft = 200, defaultMaxWidthLeft = 300;
  const defaultMinWidthRight = 300, defaultMaxWidthRight = 425;

  // Sidebar width states
  const [widthLeft, setWidthLeft] = useState<number>(defaultWidthLeft);
  const [widthRight, setWidthRight] = useState<number>(defaultWidthRight);

  // Responsive min/max widths
  const [minWidthLeft, setMinWidthLeft] = useState(defaultMinWidthLeft);
  const [maxWidthLeft, setMaxWidthLeft] = useState(defaultMaxWidthLeft);
  const [minWidthRight, setMinWidthRight] = useState(defaultMinWidthRight);
  const [maxWidthRight, setMaxWidthRight] = useState(defaultMaxWidthRight);

  const [compactSidebar, setCompactSidebar] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        // Mobile: fully compact
        setCompactSidebar(true);
        setWidthLeft(0);
        setMinWidthLeft(0);
        setMaxWidthLeft(0);
        setWidthRight(0);
        setMinWidthRight(0);
        setMaxWidthRight(0);
        return;
      }
    
      // Wider than 768px
      setCompactSidebar(false);
    
      if (window.innerWidth <= 940 && window.innerWidth > 768) {
        // Small tablets
        setMinWidthLeft(175);
        setMaxWidthLeft(200);
        setMinWidthRight(250);
        setMaxWidthRight(325);
      } else if (window.innerWidth <= 1024 && window.innerWidth > 940) {
        // Medium screens
        setMinWidthLeft(175);
        setMaxWidthLeft(200);
        setMinWidthRight(250);
        setMaxWidthRight(325);
      } else {
        // Large screens
        setMinWidthLeft(defaultMinWidthLeft);
        setMaxWidthLeft(defaultMaxWidthLeft);
        setMinWidthRight(defaultMinWidthRight);
        setMaxWidthRight(defaultMaxWidthRight);
      }
    };

    handleResize();
    setIsFullyLoaded(true);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize); 
    };
  }, []);

  const startResizingLeft = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingLeft.current = true;
    document.addEventListener('mousemove', resizeLeft);
    document.addEventListener('mouseup', stopResizingLeft);
  };
  const resizeLeft = (e: MouseEvent) => {
    if (!isResizingLeft.current) return;
    setWidthLeft(Math.min(Math.max(e.clientX, minWidthLeft), maxWidthLeft));
  };
  const stopResizingLeft = () => {
    isResizingLeft.current = false;
    document.removeEventListener('mousemove', resizeLeft);
    document.removeEventListener('mouseup', stopResizingLeft);
  };

  const startResizingRight = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRight.current = true;
    document.addEventListener('mousemove', resizeRight);
    document.addEventListener('mouseup', stopResizingRight);
  };
  const resizeRight = (e: MouseEvent) => {
    if (!isResizingRight.current) return;
    const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;
    const scrollbarWidth = getScrollbarWidth();
    const newWidth = window.innerWidth - e.clientX - scrollbarWidth;
    setWidthRight(Math.min(Math.max(newWidth, minWidthRight), maxWidthRight));
  };
  const stopResizingRight = () => {
    isResizingRight.current = false;
    document.removeEventListener('mousemove', resizeRight);
    document.removeEventListener('mouseup', stopResizingRight);
  };

  return !isFullyLoaded ? (
    <div className="fixed top-0 w-full h-full">
      <LoadingCircle />
    </div>
  ) : (
    <div className="relative h-screen w-full flex flex-col overflow-auto">
      <Navbar />
      <div className="flex w-full">
        {/* Left Sidebar */}
        {!compactSidebar && 
        <aside
          style={{ width: widthLeft, minWidth: minWidthLeft, maxWidth: maxWidthLeft }}
          className="relative h-full bg-monochrome-300 z-10"
        >
          {!compactSidebar && <Sidebar />}
          <div
            className="absolute right-0 top-0 h-full z-20 border border-r border-monochrome-100 cursor-ew-resize"
            onMouseDown={startResizingLeft}
          />
        </aside>
        }

        {/* Main Content (Fixed Width) */}
        {/* <div
          className="h-full flex flex-col flex-grow"
          style={{ width: `calc(100% - ${widthLeft > minWidthLeft && widthLeft <= maxWidthLeft && widthLeft}px - ${widthRight > minWidthRight && widthRight <= maxWidthRight && widthRight}px)` }}
        > */}
        <div className="w-full h-full flex flex-col flex-1 items-center">
          {compactSidebar 
            && 
            <div className="sticky top-[5.15rem] w-full h-fit bg-monochrome-50 z-10">
              <CompactSidebar />
            </div>
          }
          <main className="h-full w-full flex justify-center overflow-auto py-6 px-[3vw] maxsm:px-0">{children}</main>
          {compactSidebar 
            && 
            <div className="w-full h-fit">
              <TrendingTopicCarousel />
            </div>
          }
        </div>

        {/* Right Sidebar */}
        {!compactSidebar && 
        <aside
          style={{ width: widthRight, minWidth: minWidthRight, maxWidth: maxWidthRight }}
          className="relative h-full bg-monochrome-300 z-10 flex-shrink"
        >
          <TrendingTopic />
          <div
            className="absolute left-0 top-0 h-full z-20 border border-r border-monochrome-100 cursor-ew-resize"
            onMouseDown={startResizingRight}
          />
        </aside>
        }
      </div>
    </div>
  )
}
