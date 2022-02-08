import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server } from 'socket.io';
import * as passport from 'passport';
import * as express from 'express';
import { INestApplicationContext } from '@nestjs/common';

export class SessionAdapter extends IoAdapter {
  private readonly session: express.RequestHandler;

  constructor(session: express.RequestHandler, app: INestApplicationContext) {
    super(app);
    this.session = session;
  }

  create(port: number, options?: ServerOptions): Server {
    const server: Server = super.create(port, options);

    const wrap = (middleware) => (socket, next) =>
      middleware(socket.request, {}, next);

    server.use(wrap(this.session));

    server.use(wrap(passport.initialize()));
    server.use(wrap(passport.session()));

    server.use(function (socket, next) {
      next();
    });

    server.use((socket, next) => {
      if (socket.request['user']) {
        next();
      } else {
        next(new Error('Unauthorized'));
      }
    });

    return server;
  }
}
