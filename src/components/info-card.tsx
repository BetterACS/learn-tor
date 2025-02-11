'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

interface UniversityData {
  program: string;
  institution: string;
  info: { name: string, quota: string }[];
  faculty: string;
}

interface InfoCardProps {
  courseId: string;
  onAddToCompare: (item: any) => void;
}

export default function InfoCard({ courseId, onAddToCompare }: InfoCardProps) {
  const [universityData, setUniversityData] = useState<UniversityData | null>(null);

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        const response = await fetch(`/api/trpc/searchUniversities`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            course_id: courseId,
            limit: 1,
          }),
        });

        const result = await response.json();

        if (result.status === 200 && result.data.universities.length > 0) {
          const university = result.data.universities[0];
          setUniversityData({
            program: university.program,
            faculty: university.faculty,
            institution: university.institution,
            info: [
              { name: 'Round 1', quota: university.round_1.length.toString() },
              { name: 'Round 2', quota: university.round_2.length.toString() },
              { name: 'Round 3', quota: university.round_3.length.toString() },
              { name: 'Round 4', quota: university.round_4.length.toString() },
            ],
          });
        } else {
          console.error('No university data found');
        }
      } catch (error) {
        console.error('Error fetching university data:', error);
      }
    };

    fetchUniversityData();
  }, [courseId]);

  const handleAddClick = () => {
    if (universityData) {
      onAddToCompare({
        logo: '/images/logofooter.avif',
        major: universityData.program,
      });
    }
  };

  if (!universityData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex flex-col w-full bg-monochrome-50 shadow-lg rounded-lg overflow-hidden">
      <div className="relative flex items-center">
        <div className="relative w-full md:w-[150px] h-[200px]">
          <Image
            src="/images/uni-pic/mock.avif"
            alt={`Image of ${universityData.institution}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-start pl-4">
          <p className="text-headline-6 text-monochrome-950">{universityData.program}</p>
          <p className="text-body-large text-monochrome-700">{universityData.faculty}</p>
          <p className="text-body-small text-monochrome-600">{universityData.institution}</p>

          <div className="w-full mt-2">
            {universityData.info.map((info, index) => (
              <div key={info.name} className="flex justify-start items-center mb-2 mt-2 ml-3 last:mb-0">
                <span className="text-body-large font-medium text-monochrome-700">{info.name}</span>
                <span className="text-body-large text-monochrome-600 ml-1">{info.quota}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-5 right-5 flex items-center space-x-2">
          <Image
            src="/images/logofooter.avif"
            alt={`${universityData.institution} logo`}
            width={25}
            height={25}
            className="rounded-full"
          />
        </div>
      </div>
      <div className="absolute bottom-4 right-4">
        <button
          className={clsx("p-2 bg-monochrome-50 rounded-md", "hover:bg-monochrome-100 transition")}
          onClick={handleAddClick}
        >
          <Image
            src="/images/uni-pic/add.avif"
            alt="Add"
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
  );
}
