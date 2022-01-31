import {Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support-request.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { GetChatListParams } from './dto/get-chat-list-params.dto';
import { ID } from '../common/ID';
import { SendMessageDto } from './dto/send-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SupportSocketGateway } from './gateway/support-socket.gateway';
import { Role } from "../roles/role.enum";

interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
  sendMessage(data: SendMessageDto): Promise<Message>;
  getMessages(supportRequest: ID, user: any): Promise<Message[]>;
  // subscribe(
  // handler: (supportRequest: SupportRequest, message: Message) => void,
  // ): () => void;
}

@Injectable()
export class SupportService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private readonly supportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly gateway: SupportSocketGateway,
  ) {}

  async findSupportRequests(
    params: GetChatListParams,
  ): Promise<SupportRequest[]> {
    // Set filter for user and state(isActive)
    let filter = {};
    if (params.user) {
      filter['user'] = params.user;
    }
    if (params.isActive) {
      filter['isActive'] = params.isActive;
    }
    if (Object.keys(filter).length === 0) {
      filter = null;
    }
    // Set limit and offset, if sent
    const options = {
      limit: params.limit ? params.limit : null,
      skip: params.offset ? params.offset : null,
    };
    // Access DB for requests list:
    try {
      return this.supportRequestModel
        .find(filter, null, options)
        .populate({ path: 'user' })
        .exec();
    } catch (e) {
      console.log('DB error - cant get Request List');
      throw new InternalServerErrorException();
    }
  }

  async getMessages(supportRequest: ID, user: any): Promise<Message[]> {
    try {
      const chat = await this.supportRequestModel
        .findById(supportRequest)
        .populate({
          path: 'messages',
          populate: { path: 'author' },
        })
        .exec();
      // Check if user is author of the request, when role = user
      if (user.role === Role.User && chat.user.toString() !== user.id) {
        console.log('User is not the owner of request');
        throw new UnauthorizedException();
      }
      //**//
      return chat.messages;
    } catch (e) {
      console.log('DB error - cant get chat messages');
      throw new InternalServerErrorException();
    }
  }

  async sendMessage(data: SendMessageDto): Promise<Message> {
    // Find the support request
    const request = await this.supportRequestModel.findById(
      data.supportRequest,
    );
    // Create new message document
    const newMessage = await this.messageModel.create({
      author: data.author,
      sentAt: new Date(),
      text: data.text,
    });
    // Push the message into request and save it
    request.messages.push(newMessage);
    request.save();
    // Send new message via web-socket
    try {
      this.gateway.sendNewMessage(request, newMessage);
    } catch (e) {
      console.log(e.message);
    }
    // Add author to the message
    await newMessage.populate({ path: 'author' });
    return newMessage;
  }
}
