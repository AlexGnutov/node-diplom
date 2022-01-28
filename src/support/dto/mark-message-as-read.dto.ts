import { ID } from '../../common/ID';

export interface MarkMessagesAsReadDto {
  user?: ID;
  supportRequest: ID;
  createdBefore: Date;
}
