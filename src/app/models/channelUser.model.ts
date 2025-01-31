import { Channel } from "./channel.model";
import { User } from "./user.model";

export enum UserRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  GUEST = "GUEST",
}

export type ChannelUser = {
  id?: number;
  user: User;
  channel: Channel;
  userRole: UserRole;
}
