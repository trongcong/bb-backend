import { model, Schema, Document } from 'mongoose';
import { User } from '@packages/users/users.interface';
import { isEmail } from 'class-validator';

// const validateEmail = function (email) {
//   const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//   return re.test(email)
// };
const userSchema: Schema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Name required!'],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, 'Email required!'],
    validate: {
      validator: isEmail,
      message: props => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: String,
    lowercase: true,
    trim: true,
    default: 'user',
  },
  notification: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    default: '',
  },
  phone_number: {
    type: String,
    lowercase: true,
    trim: true,
    default: '',
  },
  website: {
    type: String,
    lowercase: true,
    trim: true,
    default: '',
  },
  address: {
    type: String,
    trim: true,
    default: '',
  },
  is_verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  created_at: {
    type: Number,
    default: Date.now,
  },
  updated_at: {
    type: Number,
    default: Date.now,
  },
  last_pass_change_at: {
    type: Number,
    default: Date.now,
  },
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
