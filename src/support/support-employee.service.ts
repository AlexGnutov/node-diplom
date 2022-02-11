import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupportRequest } from './schemas/support-request.interface';
import { Model } from 'mongoose';
import { Message } from './schemas/message.interface';
import { ID } from '../common/ID';
import { MarkMessagesAsReadDto } from './dto/mark-message-as-read.dto';
import { MessageModelName, SupportRequestModelName } from '../common/constants';

interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: ID): Promise<Message[]>;
  closeRequest(supportRequest: ID): Promise<void>;
}

@Injectable()
export class SupportEmployeeService implements ISupportRequestEmployeeService {
  constructor(
    @Inject(MessageModelName)
    private messageModel: Model<Message>,
    @Inject(SupportRequestModelName)
    private supportRequestModel: Model<SupportRequest>,
  ) {}

  async closeRequest(supportRequest: ID): Promise<void> {
    try {
      await this.supportRequestModel.findByIdAndUpdate(supportRequest, {
        isActive: false,
      });
    } catch (e) {
      throw new InternalServerErrorException(
        e,
        "DB-error: closeRequest - can't find request:",
      );
    }
  }

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
        "DB-error: getUnreadCount - can't find request:",
      );
    }
    // Filter messages with author = request.user and readAt = null
    return request.messages.filter((message) => {
      return (
        !message.readAt && message.author.toString() === request.user.toString()
      );
    });
  }

  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    let request: SupportRequest;
    // Get request with messages
    try {
      request = await this.supportRequestModel
        .findById(params.supportRequest)
        .populate({ path: 'messages' })
        .exec();
    } catch (e) {
      throw new InternalServerErrorException(
        e,
        "DB-error: markMessageAsRead: can't find request:",
      );
    }
    // Select user messages and set them as read
    for (const message of request.messages) {
      if (
        !message.readAt &&
        message.author.toString() === request.user.toString()
      ) {
        try {
          await this.messageModel.findByIdAndUpdate(message.id, {
            readAt: new Date(),
          });
        } catch (e) {
          throw new InternalServerErrorException(
            e,
            "DB-error: markMessageAsRead: can't update message",
          );
        }
      }
    }
    return { success: true };
  }
}
