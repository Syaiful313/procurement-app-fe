"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useFormik } from "formik";
import { useState } from "react";
import useCreateProcurement from "@/hooks/api/dashboard-user/useCreateprocurement";
import { CreateProcurementSchema } from "./schemas";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ProcurementItem {
  itemName: string;
  specification: string;
  quantity: string;
  unit: string;
  description: string; // Tambahkan description per item
}

const ProcurementForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createProcurement = useCreateProcurement();

  const formik = useFormik({
    initialValues: {
      username: "",
      date: new Date(),
      department: "" as "" | "PURCHASE" | "FACTORY" | "OFFICE",
      items: [
        {
          itemName: "",
          specification: "",
          quantity: "",
          unit: "",
          description: "", // Tambahkan description di initial value
        },
      ] as ProcurementItem[],
    },
    validationSchema: CreateProcurementSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await createProcurement.mutate({
          username: values.username,
          date: values.date,
          department: values.department as "PURCHASE" | "FACTORY" | "OFFICE",
          items: values.items.map((item) => ({
            itemName: item.itemName,
            specification: item.specification,
            quantity: Number(item.quantity),
            unit: item.unit,
            description: item.description, // Tambahkan description per item
          })),
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const addItem = () => {
    formik.setFieldValue("items", [
      ...formik.values.items,
      {
        itemName: "",
        specification: "",
        quantity: "",
        unit: "",
        description: "", // Tambahkan description saat add item
      },
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = [...formik.values.items];
    newItems.splice(index, 1);
    formik.setFieldValue("items", newItems);
  };

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

        {/* Items Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-medium">Daftar Barang</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Tambah Barang
            </Button>
          </div>

          {formik.values.items.map((item, index) => (
            <div
              key={index}
              className="space-y-4 rounded-lg border p-4 relative"
            >
              {formik.values.items.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="absolute right-2 top-2"
                  disabled={isSubmitting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}

              <div className="font-medium text-sm">
                Barang {index + 1}
              </div>

              <div className="grid gap-3">
                <Label htmlFor={`items.${index}.itemName`} className="font-medium">
                  Nama Barang
                </Label>
                <Input
                  id={`items.${index}.itemName`}
                  name={`items.${index}.itemName`}
                  type="text"
                  placeholder="Masukkan nama barang"
                  value={item.itemName}
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full"
                  disabled={isSubmitting}
                />
                {formik.touched.items?.[index]?.itemName &&
                  typeof formik.errors.items?.[index] === "object" &&
                  formik.errors.items?.[index] !== null &&
                  "itemName" in formik.errors.items[index] && (
                    <p className="text-destructive text-sm">
                      {
                        (formik.errors.items[index] as { itemName?: string })
                          .itemName
                      }
                    </p>
                  )}
              </div>

              <div className="grid gap-3">
                <Label
                  htmlFor={`items.${index}.specification`}
                  className="font-medium"
                >
                  Spesifikasi
                </Label>
                <Textarea
                  id={`items.${index}.specification`}
                  name={`items.${index}.specification`}
                  placeholder="Masukkan spesifikasi barang"
                  value={item.specification}
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="min-h-[80px] resize-none w-full"
                  disabled={isSubmitting}
                />
                {formik.touched.items?.[index]?.specification &&
                  typeof formik.errors.items?.[index] === "object" &&
                  formik.errors.items?.[index] !== null &&
                  "specification" in formik.errors.items[index] && (
                    <p className="text-destructive text-sm">
                      {
                        (formik.errors.items[index] as { specification?: string })
                          .specification
                      }
                    </p>
                  )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label
                    htmlFor={`items.${index}.quantity`}
                    className="font-medium"
                  >
                    Jumlah
                  </Label>
                  <Input
                    id={`items.${index}.quantity`}
                    name={`items.${index}.quantity`}
                    type="number"
                    placeholder="Masukkan jumlah"
                    value={item.quantity}
                    required
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full"
                    disabled={isSubmitting}
                  />
                  {formik.touched.items?.[index]?.quantity &&
                    typeof formik.errors.items?.[index] === "object" &&
                    formik.errors.items?.[index] !== null &&
                    "quantity" in formik.errors.items[index] &&
                    (
                      <p className="text-destructive text-sm">
                        {
                          (formik.errors.items[index] as { quantity?: string })
                            .quantity
                        }
                      </p>
                    )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor={`items.${index}.unit`} className="font-medium">
                    Satuan
                  </Label>
                  <Input
                    id={`items.${index}.unit`}
                    name={`items.${index}.unit`}
                    type="text"
                    placeholder="Masukkan satuan (pcs, kg, dll)"
                    value={item.unit}
                    required
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full"
                    disabled={isSubmitting}
                  />
                  {formik.touched.items?.[index]?.unit &&
                    typeof formik.errors.items?.[index] === "object" &&
                    formik.errors.items?.[index] !== null &&
                    "unit" in formik.errors.items[index] && (
                      <p className="text-destructive text-sm">
                        {
                          (formik.errors.items[index] as { unit?: string })
                            .unit
                        }
                      </p>
                    )}
                </div>
              </div>

              {/* Tambahkan field description per item */}
              <div className="grid gap-3">
                <Label
                  htmlFor={`items.${index}.description`}
                  className="font-medium"
                >
                  Keterangan Barang
                </Label>
                <Textarea
                  id={`items.${index}.description`}
                  name={`items.${index}.description`}
                  placeholder="Masukkan keterangan barang"
                  value={item.description}
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="min-h-[80px] resize-none w-full"
                  disabled={isSubmitting}
                />
                {formik.touched.items?.[index]?.description &&
                  typeof formik.errors.items?.[index] === "object" &&
                  formik.errors.items?.[index] !== null &&
                  "description" in formik.errors.items[index] && (
                    <p className="text-destructive text-sm">
                      {
                        (formik.errors.items[index] as { description?: string })
                          .description
                      }
                    </p>
                  )}
              </div>
            </div>
          ))}
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