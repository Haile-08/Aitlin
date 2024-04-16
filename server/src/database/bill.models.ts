import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const billSchema = new Schema({
  serviceId: {
    type: String,
    min: 1,
  },
  period: {
    type: String,
    min: 1,
  },
  comment: {
    type: String,
    min: 1,
  },
  files: {
    type: String,
    min: 1,
  },
  fileDate: {
    type : Date,
    default: () => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
    }
  },
  date: { 
    type : Date,
    default: () => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
    }
  }
});

export default mongoose.model('Bill', billSchema);