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
  note: string;
  date: string;
  department: "PURCHASE" | "FACTORY" | "OFFICE";
  itemName: string;
  specification: string;
  quantity: number;
  unit: string;
  trackingStatus: TrackingStatus;
  createdAt: string;
  updatedAt: string;
  user: User
}

export enum TrackingStatus {
  DRAFT = "DRAFT",
  MEMO_DIAJUKAN_ADMIN_PR = "MEMO_DIAJUKAN_ADMIN_PR",
  APPROVAL_ATASAN_PERTAMA = "APPROVAL_ATASAN_PERTAMA",
  APPROVAL_ATASAN_KEDUA = "APPROVAL_ATASAN_KEDUA",
  PENGADAAN_CARI_HARGA = "PENGADAAN_CARI_HARGA",
  APPROVAL_MANAGER_KANTOR = "APPROVAL_MANAGER_KANTOR",
  APPROVAL_DIROPS = "APPROVAL_DIROPS",
  PENCETAKAN_PO = "PENCETAKAN_PO",
  PO_DIKIRIM_KE_VENDOR = "PO_DIKIRIM_KE_VENDOR",
  VENDOR_PROSES_PENGIRIMAN = "VENDOR_PROSES_PENGIRIMAN",
  BARANG_DIKIRIM_VENDOR = "BARANG_DIKIRIM_VENDOR",
  BARANG_DI_GUDANG = "BARANG_DI_GUDANG",
}