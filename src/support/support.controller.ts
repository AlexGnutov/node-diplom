import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards, UseInterceptors,
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
import { ID } from '../common/ID';
import { MarkMessagesAsReadDto } from './dto/mark-message-as-read.dto';
import { CreateSupportRequestInterceptor } from './interceptors/create-support-request.interceptor';
import { SupportReqListClientInterceptor } from './interceptors/support-req-list-client.interceptor';
import { SupportReqListManagerInterceptor } from './interceptors/support-req-list-manager.interceptor';
import {GetMessagesInterceptor} from "./interceptors/get-messages.interceptor";
import {SendMessageInterceptor} from "./interceptors/send-message.interceptor";

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
  createSupportRequest(@Body() body, @Request() req) {
    const data: CreateSupportRequestDto = {
      user: req.user.id,
      text: body.text,
    };
    // console.log(data);
    return this.supportClientService.createSupportRequest(data);
  }

  // 2.5.2 - Get requests list for client (G-I-R)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @UseInterceptors(SupportReqListClientInterceptor)
  @Get('api/client/support-requests')
  @Roles(Role.User)
  getMySupportRequestsList(@Query() queryParams, @Request() req) {
    const data: GetChatListParams = {
      user: req.user.id,
      isActive: queryParams.isActive,
      offset: queryParams.offset,
      limit: queryParams.limit,
    };
    // console.log(data);
    return this.supportService.findSupportRequests(data);
  }

  // 2.5.3 - List of Requests for manager (G-I-R)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @UseInterceptors(SupportReqListManagerInterceptor)
  @Get('api/manager/support-requests')
  @Roles(Role.Manager)
  getClientsReqList(@Query() queryParams: any) {
    const data: GetChatListParams = {
      user: null,
      isActive: queryParams.isActive,
      offset: queryParams.offset,
      limit: queryParams.limit,
    };
    console.log(data);
    return this.supportService.findSupportRequests(data);
  }

  // 2.5.4 - List of Request's messages (G-I-R)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @UseInterceptors(GetMessagesInterceptor)
  @Get('api/common/support-requests/:id/messages')
  @Roles(Role.Manager, Role.User)
  getChatMessages(@Param('id') id: string, @Request() req: any) {
    return this.supportService.getMessages(id, req.user);
  }

  // 2.5.5 - Send message to a chat (Request) (G-I-R)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @UseInterceptors(SendMessageInterceptor)
  @Post('api/common/support-requests/:id/messages')
  @Roles(Role.Manager, Role.User)
  sendChatMessage(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: any,
  ) {
    const data = {
      author: req.user.id,
      supportRequest: id,
      text: body.text,
    };
    return this.supportService.sendMessage(data);
  }

  // 2.5.6 - Mark messages from other's as read (G-R)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post('api/common/support-requests/:id/messages/read')
  @Roles(Role.Manager, Role.User)
  markChatMessagesAsRead(
    @Body() body: any,
    @Request() req: any,
    @Param('id') supportReqId: ID,
  ) {
    const data: MarkMessagesAsReadDto = {
      user: req.user.id,
      supportRequest: supportReqId,
      createdBefore: body.createdBefore,
    };
    // choose service acc. role
    if (req.user.role === Role.User) {
      return this.supportClientService.markMessagesAsRead(data);
    } else if (req.user.role === Role.Manager) {
      return this.supportEmployeeService.markMessagesAsRead(data);
    }
  }
  //
  // functions test
  @Get('api/test/:reqid')
  async checkUnreadCounts(@Param('reqid') reqId: ID) {
    const clients = await this.supportClientService.getUnreadCount(reqId);
    const managers = await this.supportEmployeeService.getUnreadCount(reqId);
    return {
      clients,
      managers,
    };
  }
}
