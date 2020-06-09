import * as path from 'path';
import { config } from 'dotenv';

config({
  path: path.join(process.cwd(), '.env')
});

export default {
  server: {
    host: process.env.HOST,
    port: process.env.PORT
  },
  register: {
    plugins: [
      {
        plugin: '../plugins/apollo',
        options: {
          apiAuthKey: process.env.API_AUTH_KEY,
          cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
          cognitoClientId: process.env.COGNITO_CLIENT_ID
        }
      }
    ]
  }
};
