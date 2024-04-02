import { PORT, ENV_STAT } from '../config';
import { Express } from 'express';

/**
 * start the express server and catch error then exit
 * @param app express app
 */
const serverInitHandler = (app: Express) =>{
  app.listen(PORT, () => {
    console.log(`${ENV_STAT} environment started listening to port ${PORT}`);
  }).on('error', (err: Error) => {
    console.log(err);
    process.exit();
  });
};

export default serverInitHandler;