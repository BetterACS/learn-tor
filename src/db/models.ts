import mongoose, { Document, Schema } from 'mongoose';

// User Schema
interface User extends Document {
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
  title: string;
  body: string;
  user_id: mongoose.Types.ObjectId;
  status?: string;
  created_at: Date;
  n_like?: number;
  forum?: string;
  tags: string[];
}

const TopicSchema: Schema<Topic> = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String },
  created_at: { type: Date, default: Date.now },
  n_like: { type: Number, default: 0 },
  forum: { type: String },
  tags: { type: [String], default: [] },
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

export {
  UserModel,
  TopicModel,
  ChatModel,
  ScoreModel,
  CommentModel,
  BookmarkModel,
};
