import { UserModel } from '@/db/models';
import { connectDB } from '@/server/db';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { publicProcedure } from '../trpc';

export default function register() {
	return {
		register: publicProcedure
			.input(
				z.object({
					email: z.string(),
					password: z.string(),
					username: z.string(),
				})
			)
			.mutation(async ({ input }) => {
				const { email, password, username} = input;
				try {
					await connectDB();
					const hashedPassword = await bcrypt.hash(password, 12);
					const newUser = new UserModel({
						email: email,
						password: hashedPassword,
						username: username,

					});
					console.log('newUser:', newUser);
					await newUser.save();
					return {
						status: 200,
						data: { message: 'create user successfuly' },
					};
				} catch (error) {
					console.error('Error creating user:', error);
					return {
						status: 500,
						data: { message: 'Fail to create user' },
					};
				}
			}),
	};
}
