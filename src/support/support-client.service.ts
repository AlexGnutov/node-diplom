import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupportRequest } from './schemas/support-request.interface';
import { Message } from './schemas/message.interface';
import { ID } from '../common/ID';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { MarkMessagesAsReadDto } from './dto/mark-message-as-read.dto';
import { Model } from 'mongoose';
import { MessageModelName, SupportRequestModelName } from '../common/constants';

interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: ID): Promise<Message[]>;
}

@Injectable()
export class SupportClientService implements ISupportRequestClientService {
  constructor(
    // Importing both models - for requests and for messages
    @Inject(MessageModelName)
    private messageModel: Model<Message>,
    @Inject(SupportRequestModelName)
    private supportRequestModel: Model<SupportRequest>,
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
      throw new InternalServerErrorException(
        e,
        "DB error - can't create new message",
      );
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
      throw new InternalServerErrorException(
        e,
        "DB error - can't create new request",
      );
    }
    return newRequest;
  }

  // Marks all unread messages from support as read
  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const currentUser = params.user;
    const requestID = params.supportRequest;
    let request;
    // Get request with messages
    try {
      request = await this.supportRequestModel
        .findById(requestID)
        .populate({ path: 'messages' })
        .exec();
    } catch (e) {
      throw new InternalServerErrorException(
        e,
        'DB error: cant find support request',
      );
    }
    // Check if current user can access the request
    if (request.user.toString() !== currentUser) {
      throw new UnauthorizedException(
        "Error: user and currentUser don't match",
      );
    }
    // Select messages from support with "readAt = null"
    for (const message of request.messages) {
      if (!message.readAt && message.author.toString() !== currentUser) {
        try {
          await this.messageModel.findByIdAndUpdate(message['_id'], {
            readAt: new Date(),
          });
        } catch (e) {
          throw new InternalServerErrorException(
            e,
            'DB error: cant update message',
          );
        }
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
      throw new InternalServerErrorException(
        e,
        "DB-error: getUnreadCount - can't load request",
      );
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
