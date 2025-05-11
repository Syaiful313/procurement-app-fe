import * as Yup from "yup";
import YupPassword from "yup-password";

YupPassword(Yup);

export const loginSchema = Yup.object().shape({
  nik: Yup.string()
    .required("NIK wajib diisi")
    .matches(/^\d+$/, "NIK harus berupa angka")
    .min(5, "NIK harus 5 digit"),
  password: Yup.string()
    .required("Password wajib diisi")
    .minLowercase(1, "Password harus memiliki minimal 1 huruf kecil")
    .minUppercase(1, "Password harus memiliki minimal 1 huruf besar")
    .minNumbers(1, "Password harus memiliki minimal 1 angka")
    .minSymbols(1, "Password harus memiliki minimal 1 simbol")
});