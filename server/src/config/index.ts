// env exports
export { PORT} from './envConfig';
export { ENV_STAT} from './envConfig';
export { MONGO_URL } from './envConfig';
export { JWT_SECRET } from './envConfig';
export { EMAIL_HOST } from './envConfig';
export { EMAIL_USERNAME } from './envConfig';
export { EMAIL_PASSWORD } from './envConfig';
export { FROM_EMAIL } from './envConfig';


// db connection
export { default as expressConnectDB } from './dbConfig';

// cors
export { default as allowedOrigins } from './allowedOrigin';