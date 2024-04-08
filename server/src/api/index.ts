// express route
export {default as expressRouteHandler} from './routers/index.routes';
export {default as authRoutHandler} from './routers/auth.routes';
export {default as adminRoutHandler} from './routers/admin.routes';

// express controller
export { default as authController} from './controllers/auth.controller';
export { default as adminController} from './controllers/admin.controller';