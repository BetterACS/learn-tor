'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Navbar, Footer, ScoreInput, EditButtons, SpecialInput, GpaxInput, SelectPlan  } from '@/components/index';
import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { AlertBox } from '@/components/index';

interface CustomSession {
  user?: {
    id?: string;
    username?: string;
    email?: string;
  };
}

interface FormData {
  GPAX: string;
  TGAT1: string;
  TGAT2: string;
  TGAT3: string;
  TPAT21: string;
  TPAT22: string;
  TPAT23: string;
  TPAT3: string;
  TPAT4: string;
  TPAT5: string;
  A_MATH1: string;
  A_MATH2: string;
  A_SCIENCE: string;
  A_PHYSIC: string;
  A_BIOLOGY: string;
  A_CHEMISTRY: string;
  A_SOCIAL: string;
  A_THAI: string;
  A_ENGLISH: string;
  A_FRANCE: string;
  A_GERMANY: string;
  A_JAPAN: string;
  A_PALI: string;
  A_CHINESE: string;
  A_KOREAN: string;
  A_SPANISH: string;
  lesson_plan: string;
}

const initialFormData: FormData = {
  GPAX: '', TGAT1: '', TGAT2: '', TGAT3: '', TPAT21: '', TPAT22: '', TPAT23: '',
  TPAT3: '', TPAT4: '', TPAT5: '', A_MATH1: '', A_MATH2: '', A_SCIENCE: '',
  A_PHYSIC: '', A_BIOLOGY: '', A_CHEMISTRY: '', A_SOCIAL: '', A_THAI: '',
  A_ENGLISH: '', A_FRANCE: '', A_GERMANY: '', A_JAPAN: '', A_PALI: '',
  A_CHINESE: '', A_KOREAN: '', A_SPANISH: '',lesson_plan: '',
};
  
