"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useRegister from "@/hooks/api/auth/useRegister";
import { useFormik } from "formik";
import { Eye, EyeOff, Plus } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";

const registerSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username harus memiliki minimal 3 karakter")
    .required("Username wajib diisi"),
  email: Yup.string()
    .email("Email tidak valid")
    .required("Email wajib diisi"),
  password: Yup.string()
    .min(6, "Password harus memiliki minimal 6 karakter")
    .required("Password wajib diisi"),
  nik: Yup.string()
    .matches(/^\d{5}$/, "NIK harus 5 digit angka")
    .required("NIK wajib diisi"),
  role: Yup.string()
    .oneOf(["USER", "MANAGER", "DIROPS", "PROCUREMENT"], "Role tidak valid")
    .required("Role wajib dipilih"),
});

interface RegisterModalProps {
  onSuccess?: () => void;
}

export default function RegisterModal({ onSuccess }: RegisterModalProps) {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: register, isPending } = useRegister();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      nik: "",
      role: "USER",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        await register(values);
        formik.resetForm();
        setOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        // Error handling already managed by the hook
        console.error("Registration error:", error);
      }
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      formik.resetForm();
      setShowPassword(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tambah User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah User Baru</DialogTitle>
          <DialogDescription>
            Daftarkan pengguna baru untuk mengakses sistem procurement
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.username && formik.errors.username && (
                <p className="text-sm text-red-500">{formik.errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-500">{formik.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nik">NIK</Label>
              <Input
                id="nik"
                name="nik"
                type="text"
                placeholder="5 Digit NIK"
                value={formik.values.nik}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.nik && formik.errors.nik && (
                <p className="text-sm text-red-500">{formik.errors.nik}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-red-500">{formik.errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                name="role"
                value={formik.values.role}
                onValueChange={(value) => formik.setFieldValue("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="DIROPS">Dirops</SelectItem>
                  <SelectItem value="PROCUREMENT">Procurement</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.role && formik.errors.role && (
                <p className="text-sm text-red-500">{formik.errors.role}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menambahkan..." : "Tambah User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}