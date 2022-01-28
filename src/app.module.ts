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

const options = {
  user: 'user',
  pass: 'password',
  // dbName: 'diploma_db',
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbURL = 'mongodb://localhost:8082';

@Module({
  imports: [
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
