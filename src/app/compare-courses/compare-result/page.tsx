'use client';
import { Navbar } from '@/components/index';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { University } from '@/db/models';
import { trpc } from '@/app/_trpc/client';

export default function Page() {
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({
    all: false,
    'info.ค่าใช้จ่าย': false,
    'info.อัตราการสำเร็จการศึกษา': false,
    // round_1: false,
    // round_2: false,
    round_3: false,
    // round_4: false,
  });

  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [isCompared, setIsCompared] = useState(false);

  const criteriaLabels: { [key: string]: string } = {
    'info.ค่าใช้จ่าย': 'ค่าใช้จ่ายตลอดทั้งหลักสูตร',
    'info.อัตราการสำเร็จการศึกษา': 'อัตราการสำเร็จการศึกษา',
    // round_1: 'รอบ 1 Portfolio',
    // round_2: 'รอบ 2 Quota',
    round_3: 'รอบ 3 Admission',
    // round_4: 'รอบ 4 Direct Admission',
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
              console.log('University Data:', data.data.universities);
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
      <div className="container mx-auto px-4 mt-8 py-6 text-center ">
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
  <div className="relative">
    <div className="sticky top-20 bg-monochrome-50 z-50 pt-2 pb-4">
      <div className={`grid grid-cols-${universities.length} gap-6 mt-2 text-center`}>
        {universities.map((university, index) => (
          <p key={index} className="text-headline-5 font-bold">{university.program}</p>
        ))}
      </div>
      <div className={`grid grid-cols-${universities.length} gap-6 text-center`}>
        {universities.map((university, index) => (
          <p key={index} className="text-headline-5 text-monochrome-600">{university.faculty}</p>
        ))}
      </div>
      <div className={`grid grid-cols-${universities.length} gap-6 text-center`}>
        {universities.map((university, index) => (
          <p key={index} className="text-headline-6 text-monochrome-500">{university.institution}</p>
        ))}
      </div>
    </div>

    <div className={`grid grid-cols-${universities.length} gap-6 pt-6 max-h-[calc(100vh-240px)] overflow-y-auto`}>
      {universities.map((university, index) => (
        <div key={index} className="flex flex-col items-center space-y-4">
          <img
            src={university.image}
            alt={`${university.name} Image`}
            className="w-[350px] h-[200px] object-cover"
          />
        </div>
      ))}
    </div>
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
}) => {
  const [error, setError] = useState(false);

  const onCompareClick = () => {
    const isChecked = Object.values(checkedState).some((value) => value === true);
    if (!isChecked) {
      setError(true);
    } else {
      setError(false);
      handleCompareClick();
    }
  };

  const onCheckboxChange = (id: string) => {
    setError(false);
    handleCheckboxChange(id);
  };

  return (
    <>
      <p className="text-headline-4 mb-8 mt-8 text-center">What do you need to compare?</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-center items-center text-headline-6 md:ml-6 lg:ml-64">
        {Object.keys(criteriaLabels).map((criteria, index) => (
          <div key={index} className="flex items-center justify-start space-x-2">
            <input
              type="checkbox"
              id={criteria}
              checked={checkedState[criteria]}
              onChange={() => onCheckboxChange(criteria)}
              className="h-6 w-6 border-monochrome-300 checked:bg-primary-600 cursor-pointer"
            />
            <label htmlFor={criteria} className="cursor-pointer text-left">
              {criteriaLabels[criteria]}
            </label>
          </div>
        ))}

        <div className="flex items-center justify-start space-x-1 py-3">
          <input
            type="checkbox"
            id="all"
            checked={checkedState.all}
            onChange={() => onCheckboxChange('all')}
            className="h-6 w-6 border-monochrome-300 checked:bg-primary-600 cursor-pointer"
          />
          <label htmlFor="all" className="cursor-pointer">All</label>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-center mt-4">
          Please select the topic you want to compare.
        </p>
      )}

      <div className="mt-12 flex justify-center">
        <button
          className="px-4 py-2 bg-primary-600 text-monochrome-50 rounded-lg hover:bg-primary-700"
          onClick={onCompareClick}
        >
          Compare
        </button>
      </div>
    </>
  );
};

