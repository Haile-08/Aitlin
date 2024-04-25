import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  serviceId: {
    type: String,
    min: 1,
  },
  clientId: {
    type: String,
    min: 1,
  },
  link: {
    type: String,
    min: 1,
  },
  type: {
    type: String,
    min: 1,
  },
  read: {
    type: Boolean,
    default: false,
  },
  date: { 
    type : Date,
    default: () => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
    }
  }
});

export default mongoose.model('Notification', notificationSchema);