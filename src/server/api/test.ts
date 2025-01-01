import { z } from 'zod';
import { publicProcedure } from '../trpc';
export default function apiTest() {
	return {
		testQuery: publicProcedure
			.input(
				z.object({
                    id: z.number(),
                    name: z.string(),
                }),
			)
			.query(async ({input}) => {
				return {
					message: 'Hello world! if you see this, it means that trpc is working! ' + input.id + ' ' + input.name,
				};
			}),
		testMutation: publicProcedure
			.input(
				z.object({
					name: z.string(),
				})
			)
			.mutation(async ({ input }) => {
				const { name } = input;
				return {
					message: 'Hi ' + name + '!',
				};
			}),
        // .subscription มีอีกตัวแต่ยังไม่เคยใช้เหมือนกัน ลองไปอ่านดูเห็นบอกว่าเป็น realtime เช่น แจ้งเตือน หรือ ข้อมูลเวลา
	};
}
