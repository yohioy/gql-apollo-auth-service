import { ModuleContext } from '@graphql-modules/core';
import { AuthProvider } from '../providers';
import { responseType } from '@masteryo/masteryo-utils';
import { Cognito } from '@masteryo/masteryo-cognito';

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
    signUp: async (_: any, args: IUserSignup, context: ModuleContext): Promise<any> => {
        const {
            COGNITO_USER_POOL_ID,
            COGNITO_CLIENT_ID
        } = process.env;

        const authProvider = context.injector.get(AuthProvider);

        const options: any = {
            UserPoolId: COGNITO_USER_POOL_ID,
            ClientId: COGNITO_CLIENT_ID
        };

        const cognito = new Cognito(options);

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
            groupId: '1',
            userStatus: '1',
            verificationStatus: 'UNCONFIRMED'
        };

        // Add user to Database
        try {
            await authProvider.createUser(dbRegisterUser);
            return responseType.success;
        } catch (e) {
            console.log(responseType.failed, e);
            return responseType.failed;
        }

    },
    verifyAccount: async (_: any, args: IUserVerify, context: ModuleContext) => {

        const {
            COGNITO_USER_POOL_ID,
            COGNITO_CLIENT_ID
        } = process.env;

        const authProvider = context.injector.get(AuthProvider);

        const code = args.code;
        const email = args.email;
        const password = args.password;

        const options: any = {
            UserPoolId: COGNITO_USER_POOL_ID,
            ClientId: COGNITO_CLIENT_ID
        };

        const cognito = new Cognito(options);

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
            await authProvider.updateVerifiedUser(authUserResponse.sub, 'CONFIRMED');
            return { ...responseType.success, ...{ token:authUserResponse.accessToken } };
        } catch (e) {
            console.log(responseType.failed, e);
            return responseType.failed;
        }

    }
};
