"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Package, FileWarning, Search, Filter } from "lucide-react"


export default function DashboardHomePage() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [isProcurementModalOpen, setIsProcurementModalOpen] = useState(false)
  const [isDamageReportModalOpen, setIsDamageReportModalOpen] = useState(false)
  const [procurementSearchQuery, setProcurementSearchQuery] = useState("")
  const [damageSearchQuery, setDamageSearchQuery] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

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
  ]

  // Mock damage report history data
  const damageReportHistory = [
    {
      id: 1,
      itemName: "Printer Kantor",
      location: "Ruang Admin",
      damageType: "Tidak Berfungsi",
      reportDate: "16 Apr 2025",
      status: "IN_PROGRESS",
      notes: "Teknisi sedang memperbaiki",
    },
    {
      id: 2,
      itemName: "Keyboard Rusak",
      location: "Meja Kerja",
      damageType: "Tombol Rusak",
      reportDate: "12 Apr 2025",
      status: "FIXED",
      notes: "Sudah diganti dengan yang baru",
    },
    {
      id: 3,
      itemName: "Mouse Tidak Berfungsi",
      location: "Meja Kerja",
      damageType: "Tidak Berfungsi",
      reportDate: "17 Apr 2025",
      status: "REPORTED",
      notes: "-",
    },
  ]

  // Filter procurement history based on search query
  const filteredProcurementHistory = procurementHistory.filter(
    (item) =>
      item.itemName.toLowerCase().includes(procurementSearchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(procurementSearchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(procurementSearchQuery.toLowerCase()),
  )

  // Filter damage history based on search query
  const filteredDamageHistory = damageReportHistory.filter(
    (item) =>
      item.itemName.toLowerCase().includes(damageSearchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(damageSearchQuery.toLowerCase()) ||
      item.damageType.toLowerCase().includes(damageSearchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(damageSearchQuery.toLowerCase()),
  )

  const isUserOrEmployee = user && (user.role === "user" || user.role === "employee")

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Selamat datang di aplikasi Procurement & Damage Reporting.</p>
        </div>

        <Tabs defaultValue="procurement" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <TabsList className="h-11">
              <TabsTrigger value="procurement" className="text-sm">
                <Package className="h-4 w-4 mr-2" />
                Riwayat Pengadaan
              </TabsTrigger>
              <TabsTrigger value="damage" className="text-sm">
                <FileWarning className="h-4 w-4 mr-2" />
                Riwayat Kerusakan
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="procurement" className="space-y-6 mt-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Filter className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Riwayat Permintaan Pengadaan</CardTitle>
                    <CardDescription>Daftar permintaan pengadaan barang yang telah Anda ajukan.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari permintaan..."
                      value={procurementSearchQuery}
                      onChange={(e) => setProcurementSearchQuery(e.target.value)}
                      className="pl-9 h-11 w-full"
                    />
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-medium">Nama Barang</TableHead>
                        <TableHead className="font-medium">Jumlah</TableHead>
                        <TableHead className="font-medium">Kategori</TableHead>
                        <TableHead className="font-medium">Tanggal Pengajuan</TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <TableHead className="font-medium">Tanggal Keputusan</TableHead>
                        <TableHead className="font-medium">Catatan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProcurementHistory.length > 0 ? (
                        filteredProcurementHistory.map((item) => (
                          <TableRow key={item.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{item.itemName}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.requestDate}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`
                                  ${
                                    item.status === "APPROVED"
                                      ? "bg-green-50 text-green-700 hover:bg-green-50"
                                      : item.status === "REJECTED"
                                        ? "bg-red-50 text-red-700 hover:bg-red-50"
                                        : "bg-amber-50 text-amber-700 hover:bg-amber-50"
                                  }
                                `}
                              >
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{item.decisionDate}</TableCell>
                            <TableCell className="max-w-[200px] truncate" title={item.notes}>
                              {item.notes}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            {procurementSearchQuery ? (
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <Search className="h-8 w-8 mb-2" />
                                <p>Tidak ada hasil yang cocok dengan pencarian "{procurementSearchQuery}"</p>
                                <Button variant="link" onClick={() => setProcurementSearchQuery("")} className="mt-1">
                                  Reset pencarian
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <Package className="h-8 w-8 mb-2" />
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

          <TabsContent value="damage" className="space-y-6 mt-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-amber-500/10 p-2">
                    <Filter className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <CardTitle>Riwayat Laporan Kerusakan</CardTitle>
                    <CardDescription>Daftar laporan kerusakan yang telah Anda ajukan.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari laporan..."
                      value={damageSearchQuery}
                      onChange={(e) => setDamageSearchQuery(e.target.value)}
                      className="pl-9 h-11 w-full"
                    />
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-medium">Nama Barang</TableHead>
                        <TableHead className="font-medium">Lokasi</TableHead>
                        <TableHead className="font-medium">Jenis Kerusakan</TableHead>
                        <TableHead className="font-medium">Tanggal Laporan</TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <TableHead className="font-medium">Catatan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDamageHistory.length > 0 ? (
                        filteredDamageHistory.map((item) => (
                          <TableRow key={item.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{item.itemName}</TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>{item.damageType}</TableCell>
                            <TableCell>{item.reportDate}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`
                                  ${
                                    item.status === "FIXED"
                                      ? "bg-green-50 text-green-700 hover:bg-green-50"
                                      : item.status === "IN_PROGRESS"
                                        ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                                        : "bg-amber-50 text-amber-700 hover:bg-amber-50"
                                  }
                                `}
                              >
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate" title={item.notes}>
                              {item.notes}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            {damageSearchQuery ? (
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <Search className="h-8 w-8 mb-2" />
                                <p>Tidak ada hasil yang cocok dengan pencarian "{damageSearchQuery}"</p>
                                <Button variant="link" onClick={() => setDamageSearchQuery("")} className="mt-1">
                                  Reset pencarian
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <FileWarning className="h-8 w-8 mb-2" />
                                <p>Belum ada riwayat laporan</p>
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
    </>


      
  )
}
