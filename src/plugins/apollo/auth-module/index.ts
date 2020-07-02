import path from 'path';
import { gql } from 'apollo-server-hapi';
import { GraphQLModule } from '@graphql-modules/core';
import { importSchema } from 'graphql-import';
import { resolvers } from './resolvers';
import { UsersProvider } from '@masteryo/masteryo-gql-core-providers';

const types = path.join(__dirname, './schema.graphql');

const typeDefs = importSchema(types);

export const AuthModule = new GraphQLModule({
  name: 'auth',
  resolvers,
  typeDefs: gql `
        ${typeDefs}
    `,
  providers: [UsersProvider],
  context: session => session
});

