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
import useLogin from "@/hooks/api/auth/useLogin";
import { useFormik } from "formik";
import { Package } from "lucide-react";
import Link from "next/link";
import { loginSchema } from "./schemas";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { mutateAsync: login, isPending } = useLogin();

  const formik = useFormik({
    initialValues: {
      nik: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      await login(values);
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 flex items-center gap-2 text-center sm:mb-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-md sm:h-10 sm:w-10">
            <Package className="h-5 w-5 text-white sm:h-6 sm:w-6" />
          </div>
          <h1 className="text-xl font-bold sm:text-2xl">Sabar App</h1>
        </Link>
      </div>

      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="space-y-1 pb-4 sm:pb-6">
          <CardTitle className="text-center text-xl font-bold sm:text-2xl">
            Login
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Masukkan NIK dan password untuk mengakses sistem
          </CardDescription>
        </CardHeader>
        <form onSubmit={formik.handleSubmit}>
          <CardContent className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nik" className="text-sm sm:text-base">
                NIK
              </Label>
              <Input
                name="nik"
                id="nik"
                type="text"
                placeholder="Masukkan NIK"
                value={formik.values.nik}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                className="h-10 sm:h-11"
              />
              {!!formik.touched.nik && !!formik.errors.nik && (
                <p className="text-xs text-red-500">{formik.errors.nik}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm sm:text-base">
                  Kata Sandi
                </Label>
              </div>
              <div className="relative">
                <Input
                  name="password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi anda"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  className="h-10 pr-10 sm:h-11"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 focus:outline-none"
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
          </CardContent>
          <CardFooter className="flex flex-col pb-6 pt-4 sm:pb-8">
            <Button
              type="submit"
              className="h-10 w-full sm:h-11"
              disabled={isPending}
            >
              {isPending ? "Loading..." : "Masuk ke Sistem"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-8 text-center text-xs sm:text-sm">
        &copy; {new Date().getFullYear()} Procurement App. All rights reserved.
      </div>
    </div>
  );
}