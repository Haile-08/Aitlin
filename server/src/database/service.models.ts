import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  clientId: {
    type: String,
    min: 1,
  },
  clientName: {
    type: String,
    min: 1,
  },
  serviceName: {
    type: String,
    min: 1,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
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

export default mongoose.model('Service', serviceSchema);