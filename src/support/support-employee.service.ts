import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support-request.schema';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { ID } from '../common/ID';
import { MarkMessagesAsReadDto } from './dto/mark-message-as-read.dto';

interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: ID): Promise<Message[]>;
  closeRequest(supportRequest: ID): Promise<void>;
}

@Injectable()
export class SupportEmployeeService implements ISupportRequestEmployeeService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
  ) {}

  async closeRequest(supportRequest: ID): Promise<void> {
    try {
      await this.supportRequestModel.findByIdAndUpdate(supportRequest, {
        isActive: false,
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  async getUnreadCount(supportRequest: ID): Promise<Message[]> {
    // Get request with messages
    const request = await this.supportRequestModel
      .findById(supportRequest)
      .populate({ path: 'messages' })
      .exec();

    const unreadMessages = request.messages.filter((message) => {
      if (
        !message.readAt &&
        message.author.toString() === request.user.toString()
      ) {
        return true;
      }
      return false;
    });

    return Promise.resolve(unreadMessages);
  }

  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const readDate = params.createdBefore || new Date();
    // Get request with messages
    const request = await this.supportRequestModel
      .findById(params.supportRequest)
      .populate({ path: 'messages' })
      .exec();
    // Select user messages and set them as read
    for (const message of request.messages) {
      if (
        !message.readAt &&
        message.author.toString() === request.user.toString()
      ) {
        await this.messageModel.findByIdAndUpdate(message['_id'], {
          readAt: new Date(),
        });
      }
    }
    return { success: true };
  }
}
