import { Channel } from "./channel.model";
import { User } from "./user.model";

export type Message = {
  id?: number;
  content: string;
  sender: User;
  receiver?: User;
  channel?: Channel;
  timestamp?: Date;
  privateMessage?: boolean;
  channelMessage?: boolean;
}
