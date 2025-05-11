"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react";
import Link from "next/link";
import { useFormik } from "formik";
import useRegister from "@/hooks/api/auth/useRegister";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerSchema } from "./schemas";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
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
      await register(values);
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="mb-8 flex items-center gap-2 text-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-md">
            <Package className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Procurement App</h1>
        </Link>
      </div>

      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            Buat Akun
          </CardTitle>
          <CardDescription className="text-center">
            Daftar untuk mengakses sistem procurement dan pelaporan kerusakan
          </CardDescription>
        </CardHeader>
        <form onSubmit={formik.handleSubmit}>
          <CardContent className="space-y-4">
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
                className="h-11"
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
                className="h-11"
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
                className="h-11"
              />
              {formik.touched.nik && formik.errors.nik && (
                <p className="text-sm text-red-500">{formik.errors.nik}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm sm:text-base">
                  Password
                </Label>
              </div>
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
                  className="h-10 pr-10 sm:h-11"
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
              {!!formik.touched.password && !!formik.errors.password && (
                <p className="text-xs text-red-500">{formik.errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                name="role"
                value={formik.values.role}
                onValueChange={(value) => formik.setFieldValue("role", value)}
              >
                <SelectTrigger className="h-11">
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
          </CardContent>

          <CardFooter className="my-4 flex flex-col">
            <Button type="submit" className="h-11 w-full" disabled={isPending}>
              {isPending ? "Mendaftar..." : "Buat Akun"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
