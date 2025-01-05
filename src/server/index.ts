import apiTest from './api/test';
import register from './api/register';
import login from  './api/login';

import { createCallerFactory, router } from './trpc';
export const appRouter = router({
	...apiTest(),
    ...register(),
    ...login(),
});
const createCaller = createCallerFactory(appRouter);

export const caller = createCaller({});
export type AppRouter = typeof appRouter;
