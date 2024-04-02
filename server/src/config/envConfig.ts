import dotEnv from 'dotenv';

const status: string = 'development';

if (status === 'development'){
  // Development environment variables
  dotEnv.config();
}else{
  // Production environment variables
  const configPath: string = './.env.prod';
  dotEnv.config({ path: configPath});
}

export const PORT: string | undefined = process.env.PORT;
export const ENV_STAT: string | undefined = process.env.ENV_STAT;
export const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
export const MONGO_URL: string | undefined = process.env.MONGO_URL;