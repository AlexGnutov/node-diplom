import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelsModule } from './hotels/hotels.module';
import { ReservationModule } from './reservation/reservation.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { HotelRoomModule } from './hotel-room/hotel-room.module';
import { SupportModule } from './support/support.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

const options = {
  user: process.env.DB_USERNAME || 'user',
  pass: process.env.DB_PASSWORD || 'password',
  // dbName: process.env.DB_NAME, // test - is default, can comment
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbURL = process.env.DB_HOST || 'mongodb://localhost:8082';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(dbURL, options),
    MulterModule.register({
      storage: './files',
    }),
    HotelsModule,
    HotelRoomModule,
    ReservationModule,
    AuthModule,
    SupportModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'socket-client'),
      exclude: ['/api*'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
