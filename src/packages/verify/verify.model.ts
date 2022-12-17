import { Document, model, Schema, Types } from 'mongoose';
import { VerifyToken } from '@packages/verify/verify.interface';

const { ObjectId } = Types;
const VerifyTokenSchema = new Schema({
  user_id: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 600,
  },
});

const VerifyToken = model<VerifyToken & Document>('VerifyToken', VerifyTokenSchema);

export default VerifyToken;
