import { ID } from '../../common/ID';

export interface GetChatListParams {
  user?: ID | null;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}
