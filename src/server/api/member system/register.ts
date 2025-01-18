import { UserModel } from '@/db/models';
import { connectDB } from '@/server/db';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { publicProcedure } from '../../trpc';
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

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
					const existingUser = await UserModel.findOne({
						$or: [{ email }, { username }],
					});
					if (existingUser) {
						return {
							status: 400,
							data: {
								message: 'Email or username already exists.',
							},
						};
					}
					const hashedPassword = await bcrypt.hash(password, 12);
					const newUser = await UserModel.create({
						email: email,
						password: hashedPassword,
						username: username,
						token: '',
					});

					// create token
					const token = jwt.sign(
						{ user_id: newUser._id, email },
						process.env.NEXT_PUBLIC_NEXTAUTH_SECRET as string,
						{
							expiresIn: '1h',
						}
					);
					newUser.token = token;
					await newUser.save();
					console.log(token);
					return {
						status: 200,
						data: {
						  message: 'User created successfully',
						},
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
