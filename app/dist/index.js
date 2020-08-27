"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const manifest_1 = __importDefault(require("./config/manifest"));
const server_1 = require("./config/server");
const init = async () => {
    const server = await server_1.create(manifest_1.default);
    await server.start();
    console.log(`Server running on ${server.info.uri}/graphql`);
};
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
init();
//# sourceMappingURL=index.js.map