import * as Yup from "yup";

export const CreateProcurementSchema = Yup.object().shape({
  username: Yup.string().required("Nama harus diisi"),
  description: Yup.string().required("Deskripsi harus diisi"),
});
