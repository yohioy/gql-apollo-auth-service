import { ModuleContext, ModuleSessionInfo } from '@graphql-modules/core';
import { responseType } from '@masteryo/masteryo-utils';
import { Cognito } from '@masteryo/masteryo-cognito';
import { UsersProvider } from '../../../../masteryo-gql-core-providers/users';

export interface IQuery {
    signIn: object,
    signOut: object
}

interface IUserSignin {
    email: string;
    password: string;
}


export const Query: IQuery = {
    signIn: async (parent: any, args: IUserSignin, context: ModuleContext, sessionInfo: ModuleSessionInfo): Promise<any> => {

        const serverOptions: any = sessionInfo.session.request.serverOptions;

        const email = args.email;
        const password = args.password;

        const cognitoOptions: any = {
            UserPoolId: serverOptions.cognitoUserPoolId,
            ClientId: serverOptions.cognitoClientId
        };

        const cognito = new Cognito(cognitoOptions);

        let authUserResponse;
        try {
            authUserResponse = await cognito.authenticateUser(email, password);
        } catch (e) {
            console.log(responseType.failed, e);
            return responseType.failed;
        }


        const usersProvider: UsersProvider = context.injector.get(UsersProvider);

        try {
            await usersProvider.getUser(authUserResponse.sub);
            return { ...responseType.success, ...{ token:authUserResponse.accessToken } };
        } catch (e) {
            console.log(responseType.failed, e);
            return responseType.failed;
        }
    },
    signOut: async () => {

    }
};
