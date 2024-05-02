import mongoose from 'mongoose';
import { MONGO_URL } from './envConfig';

const expressConnectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL as string  );
  } catch (err) {
    console.error(err);
  }
};

export default expressConnectDB;