export default function Calculator2() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { data: session } = useSession() as { data: CustomSession | null };
  const { data: scoreData, isLoading, error } = trpc.queryScore.useQuery(
    { email: session?.user?.email || '' },
    { enabled: !!session?.user?.email }
  );
  const [isEditing, setIsEditing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [alertMessage, setAlertMessage] = useState('');

  const searchParams = useSearchParams(); // ดึง search params จาก URL
  const university = searchParams.get('university');
  const campus = searchParams.get('campus');
  const faculty = searchParams.get('faculty');
  const major = searchParams.get('major');
  const language = searchParams.get('language');
  const examType = searchParams.get('examType');
  const [minScore, setMinScore] = useState(null);
  const [scoreCalculator, setScoreCalculator] = useState(null);
  const [requiredScores, setRequiredScores] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const requireScore = trpc.requireScore.useMutation({
    onSuccess: (response) => {
      console.log("Response data:", response); // ตรวจสอบค่าที่ได้รับ
  
      if (response?.data) { 
        setRequiredScores(response.data.new_culcurate); // เก็บค่าที่ได้จาก API
         // ตรวจสอบค่าที่ได้รับ
      }
    },
    onError: (error) => {
      console.error("Error fetching required scores:", error);
    },
  });
  console.log(minScore, scoreCalculator); // เช็คค่าที่ดึงมา
  
  console.log("Required scores:", requiredScores);
  console.log(typeof requiredScores);

  useEffect(() => {
    if (university && campus && faculty && major && language && examType) {
      requireScore.mutate({
        institution: university,
        campus: campus,
        faculty: faculty,
        program: major,
        course_type: language,
        admission_type: examType,
      });
    }
  }, []);


  console.log(university, campus, faculty, major, language, examType); // เช็คค่าที่ดึงมา

  useEffect(() => {
    if (scoreData) {
      const { score, GPAX, lesson_plan } = scoreData;
      const { __v, _id, user_id, SPEACIAL, ...restScores } = score || {};

      const cleanedScores: Partial<FormData> = {};
      for (const [key, value] of Object.entries(restScores)) {
        cleanedScores[key] = value !== null ? String(value) : '';
      }
  
      setFormData((prev) => ({
        ...prev,
        ...cleanedScores,
        GPAX: GPAX?.toString() || '', // แปลงเป็น string สำหรับ input
        lesson_plan: lesson_plan || '',
      }));
    }
  }, [scoreData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const mutation = trpc.editCalculate.useMutation();

  const handleSaveClick = async () => { 
    if (!session?.user?.email) {
      console.error('ไม่พบอีเมลของผู้ใช้');
      return;
    }
  
    const maxScoresObject: Record<string, number> = {};
  
    if (requiredScores) {
      Object.entries(requiredScores).forEach(([label, detail]) => {
        if (detail.type === 'max' && Array.isArray(detail.base_subjects)) {
          detail.base_subjects.forEach((subject) => {
            const fieldName = scoreName[subject]; // เช่น "A_ENGLISH"
            const value = formData[fieldName];
            if (value) {
              maxScoresObject[subject] = parseFloat(value);
            }
          });
        }
      });
    }
  
    console.log('MAX ที่จะเซฟ:', maxScoresObject);
  
    const specialScoresArray: Array<Record<string, number>> = [];
  
    if (requiredScores) {
      Object.entries(requiredScores).forEach(([label, detail]) => {
        if (detail.type === 'special') {
          const fullLabel = fullLabelMap[label] || label;
          const score = formData[label]; 
          const maxValue = formData[`${label}_max`]; 
  
          if (score && maxValue) {
            const specialObj: Record<string, number> = {};
            specialObj[fullLabel] = parseFloat(score);
            specialObj[`${fullLabel}เต็ม`] = parseFloat(maxValue);
            specialScoresArray.push(specialObj);
          }
        }
      });
    }
  
    console.log('SPEACIAL ที่จะเซฟ:', specialScoresArray);
  
    try {
      const scoreResult = await mutation.mutateAsync({
        email: session.user.email,
        scores: {
          ...formData,
          MAX: [maxScoresObject],
          SPEACIAL: specialScoresArray,
        },
      });
  
      console.log('Data saved successfully:', scoreResult);

      setIsEditing(false);
  
      setAlertType('success');
      setAlertMessage('บันทึกคะแนนเรียบร้อยแล้ว!');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
  
    } catch (err) {
      console.error('Error saving data:', err);
  
      setAlertType('error');
      setAlertMessage('เกิดข้อผิดพลาดในการบันทึกคะแนน กรุณาลองใหม่อีกครั้ง');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const scoreName = {
    "การสื่อสารภาษาอังกฤษ (TGAT1)": "TGAT1",
    "การคิดอย่างมีเหตุผล (TGAT2)": "TGAT2",
    "สมรรถนะการทำงาน (TGAT3)": "TGAT3",
    "ทัศนศิลป์ (TPAT21)": "TPAT21",
    "ดนตรี (TPAT22)": "TPAT22",
    "นาฏศิลป์ (TPAT23)": "TPAT23",
    "ความถนัดวิทยาศาสตร์ เทคโนโลยี วิศวกรรมศาสตร์ (TPAT3)": "TPAT3",
    "ความถนัดสถาปัตยกรรมศาสตร์ (TPAT4)": "TPAT4",
    "ความถนัดครุศาสตร์-ศึกษาศาสตร์ (TPAT 5)": "TPAT5",
    "A-Level คณิตศาสตร์ประยุกต์ 1 (พื้นฐาน+เพิ่มเติม)": "A_MATH1",
    "A-Level คณิตศาสตร์ประยุกต์ 2 (พื้นฐาน)": "A_MATH2",
    "A-Level ฟิสิกส์": "A_PHYSIC",
    "A-Level เคมี": "A_CHEMISTRY",
    "A-Level ชีววิทยา": "A_BIOLOGY",
    "A-Level วิทยาศาสตร์ประยุกต์": "A_SCIENCE",
    "A-Level สังคมศาสตร์": "A_SOCIAL",
    "A-Level ภาษาไทย": "A_THAI",
    "A-Level ภาษาอังกฤษ": "A_ENGLISH",
    "A-Level ภาษาฝรั่งเศส": "A_FRANCE",
    "A-Level ภาษาเยอรมัน": "A_GERMANY",
    "A-Level ภาษาญี่ปุ่น": "A_JAPAN",
    "A-Level ภาษาเกาหลี": "A_KOREAN",
    "A-Level ภาษาจีน": "A_CHINESE",
    "A-Level ภาษาบาลี": "A_PALI",
    "A-Level ภาษาสเปน": "A_SPANISH",
  };
  
  const formula = requiredScores || {};
  console.log(formula);
  const showTGATBlock = requiredScores
  ? Object.keys(requiredScores).some((key) => key.includes('TGAT'))
  : false;

  const showTPATBlock = requiredScores
  ? ['ทัศนศิลป์ (TPAT21)', 'ดนตรี (TPAT22)', 'นาฏศิลป์ (TPAT23)', 'ความถนัดวิทยาศาสตร์ เทคโนโลยี วิศวกรรมศาสตร์ (TPAT3)', 'ความถนัดสถาปัตยกรรมศาสตร์ (TPAT4)', 'ความถนัดครุศาสตร์-ศึกษาศาสตร์ (TPAT 5)'].some((field) =>
      Object.keys(requiredScores).includes(field)
    )
  : false;

  const showALevelBlock = requiredScores
  ? [
      'A-Level คณิตศาสตร์ประยุกต์ 1 (พื้นฐาน+เพิ่มเติม)', 'A-Level คณิตศาสตร์ประยุกต์ 2 (พื้นฐาน)', 'A-Level วิทยาศาสตร์ประยุกต์', 'A-Level ฟิสิกส์', 'A-Level ชีววิทยา', 'A-Level เคมี',
      'A-Level สังคมศาสตร์', 'A-Level ภาษาไทย', 'A-Level ภาษาอังกฤษ', 'A-Level ภาษาฝรั่งเศส', 'A-Level ภาษาเยอรมัน', 'A-Level ภาษาญี่ปุ่น',
      'A-Level ภาษาเกาหลี', 'A-Level ภาษาจีน', 'A-Level ภาษาบาลี', 'A-Level ภาษาสเปน'
    ].some((field) => Object.keys(requiredScores).includes(field))
  : false;

  const labelMap: Record<string, string> = {};
  Object.keys(formula).forEach((rawKey) => {
    const [name, labelText] = rawKey.split(':').map((s) => s.trim());
    if (name) labelMap[name] = labelText ? `${name} ${labelText}` : name;
  });

  console.log(formData)

  const fullLabelMap: Record<string, string> = {
    TPAT21: 'TPAT2.1 ความถนัดศิลปกรรมศาสตร์ ทัศนศิลป์',
    TPAT22: 'TPAT2.2 ความถนัดศิลปกรรมศาสตร์ ดนตรี',
    TPAT23: 'TPAT2.3 ความถนัดศิลปกรรมศาสตร์ นาฏศิลป์',
    TPAT3: 'TPAT3 ความถนัดด้านวิทยาศาสตร์ เทคโนโลยี และนวัตกรรม',
    TPAT4: 'TPAT4 ความถนัดทางสถาปัตยกรรม',
    TPAT5: 'TPAT5 ความถนัดครุศาสตร์-ศึกษาศาสตร์',
    A_MATH1: 'A-Level คณิตศาสตร์ประยุกต์ 1',
    A_MATH2: 'A-Level คณิตศาสตร์ประยุกต์ 2',
    A_SCIENCE: 'A-Level วิทยาศาสตร์ประยุกต์',
    A_PHYSIC: 'A-Level ฟิสิกส์',
    A_BIOLOGY: 'A-Level ชีววิทยา',
    A_CHEMISTRY: 'A-Level เคมี',
    A_SOCIAL: 'A-Level สังคมศึกษา',
    A_THAI: 'A-Level ภาษาไทย',
    A_ENGLISH: 'A-Level ภาษาอังกฤษ',
    A_FRANCE: 'A-Level ภาษาฝรั่งเศส',
    A_GERMANY: 'A-Level ภาษาเยอรมัน',
    A_JAPAN: 'A-Level ภาษาญี่ปุ่น',
    A_KOREAN: 'A-Level ภาษาเกาหลี',
    A_CHINESE: 'A-Level ภาษาจีน',
    A_PALI: 'A-Level ภาษาบาลี',
    A_SPANISH: 'A-Level ภาษาสเปน',
  };

  const buildScoreObject = () => {
    const scoreObj = {};
  
    // ถ้า requiredScores มี "เกรดเฉลี่ย" และเป็น type: 'single' → ค่อยดึงค่า GPAX
    if (
      requiredScores &&
      requiredScores['เกรดเฉลี่ย'] &&
      requiredScores['เกรดเฉลี่ย'].type === 'single'
    ) {
      const gpax = parseFloat(formData.GPAX);
      if (!isNaN(gpax)) {
        const convertedGpax = (gpax / 4) * 100;
        scoreObj['เกรดเฉลี่ย'] = {
          type: 'single',
          base_subjects: 'เกรดเฉลี่ย',
          weight: requiredScores['เกรดเฉลี่ย'].weight,
          score: convertedGpax,
        };
      }
    }
  
    if (!requiredScores) return scoreObj;
  
    Object.entries(requiredScores).forEach(([label, detail]) => {
      if (label === 'เกรดเฉลี่ย') return; // ข้ามซ้ำ เพราะจัดการแล้วด้านบน
  
      if (detail.type === 'single') {
        const scoreValue = parseFloat(formData[scoreName[label]]);
        if (!isNaN(scoreValue)) {
          scoreObj[label] = {
            type: 'single',
            base_subjects: detail.base_subjects,
            weight: detail.weight,
            score: scoreValue,
          };
        }
      } else if (detail.type === 'max' && Array.isArray(detail.base_subjects)) {
        let maxScore = -1;
        let maxSubject = '';
        detail.base_subjects.forEach((subj) => {
          const value = parseFloat(formData[scoreName[subj]]);
          if (!isNaN(value) && value > maxScore) {
            maxScore = value;
            maxSubject = subj;
          }
        });
  
        if (maxSubject && maxScore !== -1) {
          scoreObj[label] = {
            type: 'max',
            base_subjects: maxSubject,
            weight: detail.weight,
            score: maxScore,
          };
        }
      } else if (detail.type === 'special') {
        const rawScore = parseFloat(formData[label]);
        const maxScore = parseFloat(formData[`${label}_max`]);
        if (!isNaN(rawScore) && !isNaN(maxScore) && maxScore > 0) {
          const calculatedScore = (rawScore / maxScore) * 100;
          scoreObj[label] = {
            type: 'special',
            base_subjects: detail.base_subjects,
            weight: detail.weight,
            score: calculatedScore,
          };
        }
      }
    });
  
    return scoreObj;
  };

  const isAllRequiredFieldsFilled = () => {
    if (!requiredScores || Object.keys(requiredScores).length === 0) return false;
  
    let hasAtLeastOneMaxScore = false;
  
    for (const [label, detail] of Object.entries(requiredScores)) {
      if (detail.type === 'single') {
        const value = formData[scoreName[label]];
        if (!value || String(value).trim() === '') return false;
      } else if (detail.type === 'special') {
        const value = formData[label];
        const max = formData[`${label}_max`];
        if (!value || !max || String(value).trim() === '' || String(max).trim() === '') return false;
      } else if (detail.type === 'max' && Array.isArray(detail.base_subjects)) {
        const hasFilled = detail.base_subjects.some(
          (subj) =>
            formData[scoreName[subj]] &&
            String(formData[scoreName[subj]]).trim() !== ''
        );
        if (hasFilled) hasAtLeastOneMaxScore = true;
      }
    }
  
    // เช็คเฉพาะตอนมี max-type
    const hasMaxSubject = Object.values(requiredScores).some((r: any) => r.type === 'max');
    if (hasMaxSubject && !hasAtLeastOneMaxScore) return false;
  
    // GPAX
    if (
      requiredScores['เกรดเฉลี่ย']?.type === 'single' &&
      (!formData.GPAX || String(formData.GPAX).trim() === '')
    ) return false;
  
    // แผนการเรียน
    if (!formData.lesson_plan || String(formData.lesson_plan).trim() === '') return false;
  
    return true;
  };
  
  
  
  const saveResult = trpc.saveResult.useMutation();

  const handleCalculateClick = async () => {
    if (!isAllRequiredFieldsFilled()) {
      setAlertType('error');
      setAlertMessage('กรุณากรอกคะแนนให้ครบทุกช่องที่จำเป็นก่อนคำนวณ');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    // Set loading state to true
    setIsCalculating(true);

    const scorePayload = {
      email: session?.user?.email || '',
      institution: university || '',
      campus: campus || '',
      faculty: faculty || '',
      program: major || '',
      course_type: language || '',
      admission_type: examType || '',
      score: buildScoreObject(), 
    };

    try {
      // เรียก saveResult ไป backend
      const saveResponse = await saveResult.mutateAsync({
        email: scorePayload.email,
        institution: scorePayload.institution,
        campus: scorePayload.campus,
        faculty: scorePayload.faculty,
        program: scorePayload.program,
        course_type: scorePayload.course_type,
        admission_type: scorePayload.admission_type,
        score: scorePayload.score,
      });

      console.log("ผลลัพธ์จาก saveResult:", saveResponse);

      const resultId = saveResponse.data.result_id;

      // push ไปหน้า /tcascalculator/3 พร้อม query
      const query = new URLSearchParams({
        data: JSON.stringify(saveResponse.data),
        result_id: resultId,
      }).toString();

      router.push(`/tcascalculator/3?${query}`);

    } catch (error) {
      console.error("เกิดข้อผิดพลาดตอน saveResult:", error);
      alert("ไม่สามารถบันทึกผลได้");

      // Set loading state back to false if there's an error
      setIsCalculating(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen flex flex-col items-center">
        <button
          className="absolute top-20 left-20 flex items-center gap-2 transition text-lg font-medium group"
          onClick={() => router.push('/tcascalculator/1')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6 text-black group-hover:text-primary-700 transition"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <div className="text-black text-headline-5 group-hover:text-primary-700 transition">กลับ</div>
        </button>

        {/* Step bar */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-40">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 text-2xl font-bold border-2 border-primary-600">1</span>
          <div className="h-1 w-72 bg-primary-600"></div>
          <div className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-monochrome-50 border-2 border-primary-600 shadow-md">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white text-2xl font-bold">2</span>
            <span className="text-headline-5 font-medium">กรอกคะแนนสอบ</span>
          </div>
          <div className="h-1 w-72 bg-primary-600"></div>
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 text-2xl font-bold border-2 border-primary-600">3</span>
        </div>

        <div className="w-full max-w-screen-xl mt-10 px-6">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 overflow-x-auto">
            <div className="text-monochrome-800 text-headline-6 mt-3 relative flex items-center whitespace-nowrap">
              GPAX และ ประเภทของหลักสูตรการศึกษา
              <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
                  </div>
               <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
                <GpaxInput label="GPAX เกรดเฉลี่ยรวม" value={formData.GPAX} onChange={handleChange} isEditing={isEditing} name="GPAX"/>
                <SelectPlan
                                label="ประเภทของหลักสูตรการศึกษา"
                                name="lesson_plan"
                                value={formData.lesson_plan}
                                disabled={!isEditing}
                                onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                                options={[
                                  'หลักสูตรแกนกลาง',
                                  'หลักสูตรนานาชาติ',
                                  'หลักสูตรอาชีวะ',
                                  'หลักสูตรตามอัธยาศัย (กศน.)',
                                  'หลักสูตร GED',
                                ]}
                />
            </div>
            {showTGATBlock && (
              <>
                <div className="text-monochrome-800 text-headline-6 mt-6 relative flex items-center whitespace-nowrap">
                  TGAT ความถนัดทั่วไป
                  <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
                  <ScoreInput label="การสื่อสารภาษาอังกฤษ (TGAT1)" value={formData.TGAT1} onChange={handleChange} isEditing={isEditing} name="TGAT1" />
                  <ScoreInput label="TGAT2 การคิดอย่างมีเหตุผล" value={formData.TGAT2} onChange={handleChange} isEditing={isEditing} name="TGAT2" />
                  <ScoreInput label="TGAT3 สมรรถนะการทำงานในอนาคต" value={formData.TGAT3} onChange={handleChange} isEditing={isEditing} name="TGAT3" />
                </div>
              </>
            )}
            
              {showTPATBlock && (
                <>
                  <div className="text-monochrome-800 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
                    TPAT ความถนัดทางวิชาชีพ
                    <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
                    {Object.entries(labelMap).map(([name, label]) => {
                      if (['ทัศนศิลป์ (TPAT21)', 'ดนตรี (TPAT22)', 'นาฏศิลป์ (TPAT23)', 'ความถนัดวิทยาศาสตร์ เทคโนโลยี วิศวกรรมศาสตร์ (TPAT3)', 'ความถนัดสถาปัตยกรรมศาสตร์ (TPAT4)', 'ความถนัดครุศาสตร์-ศึกษาศาสตร์ (TPAT 5)'].includes(name)) {
                        return (
                          <ScoreInput
                            key={name}
                            label={fullLabelMap[name] || label}
                            value={formData[scoreName[name]]}
                            onChange={handleChange}
                            isEditing={isEditing}
                            name={scoreName[name]}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
               </>
             )}

            {showALevelBlock && (
              <>
                <div className="text-monochrome-800 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
                  A - Level
                  <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
                  {Object.entries(labelMap).map(([name, label]) => {
                    if ([
                        'A-Level คณิตศาสตร์ประยุกต์ 1 (พื้นฐาน+เพิ่มเติม)', 'A-Level คณิตศาสตร์ประยุกต์ 2 (พื้นฐาน)', 'A-Level วิทยาศาสตร์ประยุกต์', 'A-Level ฟิสิกส์', 'A-Level ชีววิทยา', 'A-Level เคมี',
                        'A-Level สังคมศาสตร์', 'A-Level ภาษาไทย', 'A-Level ภาษาอังกฤษ', 'A-Level ภาษาฝรั่งเศส', 'A-Level ภาษาเยอรมัน', 'A-Level ภาษาญี่ปุ่น',
                        'A-Level ภาษาเกาหลี', 'A-Level ภาษาจีน', 'A-Level ภาษาบาลี', 'A-Level ภาษาสเปน'
                      ].includes(name)) {
                      return (
                        <ScoreInput
                          key={name}
                          label={fullLabelMap[name] || label}
                          value={formData[scoreName[name]]}
                          onChange={handleChange}
                          isEditing={isEditing}
                          name={scoreName[name]}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </>
            )}

            {Object.entries(formula).some(([_, detail]) => detail.type === 'max' && Array.isArray(detail.base_subjects)) && (
              <>
                <div className="text-monochrome-800 text-headline-6 mt-10 relative flex items-center whitespace-nowrap"> 
                  กลุ่มวิชาภาษาต่างประเทศ (ไม่จำเป็นต้องใส่ครบทุกอัน)
                  <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
                  {Object.entries(formula).map(([name, detail]) => {
                    if (detail.type === 'max' && Array.isArray(detail.base_subjects)) {
                      return detail.base_subjects.map((subName) => (
                        <ScoreInput
                          key={subName}
                          label={fullLabelMap[subName] || subName}
                          value={formData[scoreName[subName]]}
                          onChange={handleChange}
                          isEditing={isEditing}
                          name={scoreName[subName]}
                        />
                      ));
                    }
                    return null;
                  })}
                </div>
              </>
            )}

            {Object.entries(formula).some(([_, detail]) => detail.type === 'special') && (
              <>
                <div className="text-monochrome-800 text-headline-6 mt-10 relative flex items-center whitespace-nowrap"> 
                  กลุ่มคะแนนพิเศษ
                  <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
                  {Object.entries(formula).map(([name, detail]) => {
                    if (detail.type === 'special') {
                      return (
                        <SpecialInput
                          key={name}
                          label={`${fullLabelMap[name] || name} / เต็ม`}
                          name={name}
                          value={formData[name] || ''}
                          maxValue={formData[`${name}_max`] || ''}
                          onChange={handleChange}
                          onMaxChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              [`${name}_max`]: e.target.value,
                            }))
                          }
                          isEditing={isEditing}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </>
            )}


          </div>

          <div className="flex justify-center mt-6">
            <div className="flex justify-center items-center m-10">
              <EditButtons isEditing={isEditing} onEditClick={handleEditClick} onCancelClick={handleCancelClick} onSaveClick={handleSaveClick} />
            </div>
            <button
              className={`mt-16 px-10 py-3 rounded-lg text-big-button w-120 max-h-[43px] transition relative ${
                isAllRequiredFieldsFilled()
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-white cursor-not-allowed'
              }`}
              onClick={handleCalculateClick}
              disabled={!isAllRequiredFieldsFilled() || isCalculating}
            >
              {isCalculating ? (
                <>
                  <span className="opacity-0">คำนวณคะแนน</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </>
              ) : (
                "คำนวณคะแนน"
              )}
            </button>
          </div>
        </div>
      </div>
      {showAlert && (
        <AlertBox
          alertType={alertType}
          title={alertType === 'success' ? 'Success' : 'Error'}
          message={alertMessage}
        />
      )}
      <Footer />
    </>
  );
}