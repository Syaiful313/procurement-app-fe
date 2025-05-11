"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Filter, Package, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProcurementPage() {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const confirmSubmit = async () => {
    setIsLoading(true);
    setShowConfirmDialog(false);

    try {
      
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setItemName("");
      setQuantity("");
      setCategory("");
      setReason("");

      document.getElementById("history-tab")?.click();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const procurementHistory = [
    {
      id: 1,
      itemName: "Laptop Lenovo ThinkPad",
      quantity: 1,
      category: "Elektronik",
      requestDate: "15 Apr 2025",
      status: "APPROVED",
      decisionDate: "16 Apr 2025",
      notes: "Disetujui untuk penggantian laptop lama",
    },
    {
      id: 2,
      itemName: 'iPad Pro 12.9"',
      quantity: 1,
      category: "Elektronik",
      requestDate: "10 Apr 2025",
      status: "REJECTED",
      decisionDate: "12 Apr 2025",
      notes: "Budget tidak mencukupi untuk saat ini",
    },
    {
      id: 3,
      itemName: "Kursi Ergonomis",
      quantity: 1,
      category: "Furnitur",
      requestDate: "17 Apr 2025",
      status: "PENDING",
      decisionDate: "-",
      notes: "-",
    },
  ];

  // Filter history based on search query
  const filteredHistory = procurementHistory.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            Pengadaan Barang
          </h1>
          <p className="text-muted-foreground">
            Ajukan permintaan pengadaan barang baru dan lihat riwayat permintaan
            Anda.
          </p>
        </div>

        <Tabs defaultValue="request" className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="h-11">
              <TabsTrigger value="request" className="text-sm">
                <Package className="mr-2 h-4 w-4" />
                Form Pengadaan
              </TabsTrigger>
              <TabsTrigger value="history" id="history-tab" className="text-sm">
                <Filter className="mr-2 h-4 w-4" />
                Riwayat Pengadaan
              </TabsTrigger>
            </TabsList>

            <div className="relative w-full sm:w-auto">
              <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                placeholder="Cari permintaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full pl-9"
              />
            </div>
          </div>

          <TabsContent value="request" className="mt-6 space-y-6">
            <Card className="border-none shadow-md">
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Plus className="text-primary h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle>Form Permintaan Pengadaan Barang</CardTitle>
                      <CardDescription>
                        Isi form berikut untuk mengajukan permintaan pengadaan
                        barang baru.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="item-name">Nama Barang</Label>
                    <Input
                      id="item-name"
                      placeholder="Masukkan nama barang"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Jumlah</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="Masukkan jumlah"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Kategori</Label>
                      <Select
                        value={category}
                        onValueChange={setCategory}
                        required
                      >
                        <SelectTrigger id="category" className="h-11">
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="elektronik">Elektronik</SelectItem>
                          <SelectItem value="furnitur">Furnitur</SelectItem>
                          <SelectItem value="atk">Alat Tulis Kantor</SelectItem>
                          <SelectItem value="software">Software</SelectItem>
                          <SelectItem value="lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Alasan Pengadaan</Label>
                    <Textarea
                      id="reason"
                      placeholder="Jelaskan alasan pengadaan barang ini"
                      rows={4}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                      className="min-h-[120px] resize-none"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={isLoading} className="gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Mengirim...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" /> Ajukan Permintaan
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6 space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Filter className="text-primary h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle>Riwayat Permintaan Pengadaan</CardTitle>
                    <CardDescription>
                      Daftar permintaan pengadaan barang yang telah Anda ajukan.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-medium">
                          Nama Barang
                        </TableHead>
                        <TableHead className="font-medium">Jumlah</TableHead>
                        <TableHead className="font-medium">Kategori</TableHead>
                        <TableHead className="font-medium">
                          Tanggal Pengajuan
                        </TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <TableHead className="font-medium">
                          Tanggal Keputusan
                        </TableHead>
                        <TableHead className="font-medium">Catatan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHistory.length > 0 ? (
                        filteredHistory.map((item) => (
                          <TableRow key={item.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              {item.itemName}
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.requestDate}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={` ${
                                  item.status === "APPROVED"
                                    ? "bg-green-50 text-green-700 hover:bg-green-50"
                                    : item.status === "REJECTED"
                                      ? "bg-red-50 text-red-700 hover:bg-red-50"
                                      : "bg-amber-50 text-amber-700 hover:bg-amber-50"
                                } `}
                              >
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{item.decisionDate}</TableCell>
                            <TableCell
                              className="max-w-[200px] truncate"
                              title={item.notes}
                            >
                              {item.notes}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            {searchQuery ? (
                              <div className="text-muted-foreground flex flex-col items-center justify-center">
                                <Search className="mb-2 h-8 w-8" />
                                <p>
                                  Tidak ada hasil yang cocok dengan pencarian "
                                  {searchQuery}"
                                </p>
                                <Button
                                  variant="link"
                                  onClick={() => setSearchQuery("")}
                                  className="mt-1"
                                >
                                  Reset pencarian
                                </Button>
                              </div>
                            ) : (
                              <div className="text-muted-foreground flex flex-col items-center justify-center">
                                <Package className="mb-2 h-8 w-8" />
                                <p>Belum ada riwayat permintaan</p>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pengajuan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mengajukan permintaan pengadaan untuk{" "}
              {itemName}? Permintaan yang sudah diajukan tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit}>
              Konfirmasi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
