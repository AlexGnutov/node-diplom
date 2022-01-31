import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support-request.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { ID } from '../common/ID';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { MarkMessagesAsReadDto } from './dto/mark-message-as-read.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';

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
    // Get current date
    const dateNow = new Date();
    // Create initial message
    const newMessage = await this.messageModel.create({
      author: data.user,
      sentAt: dateNow,
      text: data.text,
    });
    // Create request and put message inside
    const newRequest = await this.supportRequestModel.create({
      user: data.user,
      createdAt: dateNow,
      messages: [newMessage],
      isActive: true,
    });
    return newRequest;
  }

  // Marks all unread messages from support as read
  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const currentUser = params.user;
    const requestID = params.supportRequest;
    const readDate = params.createdBefore || new Date();
    // Get request with messages
    const request = await this.supportRequestModel
      .findById(requestID)
      .populate({ path: 'messages' })
      .exec();
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
    // Get request with messages
    const request = await this.supportRequestModel
      .findById(supportRequest)
      .populate({ path: 'messages' })
      .exec();
    const unreadMessages = request.messages.filter((message) => {
      if (
        !message.readAt &&
        message.author.toString() !== request.user.toString()
      ) {
        return true;
      }
      return false;
    });
    return Promise.resolve(unreadMessages);
  }
}
