"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
/**
 * start the express server and catch error then exit
 * @param app express app
 */
const serverInitHandler = (app) => {
    app.listen(config_1.PORT, () => {
        console.log(`${config_1.ENV_STAT} environment started listening to port ${config_1.PORT}`);
    }).on('error', (err) => {
        console.log(err);
        process.exit();
    });
};
exports.default = serverInitHandler;
//# sourceMappingURL=serverInitHandler.js.map