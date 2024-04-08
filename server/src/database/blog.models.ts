import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const blogSchema = new Schema({
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
  date: { 
    type : Date,
    default: Date.now
  }
});

export default mongoose.model('Blog', blogSchema);