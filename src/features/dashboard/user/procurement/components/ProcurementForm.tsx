"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useFormik } from "formik";
import { useState } from "react";
import useCreateProcurement from "@/hooks/api/dashboard-user/useCreateprocurement";
import { CreateProcurementSchema } from "./schemas";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const ProcurementForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createProcurement = useCreateProcurement();

  const formik = useFormik({
    initialValues: {
      username: "",
      description: "",
      date: new Date(),
      department: "" as "" | "PURCHASE" | "FACTORY" | "OFFICE",
    },
    validationSchema: CreateProcurementSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await createProcurement.mutate({
          username: values.username,
          description: values.description,
          date: values.date,
          department: values.department as "PURCHASE" | "FACTORY" | "OFFICE",
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
        <div className="grid gap-3">
          <Label htmlFor="username" className="font-medium">
            Nama
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
            Keterangan
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Masukkan keterangan"
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

        <div className="grid gap-3">
          <Label htmlFor="date" className="font-medium">
            Tanggal
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formik.values.date && "text-muted-foreground"
                )}
                type="button"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formik.values.date ? (
                  format(formik.values.date, "PPP")
                ) : (
                  <span>Pilih tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formik.values.date}
                onSelect={(date) => {
                  if (date) {
                    formik.setFieldValue("date", date);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {!!formik.touched.date && !!formik.errors.date && (
            <p className="text-destructive text-sm">
              {formik.errors.date as string}
            </p>
          )}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="department" className="font-medium">
            Department
          </Label>
          <Select
            value={formik.values.department}
            onValueChange={(value) => formik.setFieldValue("department", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PURCHASE">Pembelian</SelectItem>
              <SelectItem value="FACTORY">Pabrik</SelectItem>
              <SelectItem value="OFFICE">Kantor</SelectItem>
            </SelectContent>
          </Select>
          {!!formik.touched.department && !!formik.errors.department && (
            <p className="text-destructive text-sm">
              {formik.errors.department}
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