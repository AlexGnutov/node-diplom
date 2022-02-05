import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support-request.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { ID } from '../common/ID';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { MarkMessagesAsReadDto } from './dto/mark-message-as-read.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;

  markMessagesAsRead(params: MarkMessagesAsReadDto);

  getUnreadCount(supportRequest: ID): Promise<Message[]>;
}

@Injectable()
export class SupportClientService implements ISupportRequestClientService {
  constructor(
    // Importing both models - for requests and for messages
    @InjectModel(SupportRequest.name)
    private readonly supportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  // Creates request and puts initial message into it
  async createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<SupportRequest> {
    let newMessage;
    let newRequest;
    // Get current date
    const dateNow = new Date();
    // Create initial message
    try {
      newMessage = await this.messageModel.create({
        author: data.user,
        sentAt: dateNow,
        text: data.text,
      });
    } catch (e) {
      console.log("DB error - can't create new message", e.message);
      throw new InternalServerErrorException();
    }
    // Create request and put message inside
    try {
      newRequest = await this.supportRequestModel.create({
        user: data.user,
        createdAt: dateNow,
        messages: [newMessage],
        isActive: true,
      });
    } catch (e) {
      console.log("DB error - can't create new request", e.message);
      throw new InternalServerErrorException();
    }
    return newRequest;
  }

  // Marks all unread messages from support as read
  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const currentUser = params.user;
    const requestID = params.supportRequest;
    // const readDate = params.createdBefore || new Date();
    let request;
    // Get request with messages
    try {
      request = await this.supportRequestModel
        .findById(requestID)
        .populate({ path: 'messages' })
        .exec();
    } catch (e) {
      console.log('DB error: cant find support request');
      throw new InternalServerErrorException();
    }
    // Check if current user can access the request
    if (request.user.toString() !== currentUser) {
      console.log("Error: user and currentUser don't match");
      throw new UnauthorizedException();
    }
    // Select messages from support with "readAt = null"
    for (const message of request.messages) {
      if (!message.readAt && message.author.toString() !== currentUser) {
        await this.messageModel.findByIdAndUpdate(message['_id'], {
          readAt: new Date(),
        });
      }
    }
    return { success: true };
  }

  // Returns messages unread by request user
  async getUnreadCount(supportRequest: ID): Promise<Message[]> {
    let request;
    // Get request with messages
    try {
      request = await this.supportRequestModel
        .findById(supportRequest)
        .populate({ path: 'messages' })
        .exec();
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException();
    }
    // Filter unread messages from support
    const unreadMessages = request.messages.filter((message) => {
      // Condition: not read, user is not the author
      if (
        !message.readAt &&
        message.author.toString() !== request.user.toString()
      ) {
        return true;
      }
      return false;
    });
    // Return messages list
    return unreadMessages;
  }
}
