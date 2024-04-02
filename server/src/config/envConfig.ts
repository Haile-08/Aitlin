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
export const EMAIL_HOST: string | undefined = process.env.EMAIL_HOST;
export const EMAIL_USERNAME: string | undefined = process.env.EMAIL_USERNAME;
export const EMAIL_PASSWORD: string | undefined = process.env.EMAIL_PASSWORD;
export const FROM_EMAIL: string | undefined = process.env.FROM_EMAIL;