const ComparisonResults = ({
  universities,
  selectedCriteria,
  criteriaLabels,
}: {
  universities: any[];
  selectedCriteria: string[];
  criteriaLabels: { [key: string]: string };
}) => {
  const formatCriteriaValue = (value: any) => {
    if (value === null || value === undefined) {
      return <span>-</span>;
    }
    if (typeof value === 'object') {
      return (
        <div className="text-left space-y-2">
          {Object.entries(value).map(([key, val], index) => {
            return (
              <div key={index} className="flex flex-col">
                <strong className="text-monochrome-600">{key}:</strong>
                {val === null || val === undefined ? (
                  <span>-</span>
                ) : typeof val === 'object' ? (
                  <div className="ml-4">{formatCriteriaValue(val)}</div>
                ) : (
                  <span>{typeof val === 'string' ? val : '-'}</span>
                )}
              </div>
            );
          })}
        </div>
      );
    }
    return <span>{typeof value === 'string' ? value : '-'}</span>;
  };

  const renderCriteriaValue = (university: any, criteriaKey: string) => {
    if (criteriaKey.startsWith('round_')) {
      const roundData = university[criteriaKey];
      if (!roundData || roundData.length === 0) {
        return <p>-</p>;
      }

      const uniqueRoundData = roundData.filter((value: any, index: number, self: any[]) =>
        index === self.findIndex((t: any) => (
          JSON.stringify(t) === JSON.stringify(value)
        ))
      );

      return (
        <div>
          {uniqueRoundData.length > 0 ? (
            uniqueRoundData.map((item: any, idx: number) => {
              if (criteriaKey === 'round_3') {
                const {
                  register,
                  passed,
                  max_score,
                  min_score,
                  acceptance_rate,
                  enrollment_rate,
                } = item;
                const enrollment_count = Math.round((passed * parseFloat(enrollment_rate)) / 100);

                return (
                  <div key={idx} className="mb-4">
                    <p>
                      <span>สมัครสอบ: </span> {register || '-'}<br />
                      <span>ผ่าน: </span> {passed || '-'}<br />
                      <span>คะแนนสูงสุด: </span> {max_score || '-'}<br />
                      <span>คะแนนต่ำสุด: </span> {min_score || '-'}<br />
                      <span>อัตราการรับเข้าเรียน: </span> {acceptance_rate || '-'}<br />
                      <span>อัตราการลงทะเบียน: </span> {enrollment_rate || '-'}<br />
                      <span>จำนวนคนที่ยืนยันสิทธิ์: </span> {enrollment_count || '-'}<br />
                    </p>
                  </div>
                );
              } else {
                return (
                  <div key={idx} className="mb-4">
                    <pre className="whitespace-pre-wrap text-left">
                      {JSON.stringify(item, null, 2)
                        .replace(/\\n/g, '\n')
                        .replace(/^\s+/g, '')}
                    </pre>
                  </div>
                );
              }
            })
          ) : (
            <p>-</p>
          )}
        </div>
      );
    } else if (criteriaKey === 'info.ค่าใช้จ่าย' || criteriaKey === 'info.อัตราการสำเร็จการศึกษา') {
      const value = university.info[criteriaKey.split('.')[1]];
      return value ? (
        <p className="break-words overflow-wrap">{value}</p>
      ) : (
        <p>-</p>
      );
    } else {
      const value = university.info[criteriaKey];
      return value ? formatCriteriaValue(value) : '-';
    }
  };

  return (
    <div className="mt-8 text-left">
      <div className="grid gap-6">
        {selectedCriteria.map((criteria, idx) => (
          <div key={idx} className="space-y-4">
            <div className="text-headline-4 px-8 font-bold mt-8 mb-4">
              <div className="text-left">{criteriaLabels[criteria]}</div>
              <div className="h-[1px] bg-monochrome-200 mt-2 mb-4" />
              <div className={`grid gap-4 ${universities.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {universities.map((university, index) => (
                  <div key={index} className="text-headline-6">
                    {renderCriteriaValue(university, criteria)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};