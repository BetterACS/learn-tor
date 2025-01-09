'use client';
import Link from 'next/link';
import { Navbar, Footer} from '@/components/index';

export default function Profile() {
    return (
        <>
            <Navbar />
            <div className="pt-10 px-20 py-10">
                <div className="text-primary-600 text-headline-3 font-bold mb-8">
                    บัญชีและความปลอดภัย
                </div>

                <div className="text-monochrome-300 text-headline-6 mt-6 relative flex items-center whitespace-nowrap">
                    ข้อมูลส่วนบุคคล
                    <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-6">
                    <div>
                        <label className="block text-monochrome-950 text-headline-6 mb-2">
                            ชื่อผู้ใช้
                        </label>
                        <input
                            type="text"
                            value="Example.username"
                            disabled
                            className="w-full border border-monochrome-200 rounded-lg px-4 py-2 bg-monochrome-100"
                        />
                    </div>
                    <div>
                        <label className="block text-monochrome-950 text-headline-6 mb-2">
                            อีเมล
                        </label>
                        <input
                            type="email"
                            value="example@email.com"
                            disabled
                            className="w-full border border-monochrome-200 rounded-lg px-4 py-2 bg-monochrome-100"
                        />
                    </div>
                    <div>
                        <label className="block text-monochrome-950 text-headline-6 mb-2">
                            สายการเรียน
                        </label>
                        <input
                            type="text"
                            value="วิทย์-คณิต"
                            disabled
                            className="w-full border border-monochrome-200 rounded-lg px-4 py-2 bg-monochrome-100"
                        />
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-6">
                    <div>
                        <label className="block text-monochrome-950 text-headline-6 mb-2">
                            ความถนัดและความสามารถ
                        </label>
                        <input
                            type="text"
                            placeholder="-"
                            className="w-full border border-monochrome-300 rounded-lg px-4 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-monochrome-950 text-headline-6 mb-2">
                            ความสนใจส่วนตัว
                        </label>
                        <input
                            type="text"
                            placeholder="-"
                            className="w-full border border-monochrome-300 rounded-lg px-4 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-monochrome-950 text-headline-6 mb-2">
                            GPAX
                        </label>
                        <input
                            type="text"
                            placeholder="-"
                            className="w-full border border-monochrome-300 rounded-lg px-4 py-2"
                        />
                    </div>
                </div>

                <div className="text-monochrome-300 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
                    TGAT ความถนัดทั่วไป
                    <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-6">
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">TGAT1 การสื่อสารภาษาอังกฤษ</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">TGAT2 การคิดอย่างมีเหตุผล</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">TGAT3 สมรรถนะการทำงานในอนาคต</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                </div>

                <div className="text-monochrome-300 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
                    TPAT ความถนัดทางวิชาชีพ
                    <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-6">
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">TPAT2.1 ความถนัดศิลปกรรมศาสตร์ ทัศนศิลป์</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">TPAT2.2 ความถนัดศิลปกรรมศาสตร์ ดนตรี</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">TPAT2.3 ความถนัดศิลปกรรมศาสตร์ นาฏศิลป์</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-6">
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">TPAT3 ความถนัดด้านวิทยาศาสตร์ เทคโนโลยี และ..</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">TPAT4 ความถนัดทางสถาปัตยกรรม</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">TPAT5 ความถนัดครุศาสตร์-ศึกษาศาสตร์</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                </div>

                <div className="text-monochrome-300 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
                    A - Level
                    <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-6">
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">A-Level คณิตศาสตร์ประยุกต์ 1</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">A-Level คณิตศาสตร์ประยุกต์ 2</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">A-Level วิทยาศาสตร์ประยุกต์</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-6">
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">A-Level ฟิสิกส์</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">A-Level เคมี</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">A-Level ชีววิทยา</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-6">
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">A-Level สังคมศึกษา</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">A-Level ภาษาไทย</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">A-Level ภาษาอังกฤษ</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-6">
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">A-Level ภาษาฝรั่งเศส</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">A-Level ภาษาเยอรมัน</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">A-Level ภาษาญี่ปุ่น</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-6">
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">A-Level ภาษาเกาหลี</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">A-Level ภาษาจีน</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">A-Level ภาษาบาลี</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-6">
                    <div>
                        <div className="flex items-center border border-monochrome-300 rounded-lg">
                            <span className="px-4">A-Level ภาษาสเปน</span>
                            <input
                                type="number"
                                placeholder="-"
                                min="1"
                                max="100"
                                className="w-16 text-center py-2 bg-monochrome-300 rounded-lg"
                            />
                            <span className="px-4">/100</span>
                        </div>
                    </div>
                </div>

                <div className="text-monochrome-300 text-headline-6 mt-10 relative flex items-center whitespace-nowrap">
                    ความปลอดภัย
                    <div className="ml-2 w-full border-b-2 border-monochrome-300"></div>
                </div>
                <div className="mt-6 flex justify-center">
                    <Link href="/forget-password" passHref>
                        <button className="text-big-button bg-monochrome-50 text-primary border border-primary py-3 px-6 rounded-lg hover:bg-monochrome-100">
                            เปลี่ยนรหัสผ่าน
                        </button>
                    </Link>
                </div>
                <div className="mt-6 flex justify-center">
                    <button className="text-big-button bg-monochrome-50 text-primary border border-primary py-3 px-6 rounded-lg hover:bg-monochrome-100">
                       แก้ไขข้อมูล
                    </button>
                </div>
                <div className="mt-6 flex justify-center">
                    <button className="text-big-button bg-red-800 text-monochrome-50 py-3 px-6 rounded-lg hover:bg-red-700">
                       ออกจากระบบ
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
}