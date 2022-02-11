import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { SupportService } from './support.service';
import { SupportClientService } from './support-client.service';
import { SupportEmployeeService } from './support-employee.service';
import { GetChatListParams } from './dto/get-chat-list-params.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { RolesGuard } from '../roles/roles.guard';
import { MarkMessagesAsReadDto } from './dto/mark-message-as-read.dto';
import { CreateSupportRequestInterceptor } from './interceptors/create-support-request.interceptor';
import { SupportReqListClientInterceptor } from './interceptors/support-req-list-client.interceptor';
import { SupportReqListManagerInterceptor } from './interceptors/support-req-list-manager.interceptor';
import { GetMessagesInterceptor } from './interceptors/get-messages.interceptor';
import { SendMessageInterceptor } from './interceptors/send-message.interceptor';
import { SendMessageDto } from './dto/send-message.dto';
import { RequestUserInterface } from '../common/request-user-interface';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { SupportQueryParamsDto } from './dto/support.query.params.dto';
import { ParamDto } from '../common/pipes/param.dto';

@Controller()
export class SupportController {
  constructor(
    private readonly supportService: SupportService,
    private readonly supportClientService: SupportClientService,
    private readonly supportEmployeeService: SupportEmployeeService,
  ) {}

  // 2.5.1 - Create support request (G-I-R)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @UseInterceptors(CreateSupportRequestInterceptor)
  @Post('api/client/support-requests')
  @Roles(Role.User)
  createSupportRequest(
    @Body(new ValidationPipe()) body: CreateSupportRequestDto,
    @Request() req: RequestUserInterface,
  ) {
    // Take user attached to req:
    const data: CreateSupportRequestDto = {
      user: req.user.id,
      text: body.text,
    };
    return this.supportClientService.createSupportRequest(data);
  }

  // 2.5.2 - Get requests list for client (G-I-R)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @UseInterceptors(SupportReqListClientInterceptor)
  @Get('api/client/support-requests')
  @Roles(Role.User)
  getMySupportRequestsList(
    @Query(new ValidationPipe()) queryParams: SupportQueryParamsDto,
    @Request() req: RequestUserInterface,
  ) {
    const data: GetChatListParams = {
      ...queryParams,
      user: req.user.id,
    };
    return this.supportService.findSupportRequests(data);
  }

  // 2.5.3 - List of Requests for manager (G-I-R)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @UseInterceptors(SupportReqListManagerInterceptor)
  @Get('api/manager/support-requests')
  @Roles(Role.Manager)
  async getClientsReqList(
    @Query(new ValidationPipe()) queryParams: SupportQueryParamsDto,
  ) {
    const data: GetChatListParams = {
      user: null,
      ...queryParams,
    };
    return await this.supportService.findSupportRequests(data);
  }

  // 2.5.4 - List of Request's messages (G-I-R)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @UseInterceptors(GetMessagesInterceptor)
  @Get('api/common/support-requests/:id/messages')
  @Roles(Role.Manager, Role.User)
  getChatMessages(
    @Param(new ValidationPipe()) param: ParamDto,
    @Request() req: RequestUserInterface,
  ) {
    return this.supportService.getMessages(param.id, req.user);
  }

  // 2.5.5 - Send message to a chat (Request) (G-I-R)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @UseInterceptors(SendMessageInterceptor)
  @Post('api/common/support-requests/:id/messages')
  @Roles(Role.Manager, Role.User)
  sendChatMessage(
    @Param(new ValidationPipe()) param: ParamDto,
    @Request() req: RequestUserInterface,
    @Body() body: SendMessageDto,
  ) {
    const data: SendMessageDto = {
      author: req.user.id,
      supportRequest: param.id,
      text: body.text,
    };
    return this.supportService.sendMessage(data);
  }

  // 2.5.6 - Mark messages from other's as read (G-R)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post('api/common/support-requests/:supportRequestId/messages/read')
  @Roles(Role.Manager, Role.User)
  markChatMessagesAsRead(
    @Body() body: MarkMessagesAsReadDto,
    @Request() req: RequestUserInterface,
    @Param(new ValidationPipe()) param: ParamDto,
  ) {
    const data: MarkMessagesAsReadDto = {
      user: req.user.id,
      supportRequest: param.supportRequestId,
      createdBefore: body.createdBefore,
    };
    // choose service acc. role
    if (req.user.role === Role.User) {
      return this.supportClientService.markMessagesAsRead(data);
    } else if (req.user.role === Role.Manager) {
      return this.supportEmployeeService.markMessagesAsRead(data);
    }
  }
}
