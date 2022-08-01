import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import proxy from 'express-http-proxy';
import logger from 'morgan';
import path from 'path';
import { initGraphQL } from 'src/server/graphql/GraphQLSchema';
import { initMongoClient } from 'src/server/mongo/client';
import { initUserModels } from 'src/server/user/UserModel';
import { ENV_USE_HOT_RELOADING } from '../env/ENV_USE_HOT_RELOADING';

export function createExpressApp(): ReturnType<typeof express> {
  // Since we're under src/server/root/createExpressApp.ts,
  // we need to go up 3 directories to get to the root directory.
  const rootDirectory = path.normalize(path.join(__dirname, '../../..'));

  const app = express();

  app.use(cors());
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  initMongoClient();
  initUserModels(app);
  initGraphQL(app);

  app.use(express.static(path.join(rootDirectory, 'assets')));

  if (ENV_USE_HOT_RELOADING) {
    app.use(proxy('localhost:19006'));
  } else {
    app.use(express.static(path.join(rootDirectory, 'web-build')));
    app.get('/*', (req, res) =>
      res.sendFile('web-build/index.html', { root: rootDirectory }),
    );
  }

  return app;
}
