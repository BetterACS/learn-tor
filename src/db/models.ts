import mongoose, { Document, mongo, Schema } from 'mongoose';

// User Schema
interface User extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  talent?: string;
  GPAX?: number;
  lesson_plan?: string;
  password: string;
  avatar: string;
  token?: string;
  token_expire?: Date;
  score_id?: mongoose.Types.ObjectId;
  verified?: boolean;
}

const UserSchema: Schema<User> = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  talent: { type: String },
  GPAX: { type: Number },
  lesson_plan: { type: String },
  password: { type: String, required: true },
  avatar: { type: String, default: 'https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg'},
  token: { type: String },
  token_expire: { type: Date },
  score_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Score' },
  verified: { type: Boolean, default: false },
});


const UserModel = mongoose.models.User || mongoose.model<User>('User', UserSchema);

// Topic Schema
interface Topic extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  body: string;
  user_id: mongoose.Types.ObjectId;
  status?: string;
  created_at: Date;
  n_like?: number;
  forum?: string;
}

const TopicSchema: Schema<Topic> = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { type: String, required: true },
  body: { type: String },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String },
  created_at: { type: Date, default: Date.now },
  n_like: { type: Number, default: 0 },
  forum: { type: String },
});

const TopicModel = mongoose.models.Topic || mongoose.model<Topic>('Topic', TopicSchema);

// Chat Schema
interface Chat extends Document {
  name: string;
  user_id: mongoose.Types.ObjectId;
  history: any;
}

const ChatSchema: Schema<Chat> = new Schema({
  name: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  history: { type: mongoose.Schema.Types.Mixed },
});

const ChatModel = mongoose.models.Chat || mongoose.model<Chat>('Chat', ChatSchema);

// Score Schema
interface Score extends Document {
  user_id: mongoose.Types.ObjectId;
  TGAT1?: number;
  TGAT2?: number;
  TGAT3?: number;
  TPAT2_1?: number;
  TPAT2_2?: number;
  TPAT3?: number;
  TPAT4?: number;
  TPAT5?: number;
  A_MATH1?: number;
  A_MATH2?: number;
  A_SCIENCE?: number;
  A_PHYSIC?: number;
  A_BIOLOGY?: number;
  A_CHEMISTRY?: number;
  A_SOCIAL?: number;
  A_THAI?: number;
  A_ENGLISH?: number;
  A_FRANCE?: number;
  A_GERMANY?: number;
  A_JAPAN?: number;
  A_PALI?: number;
  A_CHINESE?: number;
  A_KOREAN?: number;
  A_SPANISH?: number;
}

const ScoreSchema: Schema<Score> = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  TGAT1: { type: Number },
  TGAT2: { type: Number },
  TGAT3: { type: Number },
  TPAT2_1: { type: Number },
  TPAT2_2: { type: Number },
  TPAT3: { type: Number },
  TPAT4: { type: Number },
  TPAT5: { type: Number },
  A_MATH1: { type: Number },
  A_MATH2: { type: Number },
  A_SCIENCE: { type: Number },
  A_PHYSIC: { type: Number },
  A_BIOLOGY: { type: Number },
  A_CHEMISTRY: { type: Number },
  A_SOCIAL: { type: Number },
  A_THAI: { type: Number },
  A_ENGLISH: { type: Number },
  A_FRANCE: { type: Number },
  A_GERMANY: { type: Number },
  A_JAPAN: { type: Number },
  A_PALI: { type: Number },
  A_CHINESE: { type: Number },
  A_KOREAN: { type: Number },
  A_SPANISH: { type: Number },
});

const ScoreModel = mongoose.models.Score || mongoose.model<Score>('Score', ScoreSchema);

// Comment Schema
interface Comment extends Document {
  user_id: mongoose.Types.ObjectId;
  topic_id: mongoose.Types.ObjectId;
  parent_id?: mongoose.Types.ObjectId;
  comment: string;
  n_like?: number;
}

const CommentSchema: Schema<Comment> = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  comment: { type: String, required: true },
  n_like: { type: Number, default: 0 },
});

const CommentModel = mongoose.models.Comment || mongoose.model<Comment>('Comment', CommentSchema);

// Bookmark Schema
interface Bookmark extends Document {
  user_id: mongoose.Types.ObjectId;
  topic_id: mongoose.Types.ObjectId;
}

const BookmarkSchema: Schema<Bookmark> = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
});

const BookmarkModel = mongoose.models.Bookmark || mongoose.model<Bookmark>('Bookmark', BookmarkSchema);

interface info{
  ชื่อหลักสูตร: string,
  ชื่อหลักสูตรภาษาอังกฤษ: string,
  วิทยาเขต: string,
  ค่าใข้จ่าย: string,
  "รอบ 1 Portfolio": string,
  "รอบ 2 Quota": string,
  "รอบ 3 Admission": string,
  "รอบ 4 Direct Admission": string,
}

interface University extends Document {
  course_id: string,
  institution: string,
  faculty: string,
  campus: string,
  program: string,
  course_type: string,
  view_today: number,
  info : info, 
  round_1: Array<string>,
  round_2: Array<string>,
  round_3: Array<Object>,
  round_4: Array<string>,
  logo: string
  image: string
}

const UniversitySchema: Schema<University> = new Schema({
  course_id: { type: String, required: true },
  institution: { type: String, required: true },
  faculty: { type: String, required: true },
  campus: { type: String, required: true },
  program: { type: String, required: true },
  course_type: { type: String, required: true },
  view_today: { type: Number, default: 0 },
  info: {
    ชื่อหลักสูตร: { type: String, required: true },
    ชื่อหลักสูตรภาษาอังกฤษ: { type: String, required: true },
    วิทยาเขต: { type: String, required: true },
    ค่าใข้จ่าย: { type: String},
    "รอบ 1 Portfolio": { type: String, required: true },
    "รอบ 2 Quota": { type: String, required: true },
    "รอบ 3 Admission": { type: String, required: true },
    "รอบ 4 Direct Admission": { type: String, required: true },
  },
  round_1: { type: [String], default: [] },
  round_2: { type: [String], default: [] },
  round_3: { type: [Object], default: [] },
  round_4: { type: [String], default: [] },
  logo: {type:String},
  image: {type:String}
});

const UniversityModel = mongoose.models.University || mongoose.model<University>('University', UniversitySchema);

// LikeTopic Schema

interface LikeTopic extends Document {
  user_id: mongoose.Types.ObjectId;
  topic_id: mongoose.Types.ObjectId;
}

const LikeSchema: Schema<LikeTopic> = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  topic_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true},
})

const LikeTopicModel = mongoose.models.LikeTopic || mongoose.model<LikeTopic>('LikeTopic', LikeSchema)

export {
  UserModel,
  TopicModel,
  ChatModel,
  ScoreModel,
  CommentModel,
  BookmarkModel,
  UniversityModel,
  LikeTopicModel,
  type University,
  type User,
  type Topic
};
