import mongoose, { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
export interface UserDocument extends Document {
  username: string;
  email: string;
  _id: ObjectId;
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);
export default User;
