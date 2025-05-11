import { Procurement } from "./procurement";

export interface User {
  id: string;
  nik: string;
  username: string;
  email: string;
  role: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  procurements: Procurement[];
}
