import 'reflect-metadata';
import {ApolloServer, AuthenticationError} from 'apollo-server-hapi';
import { buildFederatedSchema } from '@apollo/federation';
import { Server } from '@hapi/hapi';
import { AuthModule } from './auth-module';
import { dataMapper } from '@masteryo/masteryo-dynamodb-mapper';

const register = async(server: Server, options): Promise<void> => {

  const apolloServer = new ApolloServer({
    schema: buildFederatedSchema([AuthModule]),
    context: async (session: { request }) => {

      const apiKey = session.request.headers['x-api-key'];

      if (!apiKey) {
        throw new AuthenticationError('No Auth credentials');
      }

      if(options.apiAuthKey !== apiKey) {
        throw new AuthenticationError('Invalid API Key');
      }

      // Add plugin options
      session.request.serverOptions = options;

      // Add Data mapper
      session.request.dataMapper = dataMapper({
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

export const plugin = {
  name: 'apollo',
  register
}
