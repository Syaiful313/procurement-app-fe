export const STATUS_CONFIG = {
  WAITING_CONFIRMATION: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Menunggu Konfirmasi",
  },
  PRIORITAS: {
    color: "bg-orange-50 text-orange-700 border-orange-200",
    label: "Prioritas",
  },
  URGENT: { color: "bg-red-50 text-red-700 border-red-200", label: "Mendesak" },
  COMPLEMENT: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    label: "Pelengkap",
  },
  REJECTED: {
    color: "bg-gray-50 text-gray-700 border-gray-200",
    label: "Ditolak",
  },
};

export const DEPARTMENT_MAPPING = {
  PURCHASE: "Pembelian",
  FACTORY: "Pabrik",
  OFFICE: "Kantor",
} as const;

export const TRACKING_STATUS_CONFIG = {
  DRAFT: {
    color: "bg-gray-50 text-gray-700 border-gray-200",
    label: "Draft",
  },
  MEMO_DIAJUKAN_ADMIN_PR: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    label: "Memo Dinaikan Admin PR",
  },
  APPROVAL_ATASAN_PERTAMA: {
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    label: "Approval Atasan 1",
  },
  APPROVAL_ATASAN_KEDUA: {
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    label: "Approval Atasan 2",
  },
  PENGADAAN_CARI_HARGA: {
    color: "bg-purple-50 text-purple-700 border-purple-200",
    label: "Cari Harga",
  },
  APPROVAL_MANAGER_KANTOR: {
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    label: "Approval Manager",
  },
  APPROVAL_DIROPS: {
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    label: "Approval Dirops",
  },
  PENCETAKAN_PO: {
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    label: "Cetak PO",
  },
  PO_DIKIRIM_KE_VENDOR: {
    color: "bg-teal-50 text-teal-700 border-teal-200",
    label: "PO Dikirim",
  },
  VENDOR_PROSES_PENGIRIMAN: {
    color: "bg-orange-50 text-orange-700 border-orange-200",
    label: "Proses Kirim",
  },
  BARANG_DIKIRIM_VENDOR: {
    color: "bg-lime-50 text-lime-700 border-lime-200",
    label: "Barang Dikirim",
  },
  BARANG_DI_GUDANG: {
    color: "bg-green-50 text-green-700 border-green-200",
    label: "Di Gudang",
  },
};
