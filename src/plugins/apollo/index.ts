import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-hapi';
import { buildFederatedSchema } from '@apollo/federation';
import { Server } from '@hapi/hapi';
import { AuthModule } from './auth-module';


const register = async(server: Server, options) => {

  const apolloServer = new ApolloServer({
    schema: buildFederatedSchema([AuthModule]),
    context: session => session,
    formatError: (err) => {
      // Don't give the specific errors to the client.
      if (err) {
        //return Boom.badRequest(`Internal server error`,err);
        console.log(err);
        return new Error('Internal server error');
      }

      // Otherwise return the original error.  The error can also
      // be manipulated in other ways, so long as it's returned.
      return err;
    },
  });

  // @ts-ignore
  await apolloServer.applyMiddleware({ app: server });

};

export const plugin = {
  name: 'apollo',
  register
}