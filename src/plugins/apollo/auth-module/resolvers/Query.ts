import { ModuleContext } from '@graphql-modules/core';
import { responseType } from '@masteryo/masteryo-utils';
import { Cognito } from '@masteryo/masteryo-cognito';

export interface IQuery {
    signIn: object,
    signOut: object
}

interface IUserSignin {
    email: string;
    password: string;
}


export const Query: IQuery = {
    signIn: async (_: any, args: IUserSignin, context: ModuleContext): Promise<any> => {
        const {
            COGNITO_USER_POOL_ID,
            COGNITO_CLIENT_ID
        } = process.env;

        const email = args.email;
        const password = args.password;

        const cognitoOptions: any = {
            UserPoolId: COGNITO_USER_POOL_ID,
            ClientId: COGNITO_CLIENT_ID
        };

        console.log(cognitoOptions);
        const cognito = new Cognito(cognitoOptions);

        let authUserResponse;
        try {
            authUserResponse = await cognito.authenticateUser(email, password);
            return { ...responseType.success, ...{ token:authUserResponse.accessToken } };
        } catch (e) {
            console.log(responseType.failed, e);
            return responseType.failed;
        }

    },
    signOut: async () => {

    }
};
