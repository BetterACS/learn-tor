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
                    faculty: z.string(),
                    major: z.string(),
                    admission: z.string(),
                })
            )
            .mutation(async ({ input }) => {
                await connectDB();
                const { institution, faculty, major, admission } = input;

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
                        
                        return roundMatch.map((round: any) => ({
                            score_calculation_formula: round.score_calculation_formula,
                            minimum_criteria: round.minimum_criteria,
                        }));
                    }
                    return [];
                }).flat();


                const uniqueAdmissionDetails = Array.from(new Set(searchAdmissionDetails.map(item => JSON.stringify(item)))).map(item => JSON.parse(item));

                return { uniqueAdmissionDetails };
            })
    };
}
