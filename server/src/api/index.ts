// express route
export {default as expressRouteHandler} from './routers/index.routes';
export {default as authRoutHandler} from './routers/auth.routes';
export {default as adminRoutHandler} from './routers/admin.routes';
export {default as clientRoutHandler} from './routers/client.routes';

// express controller
export { default as authController} from './controllers/auth.controller';
export { default as adminController} from './controllers/admin.controller';
export { default as clientController} from './controllers/client.controller';