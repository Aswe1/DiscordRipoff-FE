import { User } from "./user.model";

export type Channel = {
  id?: number;
  name: string;
  owner: User;
}
