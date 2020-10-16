import 'reflect-metadata';
import {ApolloServer, AuthenticationError} from 'apollo-server-hapi';
import { buildFederatedSchema } from '@apollo/federation';
import { Server } from '@hapi/hapi';
import { AuthModule } from './auth-module';
import { dataMapper } from '@masteryo/masteryo-dynamodb-mapper';
import { Encryption } from '../../../shared/encryption';

const register = async(server: Server, options): Promise<void> => {

  const apolloServer = new ApolloServer({
    schema: buildFederatedSchema([AuthModule]),
    context: async (session: { request }) => {

      const apiKey = session.request.headers['x-api-key'];

      if (!apiKey) {
        throw new AuthenticationError('No API credentials');
      }

      if(options.apiAuthKey !== apiKey) {
        throw new AuthenticationError('Invalid API Key');
      }

      // Add plugin options
      session.request.serverOptions = options;

      // Add Data mapper
      session.request.dataMapper = dataMapper({
            region: options.dbRegion,
            endpoint: (options.dbEndpoint) ? options.dbEndpoint : null,
            accessKeyId: (options.dbAccessKeyId) ? options.dbAccessKeyId : null,
            secretAccessKey: (options.dbSecretAccessKey) ? options.dbSecretAccessKey : null,
          },
          options.dbTableNamePrefix);

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

export const plugin = {
  name: 'apollo',
  register
}
