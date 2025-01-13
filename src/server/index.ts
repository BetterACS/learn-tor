import apiTest from './api/test';
import register from './api/auth/register';
import login from  './api/auth/login';

import { createCallerFactory, router } from './trpc';
export const appRouter = router({
	...apiTest(),
    ...register(),
    ...login(),
});
const createCaller = createCallerFactory(appRouter);

export const caller = createCaller({});
export type AppRouter = typeof appRouter;
