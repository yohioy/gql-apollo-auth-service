"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
require("reflect-metadata");
const apollo_server_hapi_1 = require("apollo-server-hapi");
const federation_1 = require("@apollo/federation");
const auth_module_1 = require("./auth-module");
const masteryo_dynamodb_mapper_1 = require("@masteryo/masteryo-dynamodb-mapper");
const register = async (server, options) => {
    const apolloServer = new apollo_server_hapi_1.ApolloServer({
        schema: federation_1.buildFederatedSchema([auth_module_1.AuthModule]),
        context: async (session) => {
            const apiKey = session.request.headers['x-api-key'];
            if (!apiKey) {
                throw new apollo_server_hapi_1.AuthenticationError('No Auth credentials');
            }
            if (options.apiAuthKey !== apiKey) {
                throw new apollo_server_hapi_1.AuthenticationError('Invalid API Key');
            }
            // Add plugin options
            session.request.serverOptions = options;
            // Add Data mapper
            session.request.dataMapper = masteryo_dynamodb_mapper_1.dataMapper({
                region: options.dbRegion,
                endpoint: options.dbEndpoint
            });
            return session;
        },
        formatError: (err) => {
            // Don't give the specific errors to the client.
            if (err) {
                console.log(err);
                return new Error('Internal server error');
            }
            return err;
        }
    });
    // @ts-ignore
    await apolloServer.applyMiddleware({ app: server });
};
exports.plugin = {
    name: 'apollo',
    register
};
//# sourceMappingURL=index.js.map