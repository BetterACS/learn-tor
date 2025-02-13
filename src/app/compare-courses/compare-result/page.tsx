'use client';
import { Navbar } from '@/components/index';
import { useState } from 'react';

export default function Page() {
  const [checkedState, setCheckedState] = useState({
    all: false,
    criteria1: false,
    criteria2: false,
    criteria3: false,
    criteria4: false,
    criteria5: false,
  });

  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [isCompared, setIsCompared] = useState(false);

  const criteriaLabels: { [key: string]: string } = {
    criteria1: 'คุณสมบัติที่ต้องการ',
    criteria2: 'ค่าใช้จ่ายตลอดทั้งหลักสูตร',
    criteria3: 'ทุนการศึกษา',
    criteria4: 'อาชีพที่ประกอบได้',
    criteria5: 'ระยะเวลาหลักสูตร',
  };

  const universities = [
    {
      institution: 'มหาวิทยาลัยที่ 1',
      program: 'สาขาวิทยาการคอมพิวเตอร์ประยุกต์',
      faculty: 'คณะวิศวกรรมศาสตร์',
      image: '/images/uni-pic/mock.avif',
      data: {
        criteria1: 'วิศวกรรมคอมพิวเตอร์, วิทยาการคอมพิวเตอร์',
        criteria2: '100,000 บาท/ปี',
        criteria3: 'ทุนการศึกษาเต็มจำนวน',
        criteria4: 'วิศวกร, นักพัฒนาโปรแกรม',
        criteria5: '4 ปี',
      },
    },
    {
      institution: 'มหาวิทยาลัยที่ 2',
      program: 'สาขาการบัญชี',
      faculty: 'คณะเศรษฐศาสตร์',
      image: '/images/uni-pic/mock.avif',
      data: {
        criteria1: 'มนุษยศาสตร์, การจัดการธุรกิจ',
        criteria2: '80,000 บาท/ปี',
        criteria3: 'ทุนการศึกษา 50%',
        criteria4: 'นักบริหารธุรกิจ, นักวิเคราะห์ข้อมูล',
        criteria5: '3 ปี',
      },
    },
    {
      institution: 'มหาวิทยาลัยที่ 3',
      program: 'สาขาวิทยาการคอมพิวเตอร์ประยุกต์',
      faculty: 'คณะวิทยาศาสตร์',
      image: '/images/uni-pic/mock.avif',
      data: {
        criteria1: 'วิศวกรรมไฟฟ้า, วิทยาศาสตร์คอมพิวเตอร์',
        criteria2: '120,000 บาท/ปี',
        criteria3: 'ทุนการศึกษาบางส่วน',
        criteria4: 'นักวิจัย, วิศวกรระบบ',
        criteria5: '4 ปี',
      },
    },
  ];

  const handleCheckboxChange = (id: string) => {
    if (id === 'all') {
      const newState = Object.keys(checkedState).reduce((acc, key) => {
        acc[key] = !checkedState.all;
        return acc;
      }, {} as any);
      setCheckedState({ all: !checkedState.all, ...newState });

      if (!checkedState.all) {
        setSelectedCriteria(Object.keys(criteriaLabels));
      } else {
        setSelectedCriteria([]);
      }
    } else {
      setCheckedState((prevState) => ({
        ...prevState,
        [id]: !prevState[id],
        all: false,
      }));

      setSelectedCriteria((prevSelected) => {
        if (checkedState[id]) {
          return prevSelected.filter((item) => item !== id);
        } else {
          return [...prevSelected, id];
        }
      });
    }
  };

  const handleCompareClick = () => {
    setIsCompared(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 mt-8 py-6 text-center">
        <UniversityDisplay universities={universities} />

        {!isCompared && (
          <ComparisonCriteria
            criteriaLabels={criteriaLabels}
            checkedState={checkedState}
            handleCheckboxChange={handleCheckboxChange}
            handleCompareClick={handleCompareClick}
          />
        )}

        {isCompared && selectedCriteria.length > 0 && (
          <ComparisonResults
            universities={universities}
            selectedCriteria={selectedCriteria}
            criteriaLabels={criteriaLabels}
          />
        )}
      </div>
    </div>
  );
}

const UniversityDisplay = ({ universities }: { universities: any[] }) => (
  <div className={`grid ${universities.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-6`}>
    {universities.map((university, index) => (
      <div key={index} className="flex flex-col items-center space-y-4">
        <div className="text-center">
          <p className="text-headline-4">{university.program}</p>
          <p className="text-headline-5 text-monochrome-700">{university.faculty}</p>
          <p className="text-headline-6 text-monochrome-600">{university.institution}</p>
        </div>
        <img
          src={university.image}
          alt={`${university.name} Image`}
          className="w-[350px] h-[185px] object-cover"
        />
      </div>
    ))}
  </div>
);

const ComparisonCriteria = ({
  criteriaLabels,
  checkedState,
  handleCheckboxChange,
  handleCompareClick,
}: {
  criteriaLabels: { [key: string]: string };
  checkedState: any;
  handleCheckboxChange: (id: string) => void;
  handleCompareClick: () => void;
}) => (
  <>
    <p className="text-headline-4 mb-8 mt-8">What do you need to compare?</p>
    <div className="grid grid-cols-3 gap-x-3 gap-y-2 text-headline-6">
      <div className="space-x-3">
        <input
          type="checkbox"
          id="all"
          checked={checkedState.all}
          onChange={() => handleCheckboxChange('all')}
          className="h-8 w-8 border-monochrome-300 checked:bg-primary-600 cursor-pointer"
        />
        <label htmlFor="all" className="cursor-pointer">
          All
        </label>
      </div>

      <div className="space-y-2">
        {Object.keys(criteriaLabels).map((criteria, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={criteria}
              checked={checkedState[criteria]}
              onChange={() => handleCheckboxChange(criteria)}
              className="h-8 w-8 border-monochrome-300 checked:bg-primary-600 cursor-pointer"
            />
            <label htmlFor={criteria} className="cursor-pointer">
              {criteriaLabels[criteria]}
            </label>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-12">
      <button
        className="px-4 py-2 bg-primary-600 text-monochrome-50 rounded-lg hover:bg-primary-700"
        onClick={handleCompareClick}
      >
        Compare
      </button>
    </div>
  </>
);

const ComparisonResults = ({
  universities,
  selectedCriteria,
  criteriaLabels,
}: {
  universities: any[];
  selectedCriteria: string[];
  criteriaLabels: { [key: string]: string };
}) => (
  <div className="mt-8 text-left">
    <div className={`grid ${universities.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-6`}>
      {universities.map((university, index) => (
        <div key={index} className="space-y-4">
          {selectedCriteria.map((criteria, idx) => (
            <div key={idx} className="text-headline-4 px-8 font-bold mt-8 mb-4">
              <div className="text-left">{criteriaLabels[criteria]}</div>
              <div className="h-[1px] bg-monochrome-200 mt-2 mb-4" />
              <div className="text-headline-5 ">{university.data[criteria]}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);
