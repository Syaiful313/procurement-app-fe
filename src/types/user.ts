import { Procurement } from "./procurement";

export interface User {
  id: string;
  nik: string;
  username: string;
  email: string;
  role: Role;
  password: string;
  createdAt: string;
  updatedAt: string;
  procurements: Procurement[];
}
export enum Role {
  USER = "USER",
  DIROPS = "DIROPS", 
  MANAGER = "MANAGER",
  PROCUREMENT = "PROCUREMENT"
}