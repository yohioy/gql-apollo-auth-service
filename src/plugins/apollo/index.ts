import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-hapi';
import { buildFederatedSchema } from '@apollo/federation';
import { Server } from '@hapi/hapi';
import { AuthModule } from './auth-module';

const register = async(server: Server) => {

  const apolloServer = new ApolloServer({
    schema: buildFederatedSchema([AuthModule]),
    context: session => session
  });

  // @ts-ignore
  await apolloServer.applyMiddleware({ app: server });

};

export const plugin = {
  name: 'apollo',
  register
}