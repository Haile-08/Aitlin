import mongoose, { ConnectOptions } from 'mongoose';
import { MONGO_URL } from './envConfig';

const expressConnectDB = async () => {
  try {
    await mongoose.connect((MONGO_URL as string), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
  } catch (err) {
    console.error(err);
  }
};

export default expressConnectDB;