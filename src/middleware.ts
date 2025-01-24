import { chain } from '@/middleware/chain';
import { auth } from '@/middleware/auth';
import {verificationCode} from '@/middleware/verificationCode';
import {updatePassword} from '@/middleware/updatePassword';
export default chain([auth,verificationCode,updatePassword]);

export const config = {matcher : ["/forum","/profile","/create-topic","/forget","/verification","/update-password","/login","/register","/home"]}//
