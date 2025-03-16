'use client';
import { useState, useEffect } from 'react';
import { Navbar, Footer, EditButtons, InputField, ScoreInput } from '@/components/index';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import type { User } from '@/db/models';
import { trpc } from '@/app/_trpc/client';

interface CustomSession {
  user?: {
    id?: string;
    username?: string;
    email?: string;
  };
}

const initialFormData = {
  username: '',
  email: '',
  major: '',
  talent: '',
  lesson_plan: '',
  GPAX: '',
  TGAT1: '',
  TGAT2: '',
  TGAT3: '',
  TPAT2_1: '',
  TPAT2_2: '',
  TPAT2_3: '',
  TPAT3: '',
  TPAT4: '',
  TPAT5: '',
  A_MATH1: '',
  A_MATH2: '',
  A_SCIENCE: '',
  A_PHYSIC: '',
  A_BIOLOGY: '',
  A_CHEMISTRY: '',
  A_SOCIAL: '',
  A_THAI: '',
  A_ENGLISH: '',
  A_FRANCE: '',
  A_GERMANY: '',
  A_JAPAN: '',
  A_PALI: '',
  A_CHINESE: '',
  A_KOREAN: '',
  A_SPANISH: '',
};

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const { data: session } = useSession() as { data: CustomSession | null };
  const userId = session?.user?.id;

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`/api/member-system/getUser?_id=${encodeURIComponent(userId)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) throw new Error('Failed to fetch user');

          const data = await response.json();
          console.log('User data:', data);
          setFormData({
            username: data.user.username || '',
            email: data.user.email || '',
            major: data.user.major || '',
            talent: data.user.talent || '',
            lesson_plan: data.user.lesson_plan || '',
            GPAX: data.user.GPAX || '',
            TGAT1: data.user.TGAT1 || '',
            TGAT2: data.user.TGAT2 || '',
            TGAT3: data.user.TGAT3 || '',
            TPAT2_1: data.user.TPAT2_1 || '',
            TPAT2_2: data.user.TPAT2_2 || '',
            TPAT2_3: data.user.TPAT2_3 || '',
            TPAT3: data.user.TPAT3 || '',
            TPAT4: data.user.TPAT4 || '',
            TPAT5: data.user.TPAT5 || '',
            A_MATH1: data.user.A_MATH1 || '',
            A_MATH2: data.user.A_MATH2 || '',
            A_SCIENCE: data.user.A_SCIENCE || '',
            A_PHYSIC: data.user.A_PHYSIC || '',
            A_BIOLOGY: data.user.A_BIOLOGY || '',
            A_CHEMISTRY: data.user.A_CHEMISTRY || '',
            A_SOCIAL: data.user.A_SOCIAL || '',
            A_THAI: data.user.A_THAI || '',
            A_ENGLISH: data.user.A_ENGLISH || '',
            A_FRANCE: data.user.A_FRANCE || '',
            A_GERMANY: data.user.A_GERMANY || '',
            A_JAPAN: data.user.A_JAPAN || '',
            A_PALI: data.user.A_PALI || '',
            A_CHINESE: data.user.A_CHINESE || '',
            A_KOREAN: data.user.A_KOREAN || '',
            A_SPANISH: data.user.A_SPANISH || '',
          });
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };

      fetchUser();
    }
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'GPAX') {
      const validInput = value.replace(/[^0-9.]/g, '');
      const parts = validInput.split('.');
      if (parts.length > 2 || (parts[1] && parts[1].length > 2)) return;
      const numericValue = parseFloat(validInput);
      if (numericValue > 4 || numericValue < 0) return;
      setFormData((prevData) => ({
        ...prevData,
        [name]: validInput,
      }));
      return;
    }

    if (name.startsWith('TGAT') || name.startsWith('TPAT') || name.startsWith('A_')) {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) return;
      if (numericValue < 0 || numericValue > 100) return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    if (session?.user) {
      setFormData({
        ...initialFormData,
        username: session.user?.username || '',
        email: session.user?.email || '',
      });
    }
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    if (!session?.user?.email) {
      alert('ไม่พบอีเมลของผู้ใช้');
      return;
    }

    try {
      const response = await fetch('/api/member-system/editUser', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          updates: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      console.log('Profile updated:', data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="pt-10 px-20 py-10">
        <div className="text-primary-600 text-headline-3 font-bold mb-8">บัญชีและความปลอดภัย</div>

        <div className="text-monochrome-300 text-headline-6 mt-6 relative flex items-center whitespace-nowrap">
          ข้อมูลส่วนบุคคล
          <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
        </div>

        <div className="md:gap-x-20 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-36 gap-y-6">
          <InputField
            label="ชื่อผู้ใช้"
            name="username"
            value={formData.username}
            disabled={!isEditing}
            onChange={handleChange}
          />
          <InputField label="อีเมล" name="email" value={formData.email} disabled={true} onChange={handleChange} />
          <InputField label="สายการเรียน" name="major" value={formData.major} disabled={!isEditing} onChange={handleChange} />
          <InputField label="ความถนัดและความสามารถ" name="talent" value={formData.talent} disabled={!isEditing} onChange={handleChange} />
          <InputField label="ความสนใจส่วนตัว" name="lesson_plan" value={formData.lesson_plan} disabled={!isEditing} onChange={handleChange} />
          <InputField label="GPAX" name="GPAX" value={formData.GPAX} disabled={!isEditing} onChange={handleChange} />
        </div>

        <div className="text-monochrome-300 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
          TGAT ความถนัดทั่วไป
          <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
        </div>
        <div className="md:gap-x-20 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-36 gap-y-6">
          <ScoreInput label="TGAT1 การสื่อสารภาษาอังกฤษ" value={formData.TGAT1} onChange={handleChange} isEditing={isEditing} name="TGAT1" />
          <ScoreInput label="TGAT2 การคิดอย่างมีเหตุผล" value={formData.TGAT2} onChange={handleChange} isEditing={isEditing} name="TGAT2" />
          <ScoreInput label="TGAT3 สมรรถนะการทำงานในอนาคต" value={formData.TGAT3} onChange={handleChange} isEditing={isEditing} name="TGAT3" />
        </div>

        <div className="text-monochrome-300 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
          TPAT ความถนัดทางวิชาชีพ
          <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
        </div>
        <div className="md:gap-x-20 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-36 gap-y-6">
          <ScoreInput label="TPAT2.1 ความถนัดศิลปกรรมศาสตร์ ทัศนศิลป์" value={formData.TPAT2_1} onChange={handleChange} isEditing={isEditing} name="TPAT2_1" />
          <ScoreInput label="TPAT2.2 ความถนัดศิลปกรรมศาสตร์ ดนตรี" value={formData.TPAT2_2} onChange={handleChange} isEditing={isEditing} name="TPAT2_2" />
          <ScoreInput label="TPAT2.3 ความถนัดศิลปกรรมศาสตร์ นาฏศิลป์" value={formData.TPAT2_3} onChange={handleChange} isEditing={isEditing} name="TPAT2_3" />
          <ScoreInput label="TPAT3 ความถนัดด้านวิทยาศาสตร์ เทคโนโลยี และ.." value={formData.TPAT3} onChange={handleChange} isEditing={isEditing} name="TPAT3" />
          <ScoreInput label="TPAT4 ความถนัดทางสถาปัตยกรรม" value={formData.TPAT4} onChange={handleChange} isEditing={isEditing} name="TPAT4" />
          <ScoreInput label="TPAT5 ความถนัดครุศาสตร์-ศึกษาศาสตร์" value={formData.TPAT5} onChange={handleChange} isEditing={isEditing} name="TPAT5" />
        </div>

        <div className="text-monochrome-300 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
          A - Level
          <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
        </div>
        <div className="md:gap-x-20 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-36 gap-y-6">
          <ScoreInput label="A-Level คณิตศาสตร์ประยุกต์ 1" value={formData.A_MATH1} onChange={handleChange} isEditing={isEditing} name="A_MATH1" />
          <ScoreInput label="A-Level คณิตศาสตร์ประยุกต์ 2" value={formData.A_MATH2} onChange={handleChange} isEditing={isEditing} name="A_MATH2" />
          <ScoreInput label="A-Level วิทยาศาสตร์ประยุกต์" value={formData.A_SCIENCE} onChange={handleChange} isEditing={isEditing} name="A_SCIENCE" />
          <ScoreInput label="A-Level ฟิสิกส์" value={formData.A_PHYSIC} onChange={handleChange} isEditing={isEditing} name="A_PHYSIC" />
          <ScoreInput label="A-Level เคมี" value={formData.A_CHEMISTRY} onChange={handleChange} isEditing={isEditing} name="A_CHEMISTRY" />
          <ScoreInput label="A-Level ชีววิทยา" value={formData.A_BIOLOGY} onChange={handleChange} isEditing={isEditing} name="A_BIOLOGY" />
          <ScoreInput label="A-Level สังคมศึกษา" value={formData.A_SOCIAL} onChange={handleChange} isEditing={isEditing} name="A_SOCIAL" />
          <ScoreInput label="A-Level ภาษาไทย" value={formData.A_THAI} onChange={handleChange} isEditing={isEditing} name="A_THAI" />
          <ScoreInput label="A-Level ภาษาอังกฤษ" value={formData.A_ENGLISH} onChange={handleChange} isEditing={isEditing} name="A_ENGLISH" />
          <ScoreInput label="A-Level ภาษาฝรั่งเศส" value={formData.A_FRANCE} onChange={handleChange} isEditing={isEditing} name="A_FRANCE" />
          <ScoreInput label="A-Level ภาษาเยอรมัน" value={formData.A_GERMANY} onChange={handleChange} isEditing={isEditing} name="A_GERMANY" />
          <ScoreInput label="A-Level ภาษาญี่ปุ่น" value={formData.A_JAPAN} onChange={handleChange} isEditing={isEditing} name="A_JAPAN" />
          <ScoreInput label="A-Level ภาษาเกาหลี" value={formData.A_KOREAN} onChange={handleChange} isEditing={isEditing} name="A_KOREAN" />
          <ScoreInput label="A-Level ภาษาจีน" value={formData.A_CHINESE} onChange={handleChange} isEditing={isEditing} name="A_CHINESE" />
          <ScoreInput label="A-Level ภาษาบาลี" value={formData.A_PALI} onChange={handleChange} isEditing={isEditing} name="A_PALI" />
          <ScoreInput label="A-Level ภาษาสเปน" value={formData.A_SPANISH} onChange={handleChange} isEditing={isEditing} name="A_SPANISH" />
        </div>

        <div className="text-monochrome-300 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
          ความปลอดภัย
          <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
        </div>
        <EditButtons isEditing={isEditing} onEditClick={handleEditClick} onCancelClick={handleCancelClick} onSaveClick={handleSaveClick} />
        <div className="mt-6 flex justify-start gap-4 w-full">
          <Link href={`/verification?email=${session?.user?.email || ''}`} passHref>
            <button className="w-full sm:w-full md:w-[315px] lg:w-[400px] text-big-button border border-primary-600 bg-monochrome-50 text-primary-600 py-3 px-6 rounded-lg hover:bg-monochrome-100">
              เปลี่ยนรหัสผ่าน
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;