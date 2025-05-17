import { Procurement } from "./procurement";

export interface User {
  id: number; // Changed from string to number based on Prisma model
  nik: string;
  username: string;
  email: string;
  role: Role;
  password?: string; // Optional, biasanya tidak dikembalikan untuk keamanan
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  procurements?: Procurement[]; // Optional karena tidak selalu di-include
}

export enum Role {
  USER = "USER",
  DIROPS = "DIROPS", 
  MANAGER = "MANAGER",
  PROCUREMENT = "PROCUREMENT"
}