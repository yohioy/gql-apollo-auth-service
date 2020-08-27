"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
const masteryo_utils_1 = require("@masteryo/masteryo-utils");
const masteryo_cognito_1 = require("@masteryo/masteryo-cognito");
const masteryo_gql_core_providers_1 = require("@masteryo/masteryo-gql-core-providers");
;
exports.Mutation = {
    signUp: async (_, args, context, sessionInfo) => {
        const serverOptions = sessionInfo.session.request.serverOptions;
        const usersProvider = context.injector.get(masteryo_gql_core_providers_1.UsersProvider);
        const cognitoOptions = {
            UserPoolId: serverOptions.cognitoUserPoolId,
            ClientId: serverOptions.cognitoClientId
        };
        const cognito = new masteryo_cognito_1.Cognito(cognitoOptions);
        const cognitoUserAttributes = {
            given_name: args.firstName,
            family_name: args.lastName,
            email: args.email,
        };
        // Add user to Cognito
        let cognitoSignupResponse;
        try {
            cognitoSignupResponse = await cognito.signup(args.email, args.password, cognitoUserAttributes);
        }
        catch (e) {
            console.log(masteryo_utils_1.responseType.failed, e);
            return masteryo_utils_1.responseType.failed;
        }
        if (!cognitoSignupResponse.userSub) {
            console.log(masteryo_utils_1.responseType.failed, 'Bad Signup');
            return masteryo_utils_1.responseType.failed;
        }
        const userId = cognitoSignupResponse.userSub;
        const dbRegisterUser = {
            id: userId,
            firstName: args.firstName,
            createdDate: Date.now(),
            modifiedDate: Date.now(),
            group: 'admin',
            userStatus: '1',
            verificationStatus: 'UNCONFIRMED'
        };
        // Add user to Database
        try {
            await usersProvider.createUser(dbRegisterUser);
            return masteryo_utils_1.responseType.success;
        }
        catch (e) {
            console.log(masteryo_utils_1.responseType.failed, e);
            return masteryo_utils_1.responseType.failed;
        }
    },
    verifyAccount: async (_, args, context, sessionInfo) => {
        const serverOptions = sessionInfo.session.request.serverOptions;
        const usersProvider = context.injector.get(masteryo_gql_core_providers_1.UsersProvider);
        const code = args.code;
        const email = args.email;
        const password = args.password;
        const cognitoOptions = {
            UserPoolId: serverOptions.cognitoUserPoolId,
            ClientId: serverOptions.cognitoClientId
        };
        const cognito = new masteryo_cognito_1.Cognito(cognitoOptions);
        // Confirm Registration
        try {
            await cognito.confirmRegistration(code, email);
        }
        catch (e) {
            console.log(masteryo_utils_1.responseType.failed, e);
            return masteryo_utils_1.responseType.failed;
        }
        let authUserResponse;
        try {
            authUserResponse = await cognito.authenticateUser(email, password);
        }
        catch (e) {
            console.log(masteryo_utils_1.responseType.failed, e);
            return masteryo_utils_1.responseType.failed;
        }
        // Update User status
        try {
            await usersProvider.updateVerifiedUser(authUserResponse.sub, 'CONFIRMED');
            return { ...masteryo_utils_1.responseType.success, ...{ token: authUserResponse.accessToken } };
        }
        catch (e) {
            console.log(masteryo_utils_1.responseType.failed, e);
            return masteryo_utils_1.responseType.failed;
        }
    }
};
//# sourceMappingURL=Mutation.js.map