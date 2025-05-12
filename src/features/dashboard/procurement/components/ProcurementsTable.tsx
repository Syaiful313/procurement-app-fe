"use client";
import PaginationSection from "@/components/PaginationSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Procurement } from "@/types/procurement";
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
import { ChevronDownIcon, FilterIcon, Eye } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";
import ModalDetailSectionProcurement from "./ModalDetailProcurementSection";

const STATUS_CONFIG = {
  WAITING_CONFIRMATION: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Menunggu Konfirmasi",
  },
  PRIORITAS: {
    color: "bg-orange-50 text-orange-700 border-orange-200",
    label: "Prioritas",
  },
  URGENT: { 
    color: "bg-red-50 text-red-700 border-red-200", 
    label: "Mendesak" 
  },
  COMPLEMENT: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
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
      className="relative border-b hover:bg-slate-50 data-[dragging=true]:z-10 data-[dragging=true]:bg-slate-100 data-[dragging=true]:opacity-90"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => {
        let cellClass = "py-3 sm:py-3 px-2 sm:px-4";

        if (cell.column.id === "index") 
          cellClass += " w-10 sm:w-16 text-sm sm:text-sm text-center";
        else if (cell.column.id === "username") 
          cellClass += " min-w-[80px] sm:w-32 text-sm sm:text-sm font-medium";
        else if (cell.column.id === "description") 
          cellClass += " min-w-[120px] sm:w-auto text-sm sm:text-sm";
        else if (cell.column.id === "status") 
          cellClass += " min-w-[80px] sm:w-40 text-center";
        else if (cell.column.id === "createdAt") 
          cellClass += " min-w-[80px] sm:w-40 text-sm sm:text-sm text-center";
        else if (cell.column.id === "actions") 
          cellClass += " w-12 sm:w-24 text-center";

        return (
          <TableCell key={cell.id} className={cellClass}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

export function ProcurementsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounceValue(searchQuery, 400);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProcurementId, setSelectedProcurementId] = useState<
    number | null
  >(null);

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

  const [data, setData] = useState<Procurement[]>([]);

  useEffect(() => {
    if (procurementsData?.data) {
      setData(procurementsData.data);
    }
  }, [procurementsData]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const isMobile = window.innerWidth < 640;
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: isMobile ? "numeric" : "short",
      year: isMobile ? "2-digit" : "numeric",
    });
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
      color: "bg-gray-50 text-gray-600 border-gray-200",
      label: status.replace(/_/g, " "),
    };

    const mobileLabel = {
      WAITING_CONFIRMATION: "Menunggu",
      PRIORITAS: "Prioritas",
      URGENT: "Mendesak",
      COMPLEMENT: "Melengkapi",
      REJECTED: "Ditolak",
    }[status] || config.label;

    return (
      <Badge
        variant="outline"
        className={`px-2 sm:px-3 py-1 sm:py-1 font-medium text-xs sm:text-xs whitespace-nowrap ${config.color}`}
      >
        <span className="hidden sm:inline">{config.label}</span>
        <span className="sm:hidden">{mobileLabel}</span>
      </Badge>
    );
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
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: "username",
      header: () => (
        <div className="text-left text-xs sm:text-xs font-semibold uppercase tracking-wider">
          Nama
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-left font-medium text-sm sm:text-sm truncate" title={row.original.username}>
          {row.original.username}
        </div>
      ),
      size: 120,
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
          className="text-left text-sm sm:text-sm text-gray-600 truncate"
          style={{ maxWidth: '120px' }}
          title={row.original.description}
        >
          {row.original.description}
        </div>
      ),
      size: 200,
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
      size: 100,
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <div className="text-center text-xs sm:text-xs font-semibold uppercase tracking-wider">
          <span>Tanggal</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center text-sm sm:text-sm text-gray-600">
          {formatDate(row.original.createdAt)}
        </div>
      ),
      size: 90,
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
          <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 sm:p-1 rounded-full h-8 w-8 sm:h-8 sm:w-8"
            size="icon"
            onClick={() => handleViewDetails(row.original.id)}
          >
            <Eye className="h-4 w-4 sm:h-4 sm:w-4" />
            <span className="sr-only">Lihat detail</span>
          </Button>
        </div>
      ),
      enableHiding: false,
      size: 60,
    },
  ];

  const handleViewDetails = (id: number) => {
    setSelectedProcurementId(id);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedProcurementId(null);
  };

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = useMemo<UniqueIdentifier[]>(
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

  return (
    <div className="space-y-4 sm:space-y-4 max-w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-3">
        <div className="flex-1 max-w-full lg:max-w-md">
          <Input
            placeholder="Cari pengadaan..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-sm h-10"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center text-sm md:text-sm h-10 sm:h-9 px-3 sm:px-3"
              >
                <FilterIcon className="h-4 w-4 mr-1.5" />
                <span className="truncate">
                  {statusFilter
                    ? STATUS_CONFIG[statusFilter as keyof typeof STATUS_CONFIG]
                        ?.label || statusFilter.replace(/_/g, " ")
                    : "Status"}
                </span>
                <ChevronDownIcon className="ml-1.5 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => {
                  setStatusFilter("");
                  setCurrentPage(1);
                }}
                className="cursor-pointer text-sm"
              >
                Semua Status
              </DropdownMenuItem>
              {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className="flex items-center cursor-pointer text-sm"
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      config.color.split(" ")[1]
                    }`}
                  ></div>
                  {config.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-sm md:text-sm h-10 sm:h-9 px-3 sm:px-3"
              >
                <span>Kolom</span>
                <ChevronDownIcon className="ml-1.5 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize cursor-pointer text-sm"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id === "index" ? "No." : 
                     column.id === "username" ? "Nama" :
                     column.id === "description" ? "Keterangan" :
                     column.id === "status" ? "Status" :
                     column.id === "createdAt" ? "Tanggal" :
                     column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white w-full">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <div className="w-full overflow-x-auto" style={{ minHeight: "400px" }}>
            <Table className="w-full min-w-[540px] table-fixed">
              <TableHeader className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-b border-gray-200"
                  >
                    {headerGroup.headers.map((header) => {
                      let headerClass = "h-10 sm:h-10 px-2 sm:px-4 text-gray-700";
                      
                      if (header.id === "index") headerClass += " w-10 sm:w-16";
                      else if (header.id === "username") headerClass += " min-w-[80px] sm:w-32";
                      else if (header.id === "description") headerClass += " min-w-[120px] sm:w-auto";
                      else if (header.id === "status") headerClass += " min-w-[80px] sm:w-40";
                      else if (header.id === "createdAt") headerClass += " min-w-[80px] sm:w-40";
                      else if (header.id === "actions") headerClass += " w-12 sm:w-24";

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
                        <span className="ml-2 text-sm sm:text-sm text-gray-500">Memuat...</span>
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
                        <span className="text-sm">Kesalahan memuat data</span>
                        <span className="text-sm sm:text-sm text-red-400">
                          {error.message}
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
                      className="h-24 text-center text-gray-500"
                    >
                      <span className="text-sm">
                        Tidak ada data pengadaan ditemukan
                      </span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DndContext>

        {procurementsData?.meta && (
          <div className="border-t border-gray-200 bg-gray-50 py-3 sm:py-3 px-3 sm:px-4">
            <PaginationSection
              page={procurementsData.meta.page}
              take={procurementsData.meta.take}
              total={procurementsData.meta.total}
              onChangePage={setCurrentPage}
            />
          </div>
        )}
      </div>

      {selectedProcurementId && (
        <ModalDetailSectionProcurement
          procurementId={selectedProcurementId}
          isOpen={detailModalOpen}
          onClose={handleCloseDetailModal}
        />
      )}
    </div>
  );
}