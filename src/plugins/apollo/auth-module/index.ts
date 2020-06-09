import path from 'path';
import { config } from 'dotenv';
import { gql, AuthenticationError } from 'apollo-server-hapi';
import { GraphQLModule } from '@graphql-modules/core';
import { importSchema } from 'graphql-import';
import { dataMapper } from '@masteryo/masteryo-dynamodb-mapper';
import { resolvers } from './resolvers';
import { UsersProvider } from '../../../masteryo-gql-core-providers/users';

const types = path.join(__dirname, './schema.graphql');

const typeDefs = importSchema(types);

config({path: '.env'});

const options = {
  region: process.env.DB_REGION,
  endpoint: process.env.DB_ENDPOINT,
  apiAuthKey: process.env.API_AUTH_KEY
};

export const AuthModule = new GraphQLModule({
  name: 'auth',
  resolvers,
  typeDefs: gql `
        ${typeDefs}
    `,
  providers: [UsersProvider],
  context: async (session: any, currentContext, { injector}) => {

    console.log('session',session);
    console.log('sessionServer',session.request.server.registrations);
    console.log('currentContext',currentContext);
    const apiKey = session.request.headers['x-api-key'];

    if (!apiKey) {
      throw new AuthenticationError('No Auth credentials');
    }

    if(options.apiAuthKey !== apiKey) {
      throw new AuthenticationError('Invalid API Key');
    }

    return true;
  }
}).forRoot({
  mapper: dataMapper(options)
});
