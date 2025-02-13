'use client';

import React from 'react';
import type { University } from '@/db/models';

interface CompareItem {
  logo: string;
  university: string;
  major: string;
}

interface CompareListProps {
  selectedItems: University[];
  isCompareListOpen: boolean;
  handleRemoveItem: (index: number) => void;
  handleCompare: () => void;
  handleAddItem: (item:  University) => void;
}

const CompareList: React.FC<CompareListProps> = ({
  selectedItems,
  isCompareListOpen,
  handleRemoveItem,
  handleCompare,
  handleAddItem,
}) => {
  const maxItems = 3;
  
  return (
    <div
      className={`absolute h-[195px] bottom-0 right-0 bg-monochrome-50 p-4 shadow-lg rounded-b-lg w-[360px] overflow-hidden transition-all duration-600 ${
        isCompareListOpen ? 'translate-y-0 opacity-100' : 'translate-y-[70px] opacity-0 pointer-events-none'
      }`}
    >
      {selectedItems.length > 0 ? (
        selectedItems.map((item, index) => (
          <div key={index} className="mt-2 mr-2 flex text-body-large items-center justify-between">
            <div className="flex items-center">
              <img src={item.logo} alt={item.institution} className="h-8 w-8 mr-4" />
              <span>{item.program}</span>
            </div>
            <button onClick={() => handleRemoveItem(index)}>
              <img src="/images/uni-pic/cancel.avif" alt="remove" className="h-6 w-6" />
            </button>
          </div>
        ))
      ) : (
        <p className="mt-12 text-center text-monochrome-500">
          ไม่มีรายการที่เลือก.. <br />
          ( เลือกได้สูงสุด 3 รายการ )
        </p>
      )}

      {selectedItems.length >= maxItems && (
        <p className="text-center text-monochrome-500 absolute bottom-6 left-2 right-2">
          เลือกได้สูงสุด {maxItems} รายการ
        </p>
      )}

      <div className="border-t border-monochrome-300 absolute bottom-16 left-2 right-2"></div>

      {selectedItems.length > 0 && (
        <button
          className="absolute bottom-4 right-4 bg-primary-600 text-monochrome-50 py-2 px-4 rounded-lg hover:bg-primary-700 transition-all"
          onClick={handleCompare}
        >
          Compare
        </button>
      )}
    </div>
  );
};

export default CompareList;
