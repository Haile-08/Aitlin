import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const nurseSchema = new Schema({
  serviceId: {
    type: String,
    min: 1,
  },
  Name: {
    type: String,
    min: 1,
  },
  comment: {
    type: String,
    min: 1,
  },
  Archive: {
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

export default mongoose.model('Nurse', nurseSchema);