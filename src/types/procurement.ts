import { User } from "./user";

export type ProcurementStatus =
  | "WAITING_CONFIRMATION"
  | "PRIORITAS"
  | "URGENT"
  | "COMPLEMENT"
  | "REJECTED";

export interface Procurement {
  id: number;
  username: string;
  description: string;
  status: ProcurementStatus;
  createdAt: string;
  updatedAt: string;
  user: User
}
