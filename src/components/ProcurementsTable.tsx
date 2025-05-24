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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetProcurements from "@/hooks/api/dashboard-dirops/useGetProcurements";
import {
  DEPARTMENT_MAPPING,
  STATUS_CONFIG,
  TRACKING_STATUS_CONFIG,
} from "@/lib/constants";
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
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ChevronDownIcon, Eye, FilterIcon } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import React, { useState } from "react";

function DraggableRow({
  row,
  isEmptyRow = false,
  columnCount = 7,
}: {
  row: any;
  isEmptyRow?: boolean;
  columnCount?: number;
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: isEmptyRow ? `empty-${Math.random()}` : row.original.id,
    disabled: isEmptyRow,
  });

  return (
    <TableRow
      data-state={
        !isEmptyRow && row.getIsSelected && row.getIsSelected()
          ? "selected"
          : ""
      }
      data-dragging={isDragging}
      ref={isEmptyRow ? undefined : setNodeRef}
      className="relative border-b data-[dragging=true]:z-10 data-[dragging=true]:opacity-90"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {isEmptyRow
        ? Array.from({ length: columnCount }).map((_, index) => (
            <TableCell
              key={`empty-cell-${index}`}
              className="py-2 sm:py-3 px-2 sm:px-4 border-l border-r"
            >
              &nbsp;
            </TableCell>
          ))
        : row.getVisibleCells().map((cell: any) => {
            let cellClass =
              "py-2 sm:py-3 px-2 sm:px-4 border-l border-r";

            if (cell.column.id === "index")
              cellClass += " w-8 sm:w-12 text-xs sm:text-sm text-center";
            else if (cell.column.id === "username")
              cellClass += " w-20 sm:w-32 text-xs sm:text-sm font-medium";
            else if (cell.column.id === "description")
              cellClass +=
                " min-w-[100px] max-w-[150px] sm:max-w-[200px] text-xs sm:text-sm";
            else if (cell.column.id === "department")
              cellClass +=
                " min-w-[80px] max-w-[100px] sm:max-w-[150px] text-xs sm:text-sm";
            else if (cell.column.id === "itemName")
              cellClass +=
                " min-w-[80px] max-w-[120px] sm:max-w-[180px] text-xs sm:text-sm";
            else if (cell.column.id === "specification")
              cellClass +=
                " min-w-[100px] max-w-[150px] sm:max-w-[200px] text-xs sm:text-sm";
            else if (cell.column.id === "quantity")
              cellClass += " w-16 sm:w-24 text-xs sm:text-sm text-center";
            else if (cell.column.id === "unit")
              cellClass += " w-16 sm:w-24 text-xs sm:text-sm text-center";
            else if (cell.column.id === "status")
              cellClass += " w-20 sm:w-32 text-center";
            else if (cell.column.id === "trackingStatus")
              cellClass += " w-20 sm:w-32 text-center";
            else if (cell.column.id === "createdAt")
              cellClass += " w-16 sm:w-32 text-xs sm:text-sm text-center";
            else if (cell.column.id === "actions")
              cellClass += " w-10 sm:w-16 text-center";

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
  const [queryParams, setQueryParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    status: parseAsString.withDefault(""),
    department: parseAsString.withDefault(""),
  });

  const [pageSize] = React.useState(10);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProcurementId, setSelectedProcurementId] = useState<
    number | null
  >(null);

  const {
    data: procurementsData,
    isLoading,
    error,
  } = useGetProcurements({
    page: queryParams.page,
    take: pageSize,
    status: queryParams.status,
    department: queryParams.department,
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
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: isMobile ? "numeric" : "short",
      year: isMobile ? "2-digit" : "numeric",
    });
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
      color: "",
      label: status.replace(/_/g, " "),
    };

    const mobileLabel =
      {
        WAITING_CONFIRMATION: "Menunggu",
        PRIORITAS: "Prioritas Tinggi",
        URGENT: "Prioritas Sedang",
        COMPLEMENT: "Prioritas Rendah",
        REJECTED: "Ditolak",
      }[status] || config.label;

    return (
      <Badge
        variant="outline"
        className={`px-1.5 sm:px-3 py-0.5 sm:py-1 font-medium text-[10px] sm:text-xs whitespace-nowrap ${config.color}`}
      >
        <span className="hidden sm:inline">{config.label}</span>
        <span className="sm:hidden">{mobileLabel}</span>
      </Badge>
    );
  };

  const TrackingStatusBadge = ({ status }: { status: string }) => {
    const config = TRACKING_STATUS_CONFIG[
      status as keyof typeof TRACKING_STATUS_CONFIG
    ] || {
      color: "",
      label: status.replace(/_/g, " "),
    };

    return (
      <Badge
        variant="outline"
        className={`px-1.5 sm:px-3 py-0.5 sm:py-1 font-medium text-[10px] sm:text-xs whitespace-nowrap ${config.color}`}
      >
        <span>{config.label}</span>
      </Badge>
    );
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
        <div className="text-center text-xs font-semibold uppercase tracking-wider">
          No
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center text-xs sm:text-sm">{row.index + 1}</div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "username",
      header: () => (
        <div className="text-left text-xs font-semibold uppercase tracking-wider">
          Nama
        </div>
      ),
      cell: ({ row }) => (
        <div
          className="text-left font-medium text-xs sm:text-sm truncate"
          title={row.original.username}
        >
          {row.original.username}
        </div>
      ),
    },
    {
      accessorKey: "department",
      header: () => (
        <div className="text-left text-xs font-semibold uppercase tracking-wider">
          <span className="hidden sm:inline">Departemen</span>
          <span className="sm:hidden">Dept</span>
        </div>
      ),
      cell: ({ row }) => {
        const departmentKey = row.original
          .department as keyof typeof DEPARTMENT_MAPPING;
        const displayDepartment =
          DEPARTMENT_MAPPING[departmentKey] || row.original.department;

        return (
          <div
            className="text-left text-xs sm:text-sm truncate"
            title={displayDepartment}
          >
            {displayDepartment}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="text-center text-xs font-semibold uppercase tracking-wider">
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
      accessorKey: "trackingStatus",
      header: () => (
        <div className="text-center text-xs font-semibold uppercase tracking-wider">
          <span className="hidden sm:inline">Tracking</span>
          <span className="sm:hidden">Track</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <TrackingStatusBadge status={row.original.trackingStatus} />
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <div className="text-center text-xs font-semibold uppercase tracking-wider">
          <span className="hidden sm:inline">Tanggal</span>
          <span className="sm:hidden">Tgl</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center text-[10px] sm:text-sm">
          {formatDate(row.original.date)}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="text-center text-xs font-semibold uppercase tracking-wider">
          <span className="sr-only">Aksi</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded-full h-6 w-6 sm:h-8 sm:w-8"
            size="icon"
            onClick={() => handleViewDetails(row.original.id)}
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="sr-only">Lihat detail</span>
          </Button>
        </div>
      ),
      enableHiding: false,
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

  const handleStatusFilterChange = (status: string) => {
    setQueryParams({
      status,
      page: 1,
    });
  };

  const handleDepartmentFilterChange = (department: string) => {
    setQueryParams({
      department,
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    setQueryParams({ page: newPage });
  };

  const renderEmptyRows = (count: number) => {
    return Array.from({ length: count }).map((_, index) => {
      const emptyRow = {
        id: `empty-${index}`,
        getVisibleCells: () => [],
      };

      return (
        <DraggableRow
          key={`empty-row-${index}`}
          row={emptyRow}
          isEmptyRow={true}
          columnCount={columns.length}
        />
      );
    });
  };

  return (
    <>
      <div className="space-y-3 sm:space-y-4 max-w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-2 sm:gap-3">
          <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center text-xs sm:text-sm h-9 px-2 sm:px-3 w-full sm:w-auto"
                >
                  <FilterIcon className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1.5" />
                  <span className="ml-1.5 truncate max-w-[80px] sm:max-w-none">
                    {queryParams.status
                      ? STATUS_CONFIG[
                          queryParams.status as keyof typeof STATUS_CONFIG
                        ]?.label || queryParams.status.replace(/_/g, " ")
                      : "Status"}
                  </span>
                  <ChevronDownIcon className="ml-1 h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => handleStatusFilterChange("")}
                  className="cursor-pointer text-sm"
                >
                  Semua Status
                </DropdownMenuItem>
                {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => handleStatusFilterChange(status)}
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
                  className="flex items-center justify-center text-xs sm:text-sm h-9 px-2 sm:px-3 w-full sm:w-auto"
                >
                  <FilterIcon className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1.5" />
                  <span className="ml-1.5 truncate max-w-[80px] sm:max-w-none">
                    {queryParams.department
                      ? DEPARTMENT_MAPPING[
                          queryParams.department as keyof typeof DEPARTMENT_MAPPING
                        ] || queryParams.department.replace(/_/g, " ")
                      : "Dept"}
                  </span>
                  <ChevronDownIcon className="ml-1 h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => handleDepartmentFilterChange("")}
                  className="cursor-pointer text-sm"
                >
                  Semua Departemen
                </DropdownMenuItem>
                {Object.entries(DEPARTMENT_MAPPING).map(([key, label]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => handleDepartmentFilterChange(key)}
                    className="flex items-center cursor-pointer text-sm"
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center text-xs sm:text-sm h-9 px-2 sm:px-3 col-span-2 sm:col-span-1 w-full sm:w-auto"
                >
                  <span>Kolom</span>
                  <ChevronDownIcon className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
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
                      {column.id === "index"
                        ? "No."
                        : column.id === "username"
                        ? "Nama"
                        : column.id === "description"
                        ? "Keterangan"
                        : column.id === "department"
                        ? "Departemen"
                        : column.id === "itemName"
                        ? "Nama Barang"
                        : column.id === "specification"
                        ? "Spesifikasi"
                        : column.id === "quantity"
                        ? "Jumlah"
                        : column.id === "unit"
                        ? "Satuan"
                        : column.id === "status"
                        ? "Status"
                        : column.id === "trackingStatus"
                        ? "Tracking"
                        : column.id === "createdAt"
                        ? "Tanggal"
                        : column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-lg border shadow-sm overflow-hidden w-full">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <div className="w-full overflow-x-auto">
              <Table className="w-full min-w-[650px]">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-b"
                    >
                      {headerGroup.headers.map((header) => {
                        let headerClass =
                          "h-8 sm:h-10 px-2 sm:px-4 border-l border-r";

                        if (header.id === "index")
                          headerClass += " w-8 sm:w-12";
                        else if (header.id === "username")
                          headerClass += " w-20 sm:w-32";
                        else if (header.id === "description")
                          headerClass += " w-auto";
                        else if (header.id === "department")
                          headerClass += " w-20 sm:w-40";
                        else if (header.id === "itemName")
                          headerClass += " w-20 sm:w-40";
                        else if (header.id === "specification")
                          headerClass += " w-24 sm:w-48";
                        else if (header.id === "quantity")
                          headerClass += " w-16 sm:w-24";
                        else if (header.id === "unit")
                          headerClass += " w-16 sm:w-24";
                        else if (header.id === "status")
                          headerClass += " w-20 sm:w-32";
                        else if (header.id === "trackingStatus")
                          headerClass += " w-20 sm:w-32";
                        else if (header.id === "createdAt")
                          headerClass += " w-16 sm:w-32";
                        else if (header.id === "actions")
                          headerClass += " w-10 sm:w-16";

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
                        className="h-24 text-center border-l border-r"
                      >
                        <div className="flex justify-center items-center">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-t-blue-500 rounded-full animate-spin"></div>
                          <span className="ml-2 text-xs sm:text-sm">
                            Memuat pengadaan...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-red-500 border-l border-r"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-sm">
                            Kesalahan memuat pengadaan
                          </span>
                          <span className="text-xs sm:text-sm text-red-400">
                            {error.message}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows?.length ? (
                        <>
                          {table.getRowModel().rows.map((row) => (
                            <DraggableRow key={row.id} row={row} />
                          ))}
                          {/* Tambahkan baris kosong jika jumlah data kurang dari 8 */}
                          {table.getRowModel().rows.length < 8 &&
                            renderEmptyRows(
                              8 - table.getRowModel().rows.length
                            )}
                        </>
                      ) : (
                        renderEmptyRows(8)
                      )}
                    </SortableContext>
                  )}
                </TableBody>
              </Table>
            </div>
          </DndContext>

          {procurementsData?.meta && (
            <div className="border-t py-2 sm:py-3 px-3 sm:px-4">
              <PaginationSection
                page={procurementsData.meta.page}
                take={procurementsData.meta.take}
                total={procurementsData.meta.total}
                onChangePage={handlePageChange}
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