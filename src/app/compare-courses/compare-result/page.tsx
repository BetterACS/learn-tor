'use client';
import { Navbar } from '@/components/index';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { University } from '@/db/models';
import { trpc } from '@/app/_trpc/client';

export default function Page() {
  const [checkedState, setCheckedState] = useState({
    all: false,
    'info.ค่าใช้จ่าย': false,
    'info.อัตราการสำเร็จการศึกษา': false,
    'round': false,
  });

  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [isCompared, setIsCompared] = useState(false);

  const criteriaLabels: { [key: string]: string } = {
    'info.ค่าใช้จ่าย': 'ค่าใช้จ่ายตลอดทั้งหลักสูตร',
    'info.อัตราการสำเร็จการศึกษา': 'อัตราการสำเร็จการศึกษา',
    'round': 'อัตราการรับเข้าศึกษา',
  };

  // Data query zone
  const mutation = trpc.searchUniversities.useMutation();
  const [state, setState] = useState({
    universities: [] as University[],
    error: null as string | null,
  });

  const searchParams = useSearchParams();

  const fetchUniversity = (cur: string): Promise<University | null> => {
    return new Promise((resolve, reject) => {
      mutation.mutate(
        {
          course_id: cur,
          sortBy: 'institution',
          order: 'asc',
          limit: 1,
        },
        {
          onSuccess: (data) => {
            if (data.status === 200 && 'universities' in data.data) {
              resolve((data.data as { universities: University[] }).universities[0]);
            } else {
              reject(new Error('Failed to fetch university data'));
            }
          },
          onError: (error) => {
            reject(error);
          },
        }
      );
    });
  };

  useEffect(() => {
    const dataParam = searchParams.get('data');
    const dummy = dataParam ? JSON.parse(dataParam) : [];
    const fetchAllUniversities = async () => {
      const results: University[] = [];
      for (const cur of dummy) {
        try {
          const result = await fetchUniversity(cur);
          if (result) {
            results.push(result);
          }
        } catch (error) {
          setState((prevState) => ({
            ...prevState,
            error: (error as Error).message,
          }));
        }
      }
      setState((prevState) => ({
        ...prevState,
        universities: results,
      }));
    };
    fetchAllUniversities();
  }, [searchParams]);

  const universities = state.universities.map((university) => ({
    ...university,
  }));

  console.log('university', universities);

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
          <p className="text-headline-5">{university.program}</p>
          <p className="text-headline-5 text-monochrome-600">{university.faculty}</p>
          <p className="text-headline-6 text-monochrome-500">{university.institution}</p>
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
    <p className="text-headline-4 mb-8 mt-8 text-center">What do you need to compare?</p>

    <div className="grid grid-cols-1 gap-y-4 justify-center items-center text-headline-6">
      {Object.keys(criteriaLabels).map((criteria, index) => (
        <div key={index} className="flex items-center justify-center space-x-2 py-3">
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

      <div className="flex items-center justify-center space-x-2 py-3">
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
    </div>

    <div className="mt-12 flex justify-center">
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
}) => {
  const renderCriteriaValue = (university: any, criteriaKey: string) => {
    if (criteriaKey === 'round') {
      // แสดงข้อมูลการรับเข้าศึกษาจาก round_1, round_2, round_3, round_4
      const rounds = [
        { name: 'รอบ 1 Portfolio', data: university.round_1 },
        { name: 'รอบ 2 Quota', data: university.round_2 },
        { name: 'รอบ 3 Admission', data: university.round_3 },
        { name: 'รอบ 4 Direct Admission', data: university.round_4 },
      ];

      return (
        <div>
          {rounds.map((round, index) => (
            <div key={index}>
              <p><strong>{round.name}:</strong></p>
              {round.data && round.data.length > 0 ? (
                round.data.map((item: any, idx: number) => (
                  <div key={idx}>
                    <p>{JSON.stringify(item)}</p>
                  </div>
                ))
              ) : (
                <p>-</p>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      // แสดงข้อมูลทั่วไป
      const value = university.info[criteriaKey];
      return value || '-'; // หากไม่มีข้อมูลให้แสดงเป็น -
    }
  };

  return (
    <div className="mt-8 text-left">
      <div className={`grid ${universities.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-6`}>
        {universities.map((university, index) => (
          <div key={index} className="space-y-4">
            {selectedCriteria.map((criteria, idx) => {
              const criteriaKey = criteria.split('.')[1];
              return (
                <div key={idx} className="text-headline-4 px-8 font-bold mt-8 mb-4">
                  <div className="text-left">{criteriaLabels[criteria]}</div>
                  <div className="h-[1px] bg-monochrome-200 mt-2 mb-4" />
                  <div className="text-headline-5">
                    {renderCriteriaValue(university, criteriaKey)}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};