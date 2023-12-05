import { User } from "./User";

export type responseToUser = {
  code: number;
  status: string;
  message?: string;
  data?: any[] | User | User[];
}