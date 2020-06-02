import path from 'path';
import { config } from 'dotenv';
import { gql, AuthenticationError } from 'apollo-server-hapi';
import { GraphQLModule } from '@graphql-modules/core';
import { importSchema } from 'graphql-import';
import { dataMapper } from '@masteryo/masteryo-dynamodb-mapper';
import { resolvers } from './resolvers';
import { AuthProvider } from './providers';

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
  providers: [AuthProvider],
  context: async (session: { request }) => {

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
