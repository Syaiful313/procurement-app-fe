import * as Yup from "yup";

export const CreateProcurementSchema = Yup.object().shape({
  username: Yup.string().required("Nama harus diisi"),
  description: Yup.string().required("Deskripsi harus diisi"),
  date: Yup.date().required("Tanggal harus diisi"),
  department: Yup.string()
    .oneOf(["PURCHASE", "FACTORY", "OFFICE"], "Department tidak valid")
    .required("Department harus dipilih"),
  itemName: Yup.string().required("Nama barang harus diisi"),
  specification: Yup.string().required("Spesifikasi harus diisi"),
  quantity: Yup.string()
    .required("Jumlah harus diisi")
    .test("is-number", "Jumlah harus berupa angka yang valid", (value) => {
      return value ? !isNaN(Number(value)) : false;
    })
    .test("is-positive", "Jumlah harus lebih dari 0", (value) => {
      return value ? Number(value) > 0 : false;
    }),
  unit: Yup.string().required("Satuan harus diisi"),
});