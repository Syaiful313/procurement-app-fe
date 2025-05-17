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
import { registerSchema } from "./schemas";

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
        setOpen(false);
        formik.resetForm();
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error("Registration failed:", error);
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
          Tambah Pengguna
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Tambah Pengguna Baru</DialogTitle>
          <DialogDescription>
            Daftarkan pengguna baru untuk mengakses sistem pengadaan
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nama Pengguna</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Nama pengguna"
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
                placeholder="email@contoh.com"
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
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative">
                <Input
                  name="password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
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
              <Label htmlFor="role">Peran</Label>
              <Select
                name="role"
                value={formik.values.role}
                onValueChange={(value) => formik.setFieldValue("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Pengguna</SelectItem>
                  <SelectItem value="MANAGER">Manajer</SelectItem>
                  <SelectItem value="DIROPS">Dirops</SelectItem>
                  <SelectItem value="PROCUREMENT">Pengadaan</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.role && formik.errors.role && (
                <p className="text-sm text-red-500">{formik.errors.role}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Tambah Pengguna"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
