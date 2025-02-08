'use client';
import { Navbar, CompareSidebar, InfoCard } from '@/components/index';
import { useState } from 'react';

export default function Page() {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const handleSelect = (item: any) => {
    if (selectedItems.length < 3 && !selectedItems.some(selected => selected.rank === item.rank)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleToggleSidebar = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex flex-1">
        <div className="sm:w-full md:w-1/2 lg:w-1/4">
          <CompareSidebar onToggleSidebar={handleToggleSidebar} />
        </div>

        <div className="lg:w-3/4 p-6 ml-6">
          <p className="text-headline-4 mr-5 mb-4">Compare Universities List</p>

          <div className="grid sm:grid-cols-1 md:grid-cols-1 gap-6 lg:grid-cols-2">
            <InfoCard
              university="จุฬาลงกรณ์มหาวิทยาลัย"
              faculty="คณะวิศวกรรมศาสตร์"
              major="สาขาวิศวกรรมคอมพิวเตอร์"
              logo="/images/uni-pic/cu.avif"
              image="/images/uni-pic/mock.avif"
              rounds={[
                { name: 'รอบ 1 Portfolio', quota: 'รับ 327 คน' },
                { name: 'รอบ 2 Quota', quota: 'รับ 38 คน' },
                { name: 'รอบ 3 Admission', quota: 'รับ 240 คน' },
                { name: 'รอบ 4 Direct Admission', quota: 'ไม่เปิดรับสมัคร' },
              ]}
            />
            <InfoCard
              university="มหาวิทยาลัยเกษตรศาสตร์"
              faculty="คณะวิศวกรรมศาสตร์"
              major="สาขาวิศวกรรมคอมพิวเตอร์"
              logo="/images/uni-pic/ku.avif"
              image="/images/uni-pic/mock2.avif"
              rounds={[
                { name: 'รอบ 1 Portfolio', quota: 'รับ 327 คน' },
                { name: 'รอบ 2 Quota', quota: 'รับ 38 คน' },
                { name: 'รอบ 3 Admission', quota: 'รับ 240 คน' },
                { name: 'รอบ 4 Direct Admission', quota: 'ไม่เปิดรับสมัคร' },
              ]}
            />
            <InfoCard
              university="มหาวิทยาลัยเชียงใหม่"
              faculty="คณะวิจิตรศิลป์"
              major="สาขา การออกแบบ"
              logo="/images/uni-pic/cmu.avif"
              image="/images/uni-pic/mock3.avif"
              rounds={[
                { name: 'รอบ 1 Portfolio', quota: 'รับ 327 คน' },
                { name: 'รอบ 2 Quota', quota: 'รับ 38 คน' },
                { name: 'รอบ 3 Admission', quota: 'รับ 240 คน' },
                { name: 'รอบ 4 Direct Admission', quota: 'ไม่เปิดรับสมัคร' },
              ]}
            />
            <InfoCard
              university="มหาวิทยาลัยเทคโนโลยีพระจอมเก..."
              faculty="คณะ วิทยาศาสตร์"
              major="สาขา วิทยาการคอมพิวเตอร์ประยุกต์"
              logo="/images/uni-pic/kmutt.avif"
              image="/images/uni-pic/mock4.avif"
              rounds={[
                { name: 'รอบ 1 Portfolio', quota: 'รับ 327 คน' },
                { name: 'รอบ 2 Quota', quota: 'รับ 38 คน' },
                { name: 'รอบ 3 Admission', quota: 'รับ 240 คน' },
                { name: 'รอบ 4 Direct Admission', quota: 'ไม่เปิดรับสมัคร' },
              ]}
            />
            <InfoCard
              university="มหาวิทยาลัยมหิดล"
              faculty="คณะ แพทยศาสตร์ศิริราชพยาบาล"
              major="สาขา กายอุปกรณ์"
              logo="/images/uni-pic/mu.avif"
              image="/images/uni-pic/mock5.avif"
              rounds={[
                { name: 'รอบ 1 Portfolio', quota: 'รับ 327 คน' },
                { name: 'รอบ 2 Quota', quota: 'รับ 38 คน' },
                { name: 'รอบ 3 Admission', quota: 'รับ 240 คน' },
                { name: 'รอบ 4 Direct Admission', quota: 'ไม่เปิดรับสมัคร' },
              ]}
            />
            <InfoCard
              university="มหาวิทยาลัยศรีนครินทรวิโรฒ"
              faculty="คณะ มนุษยศาสตร์"
              major="สาขา จิตวิทยา"
              logo="/images/uni-pic/swu.avif"
              image="/images/uni-pic/mock6.avif"
              rounds={[
                { name: 'รอบ 1 Portfolio', quota: 'รับ 327 คน' },
                { name: 'รอบ 2 Quota', quota: 'รับ 38 คน' },
                { name: 'รอบ 3 Admission', quota: 'รับ 240 คน' },
                { name: 'รอบ 4 Direct Admission', quota: 'ไม่เปิดรับสมัคร' },
              ]}
            />
          </div>

          {/* List for selected items */}
          <div className="w-full max-w-[350px] fixed bottom-4 right-4 bg-primary-700 text-mono-50 p-4 rounded-lg shadow-lg mr-7 mb-4">
            <div className="flex flex-col">
              <p className="text-headline-6 text-monochrome-50 sm:text-headline-5">Compare List ({selectedItems.length})</p>
              <div className="mt-2">
                {selectedItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <p>{item.university}</p>
                    <button onClick={() => setSelectedItems(selectedItems.filter(i => i !== item))}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
