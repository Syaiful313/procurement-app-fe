"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormik } from "formik";
import { useState } from "react";
import useCreateProcurement from "@/hooks/api/dashboard-user/useCreateprocurement";
import { CreateProcurementSchema } from "./schemas";

const ProcurementForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createProcurement = useCreateProcurement();

  const formik = useFormik({
    initialValues: {
      username: "",
      description: "",
    },
    validationSchema: CreateProcurementSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await createProcurement.mutate({
          username: values.username,
          description: values.description,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form
      className="mx-auto mt-10 mb-20 max-w-2xl space-y-8 rounded-xl bg-white p-8 shadow-lg dark:bg-zinc-900"
      onSubmit={formik.handleSubmit}
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Pengadaan Barang
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Ajukan dan lihat riwayat permintaan pengadaan barang.
        </p>
      </div>

      <div className="space-y-6">
        {/* Field Nama */}
        <div className="grid gap-3">
          <Label htmlFor="username" className="font-medium">
            Name
          </Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Masukkan nama"
            value={formik.values.username}
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full"
            disabled={isSubmitting}
          />
          {!!formik.touched.username && !!formik.errors.username && (
            <p className="text-destructive text-sm">{formik.errors.username}</p>
          )}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="description" className="font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Masukkan deskripsi"
            value={formik.values.description}
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="min-h-[120px] resize-none w-full"
            disabled={isSubmitting}
          />
          {!!formik.touched.description && !!formik.errors.description && (
            <p className="text-destructive text-sm">
              {formik.errors.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none dark:text-gray-300 dark:hover:text-gray-100"
            onClick={() => formik.resetForm()}
            disabled={isSubmitting}
          >
            Batal
          </button>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting || createProcurement.isPending}
          >
            {isSubmitting || createProcurement.isPending
              ? "Mengirim..."
              : "Ajukan Permintaan"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProcurementForm;
