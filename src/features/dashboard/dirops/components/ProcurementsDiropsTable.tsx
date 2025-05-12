"use client";
import ModalDetailSection from "@/components/DetailModalSection";
import PaginationSection from "@/components/PaginationSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetProcurements from "@/hooks/api/dashboard-dirops/useGetProcurements";
import useUpdateProcurementStatus from "@/hooks/api/dashboard-dirops/useUpdateProcurementStatus";
import { Procurement, ProcurementStatus } from "@/types/procurement";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDownIcon,
  Clock,
  ColumnsIcon,
  Eye,
  FilterIcon,
  MoreVerticalIcon,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { useDebounceValue } from "usehooks-ts";

const STATUS_CONFIG = {
  WAITING_CONFIRMATION: {
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    label: "Menunggu Konfirmasi",
  },
  PRIORITAS: {
    color: "bg-orange-50 text-orange-700 border-orange-200",
    label: "Prioritas",
  },
  URGENT: {
    color: "bg-red-50 text-red-700 border-red-200",
    label: "Mendesak",
  },
  COMPLEMENT: {
    color: "bg-green-50 text-green-700 border-green-200",
    label: "Melengkapi",
  },
  REJECTED: {
    color: "bg-gray-50 text-gray-700 border-gray-200",
    label: "Ditolak",
  },
};

