import {Injectable, InternalServerErrorException} from '@nestjs/common';
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

interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
  sendMessage(data: SendMessageDto): Promise<Message>;
  getMessages(supportRequest: ID): Promise<Message[]>;
  /*subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void;
  */
}

@Injectable()
export class SupportService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private readonly supportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
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
      return this.supportRequestModel.find(filter, null, options).exec();
    } catch (e) {
      console.log('DB error - cant get Request List');
      throw new InternalServerErrorException();
    }
  }

  async getMessages(supportRequest: ID): Promise<Message[]> {
    try {
      const chat = await this.supportRequestModel.findById(supportRequest);
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
    console.log(request);

    const newMessage = await this.messageModel.create({
      author: data.author,
      sentAt: new Date(),
      text: data.text,
    });

    request.messages.push(newMessage);
    request.save();
    console.log(request.messages);
    return newMessage;
  }
}
