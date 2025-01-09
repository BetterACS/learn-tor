'use client';
import { useState } from 'react';
import { Navbar, Footer, EditButtons, InputField, ScoreInput } from '@/components/index';
import Link from 'next/link';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: 'Example.username',
    email: 'example@email.com',
    major: 'วิทย์-คณิต',
    skills: 'การเขียนโปรแกรมคอมพิวเตอร์',
    interests: 'สนใจทางด้าน AI และ Data Science',
    gpax: '4.00',
    TGAT1: '5',
    TGAT2: '',
    TGAT3: '',
    TPAT21: '',
    TPAT22: '',
    TPAT23: '',
    TPAT3: '',
    TPAT4: '',
    TPAT5: '',
    A1: '',
    A2: '',
    A3: '',
    A4: '',
    A5: '',
    A6: '',
    A7: '',
    A8: '',
    A9: '',
    A10: '',
    A11: '',
    A12: '',
    A13: '',
    A14: '',
    A15: '',
    A16: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setFormData({
      username: 'Example.username',
      email: 'example@email.com',
      major: 'วิทย์-คณิต',
      skills: 'การเขียนโปรแกรมคอมพิวเตอร์',
      interests: 'สนใจทางด้าน AI และ Data Science',
      gpax: '4.00',
      TGAT1: '',
      TGAT2: '',
      TGAT3: '',
      TPAT21: '',
      TPAT22: '',
      TPAT23: '',
      TPAT3: '',
      TPAT4: '',
      TPAT5: '',
      A1: '',
      A2: '',
      A3: '',
      A4: '',
      A5: '',
      A6: '',
      A7: '',
      A8: '',
      A9: '',
      A10: '',
      A11: '',
      A12: '',
      A13: '',
      A14: '',
      A15: '',
      A16: '',
    });
    setIsEditing(false);
  };
  const handleSaveClick = () => {
    setIsEditing(false);
    console.log('ข้อมูลได้รับการบันทึก:', formData);
  };

  return (
    <div>
      <Navbar />
      <div className="pt-10 px-20 py-10">
        <div className="text-primary-600 text-headline-3 font-bold mb-8 ">บัญชีและความปลอดภัย</div>
        <div className="text-monochrome-300 text-headline-6 mt-6 relative flex items-center whitespace-nowrap">
          ข้อมูลส่วนบุคคล
          <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-x-40 gap-y-6">
          <InputField label="ชื่อผู้ใช้" name="username" value={formData.username} disabled={!isEditing} onChange={handleChange} />
          <InputField label="อีเมล" name="email" value={formData.email} disabled={!isEditing} onChange={handleChange} />
          <InputField label="สายการเรียน" name="major" value={formData.major} disabled={!isEditing} onChange={handleChange} />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-x-40 gap-y-6">
          <InputField label="ความถนัดและความสามารถ" name="skills" value={formData.skills} disabled={!isEditing} onChange={handleChange} />
          <InputField label="ความสนใจส่วนตัว" name="interests" value={formData.interests} disabled={!isEditing} onChange={handleChange} />
          <InputField label="GPAX" name="gpax" value={formData.gpax} disabled={!isEditing} onChange={handleChange} />
        </div>

        <div className="text-monochrome-300 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
            TGAT ความถนัดทั่วไป
            <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-x-40 gap-y-6">
          <ScoreInput label="TGAT1 การสื่อสารภาษาอังกฤษ" value={formData.TGAT1} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="TGAT2 การคิดอย่างมีเหตุผล" value={formData.TGAT2} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="TGAT3 สมรรถนะการทำงานในอนาคต" value={formData.TGAT3} onChange={handleChange} isEditing={isEditing} />
        </div>

        <div className="text-monochrome-300 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
            TPAT ความถนัดทางวิชาชีพ
            <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-x-40 gap-y-6">
          <ScoreInput label="TPAT2.1 ความถนัดศิลปกรรมศาสตร์ ทัศนศิลป์" value={formData.TPAT21} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="TPAT2.2 ความถนัดศิลปกรรมศาสตร์ ดนตรี" value={formData.TPAT22} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="TPAT2.3 ความถนัดศิลปกรรมศาสตร์ นาฏศิลป์" value={formData.TPAT23} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="TPAT3 ความถนัดด้านวิทยาศาสตร์ เทคโนโลยี และ.." value={formData.TPAT3} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="TPAT4 ความถนัดทางสถาปัตยกรรม" value={formData.TPAT4} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="TPAT5 ความถนัดครุศาสตร์-ศึกษาศาสตร์" value={formData.TPAT5} onChange={handleChange} isEditing={isEditing} />
        </div>

        <div className="text-monochrome-300 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
            A - Level
            <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-x-40 gap-y-6">
          <ScoreInput label="A-Level คณิตศาสตร์ประยุกต์ 1" value={formData.A1} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="A-Level คณิตศาสตร์ประยุกต์ 2" value={formData.A2} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="A-Level วิทยาศาสตร์ประยุกต์" value={formData.A3} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="A-Level ฟิสิกส์" value={formData.A4} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="A-Level เคมี" value={formData.A5} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="A-Level ชีววิทยา" value={formData.A6} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="A-Level สังคมศึกษา" value={formData.A7} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="A-Level ภาษาไทย" value={formData.A8} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="A-Level ภาษาอังกฤษ" value={formData.A9} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="A-Level ภาษาฝรั่งเศส" value={formData.A10} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="A-Level ภาษาเยอรมัน" value={formData.A11} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="A-Level ภาษาญี่ปุ่น" value={formData.A12} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="A-Level ภาษาเกาหลี" value={formData.A13} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="A-Level ภาษาจีน" value={formData.A14} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="A-Level ภาษาบาลี" value={formData.A15} onChange={handleChange} isEditing={isEditing} />
          <ScoreInput label="A-Level ภาษาสเปน" value={formData.A16} onChange={handleChange} isEditing={isEditing} />
        </div>

        <div className="text-monochrome-300 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
            ความปลอดภัย
            <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
        </div>
        <EditButtons isEditing={isEditing} onEditClick={handleEditClick} onCancelClick={handleCancelClick} onSaveClick={handleSaveClick} />
        <div className="mt-6 flex justify-start gap-4 w-full">
            <Link href="/forget" passHref>
                <button className="w-[200px] text-big-button border border-primary-600 bg-monochrome-50 text-primary-600 py-3 px-6 rounded-lg hover:bg-monochrome-100">
                    เปลี่ยนรหัสผ่าน
                </button>
            </Link>
        </div>
        <div className="mt-6 flex justify-start gap-4 w-full">
            <Link href="/login" passHref>
                <button className="w-[200px] text-big-button bg-red-800 text-monochrome-50 py-3 px-6 rounded-lg hover:bg-red-700">
                    ออกจากระบบ
                </button>
            </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
