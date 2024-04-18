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
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  billArchive: {
    type: String,
    default: '',
  },
  nurseArchive: {
    type: String,
    default: '',
  },
  blogArchive: {
    type: String,
    default: '',
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