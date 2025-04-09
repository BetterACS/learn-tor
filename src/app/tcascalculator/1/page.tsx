'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Navbar, Footer, Calculator, SearchableDropdown, ScoreInput } from '@/components/index';
import { trpc } from '@/app/_trpc/client';


interface Target {
  university: string;
  campus: string;
  faculty: string;
  major: string;
  language: string;
  examType: string;
}

export default function Calculator1() {
  const [targets, setTargets] = useState<Target[]>([]);
  const router = useRouter();

  // Options ที่ดึงมาจาก API
  const [universityOptions, setUniversityOptions] = useState<string[]>([]);
  const [facultyOptions, setFacultyOptions] = useState<string[]>([]);
  const [campusOptions, setCampusOptions] = useState<string[]>([]);
  const [majorOptions, setMajorOptions] = useState<string[]>([]);
  const [languageOptions, setLanguageOptions] = useState<string[]>([]);
  const [examTypeOptions, setExamTypeOptions] = useState<string[]>([]);

  // tRPC Mutation
  const fetchMutation = trpc.getFilteredUniversities.useMutation({
    onSuccess: (res) => {
      const data = res.data;
      console.log("Fetched options:", data);
      if ('unique_universities' in data) {
        setUniversityOptions(data.unique_universities || []);
      } else {
        console.error("Unexpected data structure:", data);
      }
      setFacultyOptions('unique_faculties' in data ? data.unique_faculties || [] : []);
      setCampusOptions('unique_campuses' in data ? data.unique_campuses || [] : []);
      setMajorOptions('unique_programs' in data ? data.unique_programs || [] : []);
      setLanguageOptions('unique_course_types' in data ? data.unique_course_types || [] : []);
      setExamTypeOptions('unique_admissionTypes' in data ? data.unique_admissionTypes || [] : []);
    },
    onError: (error) => {
      console.error("Fetch options error:", error);
    },
  });

  // ดึงข้อมูล options
  const fetchOptions = (target: Partial<Target>) => {
    fetchMutation.mutate({
      institution: target.university || "",
      faculty: target.faculty || "",
      program: target.major || "",
      course_type: target.language || "",
      campus: target.campus || "",
      admissionType: target.examType || "",
    });
  };

  // เรียกตอนโหลดครั้งแรก
  useEffect(() => {
    fetchOptions({});
  }, []);

  // เรียกเมื่อ target เปลี่ยน
  useEffect(() => {
    if (targets.length > 0) {
      const latestTarget = targets[targets.length - 1];
      fetchOptions(latestTarget);
    }
  }, [targets]);

  const handleBackClick = () => {
    router.push('/tcascalculator');
  };

  const handleNextClick = () => {
    // เลือก target ตัวสุดท้ายจาก targets
    const target = targets[targets.length - 1];
    router.push(`/tcascalculator/2?university=${encodeURIComponent(target.university)}&campus=${encodeURIComponent(target.campus)}&faculty=${encodeURIComponent(target.faculty)}&major=${encodeURIComponent(target.major)}&language=${encodeURIComponent(target.language)}&examType=${encodeURIComponent(target.examType)}`);
  };

  const addTarget = () => {
    setTargets([
      ...targets,
      {
        university: "",
        campus: "",
        faculty: "",
        major: "",
        language: "",
        examType: ""
      },
    ]);
  };

  const updateTarget = (index: number, field: keyof Target, value: string) => {
    const updatedTargets = [...targets];
    updatedTargets[index] = { ...updatedTargets[index], [field]: value };
    setTargets(updatedTargets);
  };

  const removeTarget = (index: number) => {
    const updatedTargets = targets.filter((_, i) => i !== index);
    setTargets(updatedTargets);
  };

  // Helper function to check if all previous fields are filled
  const areAllPreviousFieldsFilled = (target: Target) => {
    return Boolean(
      target.university && 
      target.campus && 
      target.faculty && 
      target.major && 
      target.language
    );
  };

  const areAllmostFieldsFilled = (target: Target) => {
    return Boolean(
      target.university && 
      target.campus && 
      target.faculty && 
      target.language 
    );
  }

  return (
    <>
      <Navbar />
      <div className="relative h-screen flex flex-col items-center">
        {/* ปุ่มกลับ */}
        <button
          className="absolute top-20 left-20 flex items-center gap-2 transition text-lg font-medium group"
          onClick={handleBackClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-black group-hover:text-primary-700 transition">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <div className="text-black text-headline-5 group-hover:text-primary-700 transition">กลับ</div>
        </button>

        {/* เส้น Step */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-40">
          <div className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-monochrome-50 border-2 border-primary-600 shadow-md">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white text-2xl font-bold">1</span>
            <span className="text-headline-5 font-medium">เลือกเป้าหมาย</span>
          </div>
          <div className="h-1 w-72 bg-primary-600"></div>
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 text-2xl font-bold border-2 border-primary-600">2</span>
          <div className="h-1 w-72 bg-primary-600"></div>
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 text-2xl font-bold border-2 border-primary-600">3</span>
        </div>

        <div>
          {/* หัวข้อ Step 1 */}
          <div className="flex items-center gap-4 w-[800px] mb-4 mt-10">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white text-2xl font-bold">1</span>
            <span className="text-headline-5 font-medium text-black">เลือกเป้าหมาย</span>
          </div>

          {/* กล่องข้อมูล */}
          <div className="bg-white w-full max-w-[1000px] p-6 rounded-lg shadow-lg border border-gray-300 mt-10">
            <h2 className="text-headline-5 font-semibold text-black mb-4">คำนวณโอกาสสอบติดจากเป้าหมายที่เลือก</h2>

            {targets.map((target, index) => (
              <div key={index} className="relative mb-4 p-4 bg-gray-100 rounded-lg border">
                <button 
                  className="absolute top-2 right-4 text-primary-600 hover:text-red-800 transition"
                  onClick={() => removeTarget(index)}
                >
                  <svg aria-hidden="true" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 laptop:h-6 laptop:w-6">
                        <path d="M177.1 48h93.7c2.7 0 5.2 1.3 6.7 3.6l19 28.4h-145l19-28.4c1.5-2.2 4-3.6 6.7-3.6zM354.2 80L317.5 24.9C307.1 9.4 289.6 0 270.9 0H177.1c-18.7 0-36.2 9.4-46.6 24.9L93.8 80H80.1 32 24C10.7 80 0 90.7 0 104s10.7 24 24 24H35.6L59.6 452.7c2.5 33.4 30.3 59.3 63.8 59.3H324.6c33.5 0 61.3-25.9 63.8-59.3L412.4 128H424c13.3 0 24-10.7 24-24s-10.7-24-24-24h-8H367.9 354.2z" fill="currentColor"></path>
                  </svg>
                </button>

                <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                  {/* มหาวิทยาลัย */}
                  <div>
                    <label className="text-headline-6 font-semibold mb-2 block">มหาวิทยาลัย</label>
                    <SearchableDropdown
                      value={target.university}
                      onChange={(val) => updateTarget(index, "university", val)}
                      options={universityOptions}
                      placeholder="เลือกมหาวิทยาลัย"
                    />
                  </div>

                  {/* วิทยาเขต */}
                  <div>
                    <label className="text-headline-6 font-semibold mb-2 block">วิทยาเขต</label>
                    <SearchableDropdown
                      value={target.campus}
                      onChange={(val) => updateTarget(index, "campus", val)}
                      options={campusOptions}
                      placeholder="เลือกวิทยาเขต"
                    />
                  </div>

                  {/* คณะ */}
                  <div>
                    <label className="text-headline-6 font-semibold mb-2 block">คณะ</label>
                    <SearchableDropdown
                      value={target.faculty}
                      onChange={(val) => updateTarget(index, "faculty", val)}
                      options={facultyOptions}
                      placeholder="เลือกคณะ"
                    />
                  </div>

                  {/* สาขา */}
                  <div>
                    <label className="text-headline-6 font-semibold mb-2 block">สาขา/หลักสูตร</label>
                    <SearchableDropdown
                      value={target.major}
                      onChange={(val) => updateTarget(index, "major", val)}
                      options={majorOptions}
                      placeholder="เลือกสาขา"
                      disabled={!areAllmostFieldsFilled(target)}
                    />
                  </div>

                  {/* ภาษา */}
                  <div>
                    <label className="text-headline-6 font-semibold mb-2 block">หลักสูตรภาษา</label>
                    <SearchableDropdown
                      value={target.language}
                      onChange={(val) => updateTarget(index, "language", val)}
                      options={languageOptions}
                      placeholder="เลือกภาษา"
                    />
                  </div>

                  {/* รูปแบบการรับ */}
                  <div>
                    <label className="text-headline-6 font-semibold mb-2 block">รูปแบบการรับ</label>
                    <SearchableDropdown
                      value={target.examType}
                      onChange={(val) => updateTarget(index, "examType", val)}
                      options={examTypeOptions}
                      placeholder="เลือกรูปแบบการรับ"
                      disabled={!areAllPreviousFieldsFilled(target)}
                    />
                  </div>
                </div>
              </div>
            ))}

            {targets.length < 1 && (
              <div 
                className="flex items-center border border-dashed border-primary-600 rounded-lg py-3 px-4 cursor-pointer text-primary-600 text-center mt-4"
                onClick={addTarget}
              >
                <span className="mx-auto text-headline-6">+ เพิ่มเป้าหมายที่ต้องการเลือก</span>
              </div>
            )}
          </div>

          {/* ปุ่มถัดไป */}
          <div className="flex justify-center mt-6">
            <button 
              className="mt-10 mb-10 bg-primary-600 text-white px-10 py-3 rounded-lg hover:bg-primary-700 transition text-big-button w-120"
              onClick={handleNextClick}
            >
              ขั้นตอนต่อไป
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
