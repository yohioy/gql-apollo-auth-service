import { ModuleContext, ModuleSessionInfo } from '@graphql-modules/core';
import { responseType } from '@masteryo/masteryo-utils';
import { Cognito } from '@masteryo/masteryo-cognito';
import { UsersProvider } from '@masteryo/masteryo-gql-core-providers';

interface IUserSignup {
    password: string;
    email: string;
    firstName: string;
    lastName: string;
};

interface IUserVerify {
    code: string;
    email: string;
    password: string;
}

export interface IMutation {
    signUp: object,
    verifyAccount: object,
}

export const Mutation: IMutation = {
    signUp: async (_: any, args: IUserSignup, context: ModuleContext, sessionInfo: ModuleSessionInfo): Promise<any> => {

        const serverOptions: any = sessionInfo.session.request.serverOptions;

        const usersProvider: UsersProvider = context.injector.get(UsersProvider);

        const cognitoOptions: any = {
            UserPoolId: serverOptions.cognitoUserPoolId,
            ClientId: serverOptions.cognitoClientId
        };

        const cognito = new Cognito(cognitoOptions);

        const cognitoUserAttributes = {
            given_name: args.firstName,
            family_name: args.lastName,
            email: args.email,
        };

        // Add user to Cognito
        let cognitoSignupResponse;
        try {
            cognitoSignupResponse = await cognito.signup(args.email, args.password, cognitoUserAttributes);
        } catch (e) {
            console.log(responseType.failed, e);
            return responseType.failed;
        }

        if(!cognitoSignupResponse.userSub) {
            console.log(responseType.failed, 'Bad Signup');
            return responseType.failed;
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
            return responseType.success;
        } catch (e) {
            console.log(responseType.failed, e);
            return responseType.failed;
        }

    },
    verifyAccount: async (_: any, args: IUserVerify, context: ModuleContext, sessionInfo: ModuleSessionInfo) => {

        const serverOptions: any = sessionInfo.session.request.serverOptions;

        const usersProvider: UsersProvider = context.injector.get(UsersProvider);

        const code = args.code;
        const email = args.email;
        const password = args.password;

        const cognitoOptions: any = {
            UserPoolId: serverOptions.cognitoUserPoolId,
            ClientId: serverOptions.cognitoClientId
        };

        const cognito = new Cognito(cognitoOptions);

        // Confirm Registration
        try {
            await cognito.confirmRegistration(code, email);
        } catch (e) {
            console.log(responseType.failed, e);
            return responseType.failed;
        }

        let authUserResponse;
        try {
            authUserResponse = await cognito.authenticateUser(email, password);
        } catch (e) {
            console.log(responseType.failed, e);
            return responseType.failed;
        }

        // Update User status
        try {
            await usersProvider.updateVerifiedUser(authUserResponse.sub, 'CONFIRMED');
            return { ...responseType.success, ...{ token:authUserResponse.accessToken } };
        } catch (e) {
            console.log(responseType.failed, e);
            return responseType.failed;
        }

    }
};
