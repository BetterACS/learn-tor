import apiTest from './api/test';
import register from './api/member-system/register';
import login from './api/member-system/login';
import verified from './api/member-system/verified';
import { createCallerFactory, router } from './trpc';
export const appRouter = router({
	...apiTest(),
    ...register(),
    ...login(),
    ...verified()
});
const createCaller = createCallerFactory(appRouter);

export const caller = createCaller({});
export type AppRouter = typeof appRouter;
