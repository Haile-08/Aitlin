import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    min: 1,
  },
  lastName: {
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
  date: {
    type: String,
    min: 1,
  },
});

export default mongoose.model('User', userSchema);