function DraggableRow({ row }: { row: Row<Procurement> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => {
        let cellClass = "py-3 sm:py-2.5 px-2 sm:px-4";

        if (cell.column.id === "index")
          cellClass += " w-10 sm:w-12 text-sm sm:text-sm text-center";
        else if (cell.column.id === "username")
          cellClass += " min-w-[80px] sm:w-28 text-sm sm:text-sm font-medium";
        else if (cell.column.id === "description")
          cellClass += " min-w-[120px] sm:w-auto text-sm sm:text-sm";
        else if (cell.column.id === "status")
          cellClass += " min-w-[80px] sm:w-36 text-center";
        else if (cell.column.id === "createdAt")
          cellClass += " min-w-[80px] sm:w-40 text-sm sm:text-sm text-center";
        else if (cell.column.id === "actions")
          cellClass += " w-16 sm:w-24 text-center";

        return (
          <TableCell key={cell.id} className={cellClass}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

export function ProcurementsDiropsTable() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch] = useDebounceValue(searchQuery, 500);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProcurementId, setSelectedProcurementId] = useState<
    number | null
  >(null);
  const updateProcurementStatus = useUpdateProcurementStatus();
  const {
    data: procurementsData,
    isLoading,
    error,
  } = useGetProcurements({
    page: currentPage,
    take: pageSize,
    search: debouncedSearch,
    status: statusFilter,
  });

  const [data, setData] = React.useState<Procurement[]>([]);

  React.useEffect(() => {
    if (procurementsData?.data) {
      setData(procurementsData.data);
    }
  }, [procurementsData]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    const isMobile = window.innerWidth < 640;

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: isMobile ? "numeric" : "short",
      year: isMobile ? "2-digit" : "numeric",
    };

    try {
      return date.toLocaleDateString("id-ID", options);
    } catch (error) {
      return date.toLocaleDateString("id-ID", options);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
      color: "bg-gray-50 text-gray-600 border-gray-200",
      label: status.replace(/_/g, " "),
    };

    const mobileLabel =
      {
        WAITING_CONFIRMATION: "Menunggu",
        PRIORITAS: "Prioritas",
        URGENT: "Mendesak",
        COMPLEMENT: "Melengkapi",
        REJECTED: "Ditolak",
      }[status] || config.label;

    return (
      <Badge
        variant="outline"
        className={`px-2 sm:px-2 py-1 sm:py-0.5 text-xs sm:text-xs whitespace-nowrap font-medium ${config.color}`}
      >
        <span className="hidden sm:inline">{config.label}</span>
        <span className="sm:hidden">{mobileLabel}</span>
      </Badge>
    );
  };

  const handleStatusChange = (id: number, status: ProcurementStatus) => {
    updateProcurementStatus.mutate({ id, status });
  };

  const handleViewDetails = (id: number) => {
    setSelectedProcurementId(id);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedProcurementId(null);
  };

  const columns: ColumnDef<Procurement>[] = [
    {
      accessorKey: "index",
      header: () => (
        <div className="text-center text-xs sm:text-xs font-semibold uppercase tracking-wider">
          No
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center text-sm sm:text-sm">{row.index + 1}</div>
      ),
    },
    {
      accessorKey: "username",
      header: () => (
        <div className="text-left text-xs sm:text-xs font-semibold uppercase tracking-wider">
          Nama
        </div>
      ),
      cell: ({ row }) => (
        <div
          className="text-left font-medium text-sm sm:text-sm truncate"
          title={row.original.username}
        >
          {row.original.username}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: () => (
        <div className="text-left text-xs sm:text-xs font-semibold uppercase tracking-wider">
          <span>Keterangan</span>
        </div>
      ),
      cell: ({ row }) => (
        <div
          className="text-muted-foreground text-left text-sm sm:text-sm truncate"
          style={{ maxWidth: "120px" }}
          title={row.original.description}
        >
          {row.original.description}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="text-center text-xs sm:text-xs font-semibold uppercase tracking-wider">
          Status
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <StatusBadge status={row.original.status} />
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <div className="text-center text-xs sm:text-xs font-semibold uppercase tracking-wider">
          <span>Tanggal</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground text-center text-sm sm:text-sm">
          {formatDate(row.original.createdAt)}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="text-center text-xs sm:text-xs font-semibold uppercase tracking-wider">
          Aksi
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-muted-foreground data-[state=open]:bg-muted flex h-8 w-8 sm:h-8 sm:w-8"
                size="icon"
                disabled={updateProcurementStatus.isPending}
              >
                <MoreVerticalIcon className="h-4 w-4 sm:h-4 sm:w-4" />
                <span className="sr-only">Buka menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-sm"
                onClick={() => handleViewDetails(row.original.id)}
              >
                <Eye className="h-4 w-4" /> Lihat Detail
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-sm">
                Perbarui Status
              </DropdownMenuLabel>

              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-sm"
                onClick={() =>
                  handleStatusChange(row.original.id, "WAITING_CONFIRMATION")
                }
                disabled={
                  row.original.status === "WAITING_CONFIRMATION" ||
                  updateProcurementStatus.isPending
                }
              >
                <Clock className="h-4 w-4 text-yellow-600" />
                Menunggu Konfirmasi
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-sm"
                onClick={() => handleStatusChange(row.original.id, "PRIORITAS")}
                disabled={
                  row.original.status === "PRIORITAS" ||
                  updateProcurementStatus.isPending
                }
              >
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                Prioritas
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-sm"
                onClick={() => handleStatusChange(row.original.id, "URGENT")}
                disabled={
                  row.original.status === "URGENT" ||
                  updateProcurementStatus.isPending
                }
              >
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Mendesak
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-sm"
                onClick={() =>
                  handleStatusChange(row.original.id, "COMPLEMENT")
                }
                disabled={
                  row.original.status === "COMPLEMENT" ||
                  updateProcurementStatus.isPending
                }
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Melengkapi
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-sm"
                onClick={() => handleStatusChange(row.original.id, "REJECTED")}
                disabled={
                  row.original.status === "REJECTED" ||
                  updateProcurementStatus.isPending
                }
              >
                <XCircle className="h-4 w-4 text-gray-600" />
                Ditolak
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  );

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      columnVisibility,
      rowSelection,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:gap-4">
        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
          <Input
            placeholder="Cari pengadaan..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full md:max-w-md text-sm h-10"
          />
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm md:text-sm h-10 sm:h-9 px-3 sm:px-3"
                >
                  <FilterIcon className="h-4 w-4 mr-1.5" />
                  <span>Filter Status</span>
                  {statusFilter && (
                    <span className="ml-1.5 text-xs truncate max-w-[80px] sm:max-w-none">
                      (
                      {STATUS_CONFIG[statusFilter as keyof typeof STATUS_CONFIG]
                        ?.label || statusFilter}
                      )
                    </span>
                  )}
                  <ChevronDownIcon className="ml-1.5 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() => handleStatusFilterChange("")}
                  className="cursor-pointer text-sm"
                >
                  Semua
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleStatusFilterChange("WAITING_CONFIRMATION")
                  }
                  className="cursor-pointer text-sm"
                >
                  Menunggu Konfirmasi
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusFilterChange("PRIORITAS")}
                  className="cursor-pointer text-sm"
                >
                  Prioritas
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusFilterChange("URGENT")}
                  className="cursor-pointer text-sm"
                >
                  Mendesak
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusFilterChange("COMPLEMENT")}
                  className="cursor-pointer text-sm"
                >
                  Melengkapi
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusFilterChange("REJECTED")}
                  className="cursor-pointer text-sm"
                >
                  Ditolak
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm md:text-sm h-10 sm:h-9 px-3 sm:px-3"
                >
                  <ColumnsIcon className="mr-1.5 h-4 w-4" />
                  <span>Kolom</span>
                  <ChevronDownIcon className="ml-1.5 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => {
                    const labels: Record<string, string> = {
                      index: "No.",
                      username: "Nama",
                      description: "Keterangan",
                      status: "Status",
                      createdAt: "Tanggal",
                    };

                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize cursor-pointer text-sm"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {labels[column.id] || column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <div
              className="w-full overflow-x-auto"
              style={{ minHeight: "400px" }}
            >
              <Table className="w-full min-w-[540px]">
                <TableHeader className="bg-gray-100">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        let headerClass =
                          "h-10 sm:h-12 px-2 sm:px-4 font-semibold whitespace-nowrap text-gray-700";

                        if (header.id === "index")
                          headerClass += " w-10 sm:w-12";
                        else if (header.id === "username")
                          headerClass += " min-w-[80px] sm:w-28";
                        else if (header.id === "description")
                          headerClass += " min-w-[120px] sm:w-auto";
                        else if (header.id === "status")
                          headerClass += " min-w-[80px] sm:w-36";
                        else if (header.id === "createdAt")
                          headerClass += " min-w-[80px] sm:w-40";
                        else if (header.id === "actions")
                          headerClass += " w-16 sm:w-24";

                        return (
                          <TableHead
                            key={header.id}
                            colSpan={header.colSpan}
                            className={headerClass}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        <div className="flex justify-center items-center">
                          <div className="w-6 h-6 sm:w-6 sm:h-6 border-2 border-t-blue-500 rounded-full animate-spin"></div>
                          <span className="ml-2 text-sm sm:text-sm text-gray-500">
                            Memuat pengadaan...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-red-500"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-sm">
                            Kesalahan memuat pengadaan
                          </span>
                          <span className="text-sm sm:text-sm text-red-400">
                            {error.message}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : updateProcurementStatus.isPending ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        <div className="flex justify-center items-center">
                          <div className="w-6 h-6 sm:w-6 sm:h-6 border-2 border-t-blue-500 rounded-full animate-spin"></div>
                          <span className="ml-2 text-sm sm:text-sm text-gray-500">
                            Memperbarui status pengadaan...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows?.length ? (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        <span className="text-sm">
                          Tidak ada pengadaan ditemukan. Coba pencarian lain.
                        </span>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </DndContext>

          {procurementsData && procurementsData.meta && (
            <div className="border-t p-3 sm:p-4">
              <PaginationSection
                page={procurementsData.meta.page}
                take={procurementsData.meta.take}
                total={procurementsData.meta.total}
                onChangePage={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      {selectedProcurementId && (
        <ModalDetailSection
          procurementId={selectedProcurementId}
          isOpen={detailModalOpen}
          onClose={handleCloseDetailModal}
        />
      )}
    </>
  );
}
