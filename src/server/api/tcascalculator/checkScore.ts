import { publicProcedure } from "@/server/trpc";
import { z } from 'zod';
import { connectDB } from "@/server/db";
import { UniversityModel } from "@/db/models";

export default function checkScore() {
    return {
        checkScore: publicProcedure
            .input(
                z.object({
                    institution: z.string(),
                    // campus: z.string(),
                    faculty: z.string(),
                    major: z.string(),
                    // course_type: z.string(),
                    admission: z.string(),
                })
            )
            .mutation(async ({ input }) => {
                await connectDB();
                const { institution, faculty, major, admission } = input;
                const scoreName: { [key: string]: string } = {
                    "TGAT1": "การสื่อสารภาษาอังกฤษ (TGAT1)",
                    "TGAT2": "การคิดอย่างมีเหตุผล (TGAT2)",
                    "TGAT3": "สมรรถนะการทำงาน (TGAT3)",
                    "TPAT21": "ทัศนศิลป์ (TPAT21)",
                    "TPAT22": "ดนตรี (TPAT22)",
                    "TPAT3": "ความถนัดวิทยาศาสตร์ เทคโนโลยี วิศวกรรมศาสตร์ (TPAT3)",
                    "TPAT4": "ความถนัดสถาปัตยกรรมศาสตร์ (TPAT4)",
                    "TPAT5": "ความถนัดครุศาสตร์-ศึกษาศาสตร์ (TPAT 5)",
                    "A_MATH1": "A-Level คณิตศาสตร์ประยุกต์ 1 (พื้นฐาน+เพิ่มเติม)",
                    "A_MATH2": "A-Level คณิตศาสตร์ประยุกต์ 2 (พื้นฐาน)",
                    "A_PHYSIC": "A-Level ฟิสิกส์",
                    "A_CHEMISTRY": "A-Level เคมี",
                    "A_BIOLOGY": "A-Level ชีววิทยา",
                    "A_SCIENCE": "A-Level วิทยาศาสตร์ประยุกต์",
                    "A_SOCIAL": "A-Level สังคมศาสตร์",
                    "A_THAI": "A-Level ภาษาไทย",
                    "A_ENGLISH": "A-Level ภาษาอังกฤษ",
                    "A_FRENCH": "A-Level ภาษาฝรั่งเศส",
                    "A_GERMANY": "A-Level ภาษาเยอรมัน",
                    "A_JAPAN": "A-Level ภาษาญี่ปุ่น",
                    "A_KOREAN": "A-Level ภาษาเกาหลี",
                    "A_CHINESE": "A-Level ภาษาจีน",
                    "A_PALI": "A-Level ภาษาบาลี",
                    "A_SPANISH": "A-Level ภาษาสเปน"
                }

                const allData = await UniversityModel.find({});
                const searchData = allData.filter(uni =>
                    uni.institution === institution &&
                    uni.faculty === faculty &&
                    uni.round_3.some((round: any) => round.field_major === major)
                );

                const searchAdmissionDetails = searchData.map(uni => {
                    if (Array.isArray(uni.round_3)) {
                        const roundMatch = uni.round_3.filter((round: any) =>
                            round.field_major === major && round.description === admission
                        );
                        
                        return roundMatch.map((round: any) => {
                            const scoreCalculationFormula = round.score_calculation_formula;

                            // แปลงชื่อเต็มเป็นชื่อย่อ
                            const updatedScoreCalculationFormula = Object.keys(scoreCalculationFormula).reduce<{ [key: string]: any }>((acc, key) => {
                                const shortName = Object.keys(scoreName).find((name) =>
                                    scoreName[name] === key
                                );
                                acc[shortName || key] = scoreCalculationFormula[key];  // หากไม่พบชื่อย่อให้ใช้ชื่อเดิม
                                return acc;
                            }, {});

                            // เก็บค่าลงในตัวแปร scoreUse
                            const scoreUse = updatedScoreCalculationFormula;

                            // ส่งค่าของ scoreUse ออกไป
                            return {
                                score_calculation_formula: scoreUse,
                                minimum_criteria: round.minimum_criteria,
                            };
                        });
                    }
                    return [];
                }).flat();

                // ส่งคืนค่า uniqueAdmissionDetails ที่มี scoreUse
                const uniqueAdmissionDetails = {
                    score_calculation_formula: searchAdmissionDetails[0]?.score_calculation_formula,
                    minimum_criteria: searchAdmissionDetails[0]?.minimum_criteria
                };
                const scoreCalculationFormula = uniqueAdmissionDetails.score_calculation_formula;
                const minimumCriteria = uniqueAdmissionDetails.minimum_criteria;
                // ส่งค่าผลลัพธ์ไปข้างนอก
                return {
                    scoreCalculationFormula,
                    minimumCriteria
                };
            })
    };
}
