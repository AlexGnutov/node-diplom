import { ID } from '../../common/ID';

export interface SendMessageDto {
  author: ID;
  supportRequest: ID;
  text: string;
}
