import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HotelsModule } from './hotels/hotels.module';
import { ReservationModule } from './reservation/reservation.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { HotelRoomModule } from './hotel-room/hotel-room.module';
import { SupportModule } from './support/support.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
