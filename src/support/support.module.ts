import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { SupportSocketGateway } from './gateway/support-socket.gateway';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { UsersModule } from '../users/users.module';
import { SupportClientService } from './support-client.service';
import { SupportEmployeeService } from './support-employee.service';
import { SupportProviders } from './support.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [AuthModule, UsersModule, DatabaseModule],
  providers: [
    SupportService,
    SupportSocketGateway,
    AuthService,
    SupportClientService,
    SupportEmployeeService,
    ...SupportProviders,
  ],
  controllers: [SupportController],
})
export class SupportModule {}
