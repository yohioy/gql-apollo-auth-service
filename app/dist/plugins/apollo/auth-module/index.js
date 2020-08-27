"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const path_1 = __importDefault(require("path"));
const apollo_server_hapi_1 = require("apollo-server-hapi");
const core_1 = require("@graphql-modules/core");
const graphql_import_1 = require("graphql-import");
const resolvers_1 = require("./resolvers");
const masteryo_gql_core_providers_1 = require("@masteryo/masteryo-gql-core-providers");
const types = path_1.default.join(__dirname, './schema.graphql');
const typeDefs = graphql_import_1.importSchema(types);
exports.AuthModule = new core_1.GraphQLModule({
    name: 'auth',
    resolvers: resolvers_1.resolvers,
    typeDefs: apollo_server_hapi_1.gql `
        ${typeDefs}
    `,
    providers: [masteryo_gql_core_providers_1.UsersProvider],
    context: session => session
});
//# sourceMappingURL=index.js.map