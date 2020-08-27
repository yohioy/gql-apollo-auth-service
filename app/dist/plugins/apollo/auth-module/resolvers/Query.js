"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const masteryo_utils_1 = require("@masteryo/masteryo-utils");
const masteryo_cognito_1 = require("@masteryo/masteryo-cognito");
const masteryo_gql_core_providers_1 = require("@masteryo/masteryo-gql-core-providers");
exports.Query = {
    signIn: async (parent, args, context, sessionInfo) => {
        const serverOptions = sessionInfo.session.request.serverOptions;
        const email = args.email;
        const password = args.password;
        const cognitoOptions = {
            UserPoolId: serverOptions.cognitoUserPoolId,
            ClientId: serverOptions.cognitoClientId
        };

        console.log('cognitoOptions',cognitoOptions);
        const cognito = new masteryo_cognito_1.Cognito(cognitoOptions);

        let authUserResponse;
        try {
            authUserResponse = await cognito.authenticateUser(email, password);
        }
        catch (e) {
            console.log('Failed:', masteryo_utils_1.responseType.failed, e);
            return masteryo_utils_1.responseType.failed;
        }
        const usersProvider = context.injector.get(masteryo_gql_core_providers_1.UsersProvider);
        try {
            await usersProvider.getUser(authUserResponse.sub);
            return { ...masteryo_utils_1.responseType.success, ...{ token: authUserResponse.accessToken } };
        }
        catch (e) {
            console.log(masteryo_utils_1.responseType.failed, e);
            return masteryo_utils_1.responseType.failed;
        }
    },
    signOut: async () => {
    }
};
//# sourceMappingURL=Query.js.map
