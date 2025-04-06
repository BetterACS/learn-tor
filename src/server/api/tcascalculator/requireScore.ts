import { publicProcedure } from "@/server/trpc";
import { z } from 'zod';
import { connectDB } from "@/server/db";
import { UniversityModel } from "@/db/models";
import { stat } from "fs";

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
    const { institution, campus, faculty, program, course_type, admission_type } = input;
    
    const scoreName = {
      TGAT1: "การสื่อสารภาษาอังกฤษ (TGAT1)",
      TGAT2: "การคิดอย่างมีเหตุผล (TGAT2)",
      TGAT3: "สมรรถนะการทำงาน (TGAT3)",
      TPAT21: "ทัศนศิลป์ (TPAT21)",
      TPAT22: "ดนตรี (TPAT22)",
      TPAT3: "ความถนัดวิทยาศาสตร์ เทคโนโลยี วิศวกรรมศาสตร์ (TPAT3)",
      TPAT4: "ความถนัดสถาปัตยกรรมศาสตร์ (TPAT4)",
      TPAT5: "ความถนัดครุศาสตร์-ศึกษาศาสตร์ (TPAT 5)",
      A_MATH1: "A-Level คณิตศาสตร์ประยุกต์ 1 (พื้นฐาน+เพิ่มเติม)",
      A_MATH2: "A-Level คณิตศาสตร์ประยุกต์ 2 (พื้นฐาน)",
      A_PHYSIC: "A-Level ฟิสิกส์",
      A_CHEMISTRY: "A-Level เคมี",
      A_BIOLOGY: "A-Level ชีววิทยา",
      A_SCIENCE: "A-Level วิทยาศาสตร์ประยุกต์",
      A_SOCIAL: "A-Level สังคมศาสตร์",
      A_THAI: "A-Level ภาษาไทย",
      A_ENGLISH: "A-Level ภาษาอังกฤษ",
      A_FRENCH: "A-Level ภาษาฝรั่งเศส",
      A_GERMANY: "A-Level ภาษาเยอรมัน",
      A_JAPAN: "A-Level ภาษาญี่ปุ่น",
      A_KOREAN: "A-Level ภาษาเกาหลี",
      A_CHINESE: "A-Level ภาษาจีน",
      A_PALI: "A-Level ภาษาบาลี",
      A_SPANISH: "A-Level ภาษาสเปน",
    };

    try {
      await connectDB();

      const universities = await UniversityModel.find({
        institution,
        campus,
        faculty,
        program,
        course_type,
        "round_3.admission_type": admission_type,
      });
      console.log("universities", universities);
      const round3Data = universities[0]?.round_3 || [];
      const matchedRound = round3Data.find(
        (round: any) => round.admission_type === admission_type
      );
      const new_culcurate = matchedRound?.new_culcurate || null;
      
      if (!new_culcurate) {
        return {
          status: 404,
          message: "No data found",
        };
      }
      return {
        status: 200,
        data: { message: "Successful load data", new_culcurate: new_culcurate },
      };
    } catch (error) {
      console.error("Error fetching required scores:", error);
      return {
        status: 500,
        message: "Internal Server Error",
      };
    }
  })
    };
}
