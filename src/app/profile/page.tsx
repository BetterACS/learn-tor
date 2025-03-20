  'use client';
  import { useState, useEffect,useRef } from 'react';
  import { Navbar, Footer, EditButtons, InputField, ScoreInput, AlertBox } from '@/components/index';
  import Link from 'next/link';
  import { useSession } from 'next-auth/react';
  import { trpc } from '@/app/_trpc/client';
  import { CldUploadWidget } from 'next-cloudinary';

  interface CustomSession {
    user?: {
      id?: string;
      username?: string;
      email?: string;
    };
  }

interface FormData {
  username: string;
  email: string;
  avatar: string;
  major: string;
  talent: string;
  lesson_plan: string;
  GPAX: string;
  TGAT1: string;
  TGAT2: string;
  TGAT3: string;
  TPAT2_1: string;
  TPAT2_2: string;
  TPAT2_3: string;
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
}

  const initialFormData: FormData = {
    username: '',
    email: '',
    avatar: 'https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg',
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
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const [alertMessage, setAlertMessage] = useState('');
    const [userId, setUserId] = useState('');
    const { data: session } = useSession() as { data: CustomSession | null };
    const sessionRef = useRef(session);
    useEffect(() => {
      sessionRef.current = session;
      setUserId(session?.user?.id as string);
    }, [session]);
    

    // tRPC Queries and Mutations
    const { data: userData } = trpc.getUser.useQuery(
      { _id: userId || '' },
      { enabled: !!userId }
    );
    const editUserMutation = trpc.editUser.useMutation();
    const addScore = trpc.addScore.useMutation();
    const updateAvatarMutation = trpc.updateAvatar.useMutation();

    // Load user data into form
    useEffect(() => {
      if (userData?.data && 'user' in userData.data && 'scores' in userData.data) {
        const { user, scores } = userData.data;
    
        // Set user-related data
        setFormData(prevData => ({
          ...prevData,
          username: user?.username || '',
          email: user?.email || '',
          avatar: user?.avatar || 'https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg',
          major: user?.major || '',
          talent: user?.talent || '',
          lesson_plan: user?.lesson_plan || '',
          GPAX: user?.GPAX || '',
        }));
    
        // Set scores-related data
        setFormData(prevData => ({
          ...prevData,

          TGAT1: scores?.TGAT1 || '',
          TGAT2: scores?.TGAT2 || '',
          TGAT3: scores?.TGAT3 || '',
          TPAT2_1: scores?.TPAT2_1 || '',
          TPAT2_2: scores?.TPAT2_2 || '',
          TPAT2_3: scores?.TPAT2_3 || '',
          TPAT3: scores?.TPAT3 || '',
          TPAT4: scores?.TPAT4 || '',
          TPAT5: scores?.TPAT5 || '',
          A_MATH1: scores?.A_MATH1 || '',
          A_MATH2: scores?.A_MATH2 || '',
          A_SCIENCE: scores?.A_SCIENCE || '',
          A_PHYSIC: scores?.A_PHYSIC || '',
          A_BIOLOGY: scores?.A_BIOLOGY || '',
          A_CHEMISTRY: scores?.A_CHEMISTRY || '',
          A_SOCIAL: scores?.A_SOCIAL || '',
          A_THAI: scores?.A_THAI || '',
          A_ENGLISH: scores?.A_ENGLISH || '',
          A_FRANCE: scores?.A_FRANCE || '',
          A_GERMANY: scores?.A_GERMANY || '',
          A_JAPAN: scores?.A_JAPAN || '',
          A_PALI: scores?.A_PALI || '',
          A_CHINESE: scores?.A_CHINESE || '',
          A_KOREAN: scores?.A_KOREAN || '',
          A_SPANISH: scores?.A_SPANISH || '',
        }));
      }
    }, [userData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (name === 'GPAX') {
        const validInput = value.replace(/[^0-9.]/g, '');
        const parts = validInput.split('.');
        if (parts.length > 2 || (parts[1] && parts[1].length > 2)) return;
        const numericValue = parseFloat(validInput);
        if (numericValue > 4 || numericValue < 0) return;
        setFormData((prev) => ({ ...prev, [name]: validInput }));
        return;
      }

      if (name.startsWith('TGAT') || name.startsWith('TPAT') || name.startsWith('A_')) {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) return;
      }

      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditClick = () => {
      setIsEditing(true);
    };

    const handleCancelClick = () => {
      if (userData?.data?.user) {
        setFormData({
          ...initialFormData,
          ...userData.data.user,
        });
      }
      setIsEditing(false);
    };

    const handleAvatarUpdate = (imageUrl: string) => {
      if (!sessionRef.current?.user?.email) {
        console.log('No user email found', sessionRef.current);
        setAlertType('error');
        setAlertMessage('Failed to update avatar. Please try again.');
        setShowAlert(true);
        return;
      }
    
      updateAvatarMutation.mutate(
        { email: sessionRef.current.user.email, avatar: imageUrl },
        {
          onSuccess: (data) => {
            if (data.status === 200) {
              setAlertType('success');
              setAlertMessage('Avatar updated successfully!');
              setShowAlert(true);
            } else {
              setAlertType('error');
              setAlertMessage('Failed to update avatar. Please try again.');
              setShowAlert(true);
            }
          },
          onError: (error) => {
            console.error('Error updating avatar:', error);
            setAlertType('error');
            setAlertMessage('Failed to update avatar. Please try again.');
            setShowAlert(true);
          },
        }
      );
    };

    const handleSaveClick = async () => {
      if (!sessionRef.current?.user?.email) {
        setAlertType('error');
        setAlertMessage('ไม่พบอีเมลของผู้ใช้');
        setShowAlert(true);
        return;
      }

      try {
        const result = await editUserMutation.mutateAsync({
          email: sessionRef.current.user.email,
          updates: formData,
        });
        const scoreResult = await addScore.mutateAsync({
          email: sessionRef.current.user.email,
          scores: {
            TGAT1: formData.TGAT1,
            TGAT2: formData.TGAT2,
            TGAT3: formData.TGAT3,
            TPAT2_1: formData.TPAT2_1,
            TPAT2_2: formData.TPAT2_2,
            TPAT2_3: formData.TPAT2_3,
            TPAT3: formData.TPAT3,
            TPAT4: formData.TPAT4,
            TPAT5: formData.TPAT5,
            A_MATH1: formData.A_MATH1,
            A_MATH2: formData.A_MATH2,
            A_SCIENCE: formData.A_SCIENCE,
            A_PHYSIC: formData.A_PHYSIC,
            A_BIOLOGY: formData.A_BIOLOGY,
            A_CHEMISTRY: formData.A_CHEMISTRY,
            A_SOCIAL: formData.A_SOCIAL,
            A_THAI: formData.A_THAI,
            A_ENGLISH: formData.A_ENGLISH,
            A_FRANCE: formData.A_FRANCE,
            A_GERMANY: formData.A_GERMANY,
            A_JAPAN: formData.A_JAPAN,
            A_PALI: formData.A_PALI,
            A_CHINESE: formData.A_CHINESE,
            A_KOREAN: formData.A_KOREAN,
            A_SPANISH: formData.A_SPANISH,
          },
        });

        if (result.status === 200) {
          setIsEditing(false);
          setAlertType('success');
          setAlertMessage('Profile updated successfully!');
          setShowAlert(true);
        } else {
          setAlertType('error');
          setAlertMessage('Failed to update profile. Please try again.');
          setShowAlert(true);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        setAlertType('error');
        setAlertMessage('Failed to update profile. Please try again.');
        setShowAlert(true);
      }
    };

    return (
      <div>
        <Navbar />
        <div className="pt-10 px-20 py-10">
          <div className="flex justify-between items-center mb-8">
            <div className="text-primary-600 text-headline-3 font-bold">บัญชีและความปลอดภัย</div>
            <div className="w-32 h-32 relative">
              <img
                src={formData.avatar}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full aspect-ratio min-w-[96px] min-h-[96px]"
              />
              <CldUploadWidget
                uploadPreset="learn-tor"
                signatureEndpoint="/api/sign-image"
                options={{
                  folder: 'learn-tor/avatars',
                  publicId: `avatar-${Date.now()}`,
                  cropping: true,
                  croppingShowDimensions: true,
                  croppingAspectRatio: 1, // 1:1 aspect ratio
                  croppingCoordinatesMode: 'custom',
                }}
                onSuccess={(results) => {
                  if (results.info && typeof results.info !== 'string') {
                    const { secure_url, coordinates } = results.info;
                
                    if (!secure_url) {
                      console.error("No secure URL found in results:", results);
                      setAlertType('error');
                      setAlertMessage('Failed to upload image. Please try again.');
                      setShowAlert(true);
                      return;
                    }
                
                    if (coordinates?.custom?.[0]?.length === 4) {
                      const [x, y, width, height] = coordinates.custom[0];
                
                      const croppedUrl = secure_url.replace(
                        '/upload/',
                        `/upload/c_crop,w_${width},h_${height},x_${x},y_${y}/`
                      );
                
                      handleAvatarUpdate(croppedUrl);
                    } else {
                      console.log("No cropping coordinates found, using original image URL.");
                      setAlertType('info');
                      setAlertMessage('No cropping coordinates found, using original image.');
                      setShowAlert(true);
                      handleAvatarUpdate(secure_url);
                    }
                  } else {
                    console.error("Unexpected results structure:", results);
                    setAlertType('error');
                    setAlertMessage('Failed to upload image. Please try again.');
                    setShowAlert(true);
                  }
                }}
              >
                {({ open }) => (
                  <button
                    onClick={() => open()}
                    disabled={!session}
                    className="absolute bottom-0 right-0 bg-primary-600 text-monochrome-50 rounded-full p-2 hover:bg-primary-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                      <path d="M3 21v-2.586L14.828 6.586a2 2 0 0 1 2.828 0l1.172 1.172a2 2 0 0 1 0 2.828L7 21H3zM16.414 4.414a4 4 0 0 0-5.656 0L2 13.172V18h4.828l8.586-8.586a4 4 0 0 0 0-5.656l-1.172-1.172zM20 20h-8v2h8v-2z"/>
                    </svg>
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>

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
            <Link href={`/verification?email=${sessionRef.current?.user?.email || ''}`} passHref>
              <button className="w-full sm:w-full md:w-[315px] lg:w-[400px] text-big-button border border-primary-600 bg-monochrome-50 text-primary-600 py-3 px-6 rounded-lg hover:bg-monochrome-100">
                เปลี่ยนรหัสผ่าน
              </button>
            </Link>
          </div>

          {showAlert && (
            <AlertBox
              alertType={alertType}
              title={alertType === 'success' ? 'Success' : 'Error'}
              message={alertMessage}
            />
          )}
        </div>
        <Footer />
      </div>
    );
  };

  export default UserProfile;