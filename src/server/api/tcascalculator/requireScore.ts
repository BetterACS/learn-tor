import { publicProcedure } from "@/server/trpc";
import { z } from 'zod';
import { connectDB } from "@/server/db";
import { UniversityModel } from "@/db/models";

export default function requireScore() {
    return {
        requireScore: publicProcedure
            .input(
                z.object({
                    institution: z.string(),
                    campus: z.string(),
                    faculty: z.string(),
                    program: z.string(),
                    course_type: z.string(),
                    admission_type: z.string(),
                })
            )
            .mutation(async ({ input }) => {
                await connectDB();
                const { institution, campus, faculty, program, course_type, admission_type } = input;
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
                try{
                    const allData = await UniversityModel.find({});
                    console.log(institution, campus, faculty, program, course_type, admission_type);
                    const searchData = allData.filter(uni =>
                        uni.institution === institution &&
                        uni.campus === campus &&
                        uni.faculty === faculty &&
                        uni.program === program &&
                        uni.course_type === course_type &&
                        uni.round_3.some((r3: { admission_type: string }) => r3.admission_type === admission_type)
                    );
                    
                    const extractedData = searchData.map(uni => {
                        const matchedRound = uni.round_3.find((r3: { admission_type: string }) => r3.admission_type === admission_type);
                    
                        // เปลี่ยนชื่อวิชาใน score_calculation_formula เป็นชื่อย่อจาก scoreName
                        const updatedScoreCalculationFormula = Object.keys(matchedRound?.score_calculation_formula || {}).reduce((acc: { [key: string]: any }, key) => {
                            const shortName = Object.keys(scoreName).find(name => scoreName[name] === key);
                            if (shortName) {
                                acc[shortName] = matchedRound?.score_calculation_formula[key];
                            } else {
                                acc[key] = matchedRound?.score_calculation_formula[key];
                            }
                            return acc;
                        }, {});
                    
                        // เปลี่ยนชื่อใน minimum_criteria
                        const updatedMinimumCriteria = Object.keys(matchedRound?.minimum_criteria || {}).reduce((acc: { [key: string]: any }, key) => {
                            const shortName = scoreName[key]; // หา key ที่ตรงใน scoreName
                            if (shortName) {
                                acc[shortName] = matchedRound?.minimum_criteria[key];
                            } else {
                                acc[key] = matchedRound?.minimum_criteria[key]; // ถ้าไม่เจอ ก็เก็บชื่อเดิม
                            }
                            return acc;
                        }, {});
                    
                        return {
                            institution: uni.institution,
                            faculty: uni.faculty,
                            program: uni.program,
                            admission_type: matchedRound?.admission_type,
                            score_calculation_formula: updatedScoreCalculationFormula,
                            minimum_criteria: updatedMinimumCriteria
                        };
                    });
                    
                    
                    return {
                        status:"200",
                        data:extractedData
                    };

                }catch(error){
                    return {
                        status:"500",
                        message:"Internal Server Error"
                    };
                }
                

            })
    };
}
