import * as Yup from "yup";
import YupPassword from "yup-password";

YupPassword(Yup);

export const registerSchema = Yup.object().shape({
  email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: Yup.string()
    .required("Password wajib diisi")
    .min(8, "Password minimal 8 karakter")
    .minLowercase(1, "Password harus memiliki minimal 1 huruf kecil")
    .minUppercase(1, "Password harus memiliki minimal 1 huruf besar")
    .minNumbers(1, "Password harus memiliki minimal 1 angka"),
  username: Yup.string().required("Username wajib diisi"),
  nik: Yup.string()
    .required("NIK wajib diisi")
    .matches(/^\d+$/, "NIK harus berupa angka")
    .min(5, "NIK harus 5 digit"),
  role: Yup.string().required("Role wajib diisi")
});