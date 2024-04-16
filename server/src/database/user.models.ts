import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Name: {
    type: String,
    min: 1,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    min: 8,
  },
  type: {
    type: String,
    min: 8,
  },
  ServiceNumber: {
    type: Number,
    default: 0,
  },
  Notification: {
    type: Boolean,
    default: false,
  },
  date: { 
    type : Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);