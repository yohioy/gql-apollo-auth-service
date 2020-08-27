"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const dotenv_1 = require("dotenv");
dotenv_1.config({
    path: path.join(process.cwd(), '.env')
});
exports.default = {
    server: {
        host: process.env.HOST,
        port: process.env.PORT
    },
    register: {
        plugins: [
            {
                plugin: '../plugins/apollo',
                options: {
                    apiAuthKey: process.env.API_AUTH_KEY,
                    cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
                    cognitoClientId: process.env.COGNITO_CLIENT_ID,
                    dbRegion: process.env.DB_REGION,
                    dbEndpoint: process.env.DB_ENDPOINT
                }
            }
        ]
    }
};
//# sourceMappingURL=manifest.js.map