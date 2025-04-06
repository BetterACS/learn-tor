import apiTest from './api/example';
import register from './api/member-system/register';
import login from './api/member-system/login';
import verified from './api/member-system/verified';
import editUser from './api/member-system/editUser';
import resetVerificationToken from './api/member-system/resetVerificationToken';
import getJWT from './api/getJWT';
import getTopics from './api/forum/getTopics';
import universityQueries from './api/university'
import { createCallerFactory, router } from './trpc';
import createTopic from './api/forum/createTopic';
import queryTopic from './api/forum/queryTopic';
import likeTopic from './api/forum/likeTopic';
import checkLike from './api/forum/checkLike';
import getUser from './api/member-system/getUser';
import getTags from './api/forum/getTags';
import getTopTags from './api/forum/getTags';
import addTags from './api/forum/addTags';
import topicTags from './api/forum/topicTags';
import updateTopic from './api/forum/update';
import updateTags from './api/forum/update';
import checkTopicOwner from './api/forum/getTopics';
import deleteTopic from './api/forum/deleteTopic';
import getSearchTags from './api/forum/getTags';
import updateAvatar from './api/member-system/updateAvatar';
import createComment from './api/forum/createComment';
import getAllComments from './api/forum/getAllComments';
import likeComment from './api/forum/likeComment';
import chatBot from './api/chatbot/chatBot';
import createChat from './api/chatbot/createChat';
import queryChat from './api/chatbot/queryChat';
import queryScore from './api/tcascalculator/queryscore';
import checkScore from './api/tcascalculator/checkScore';
import saveResult from './api/tcascalculator/saveResult';
import userChatBot from './api/chatbot/userChatBot';
import editRoom from './api/chatbot/editRoom';
import requireScore from './api/tcascalculator/requireScore';
import addScore from './api/member-system/addScore';
import university  from './api/university';
import deleteChat from './api/chatbot/deleteChat';
import editScore from './api/tcascalculator/editScore';

export const appRouter = router({
	...apiTest(),
    ...register(),
    ...login(),
    ...verified(),
    ...editUser(),
    ...resetVerificationToken(),
    ...getJWT(),
    ...getTopics,
    ...createTopic(),
    ...queryTopic,
    ...likeTopic(),
    ...checkLike(),
    ...getUser(),
    ...universityQueries(),
    ...getTags,
    ...getTopTags,
    ...addTags(),
    ...topicTags(),
    ...updateTopic,
    ...updateTags,
    ...checkTopicOwner,
    ...deleteTopic,
    ...getSearchTags,
    ...updateAvatar(),
    ...createComment(),
    ...getAllComments(),
    ...likeComment(),
    ...chatBot(),
    ...createChat(),
    ...queryChat(),
    ...queryScore(),
    ...checkScore(),
    ...saveResult(),
    ...userChatBot(),
    ...editRoom(),
    ...requireScore(),
    ...university(),
    ...addScore(),
    ...deleteChat(),
    ...editScore(),
});
const createCaller = createCallerFactory(appRouter);

export const caller = createCaller({});
export type AppRouter = typeof appRouter;
