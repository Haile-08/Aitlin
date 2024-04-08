import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const nurseSchema = new Schema({
  serviceId: {
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
  date: { 
    type : Date,
    default: Date.now
  }
});

export default mongoose.model('Nurse', nurseSchema);