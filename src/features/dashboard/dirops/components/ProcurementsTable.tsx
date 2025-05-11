"use client";
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
  MoreVerticalIcon,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import ModalDetailSection from "./DetailModalSection";

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
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function ProcurementsTable() {
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

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };

    try {
      return date.toLocaleDateString("id-ID", options);
    } catch (error) {
      return date.toLocaleDateString("id-ID", options);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "WAITING_CONFIRMATION":
        return { variant: "outline", color: "text-yellow-600" };
      case "PRIORITAS":
        return { variant: "outline", color: "text-orange-600" };
      case "URGENT":
        return { variant: "outline", color: "text-red-600" };
      case "COMPLEMENT":
        return { variant: "outline", color: "text-green-600" };
      case "REJECTED":
        return { variant: "outline", color: "text-gray-600" };
      default:
        return { variant: "outline", color: "text-muted-foreground" };
    }
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
      header: () => <div className="text-center">No.</div>,
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    },
    {
      accessorKey: "username",
      header: () => <div className="text-left">Username</div>,
      cell: ({ row }) => (
        <div className="text-left font-medium">{row.original.username}</div>
      ),
    },
    {
      accessorKey: "description",
      header: () => <div className="text-left">Description</div>,
      cell: ({ row }) => (
        <div className="text-muted-foreground text-left">
          {row.original.description}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => {
        const { variant, color } = getStatusBadgeVariant(row.original.status);
        const displayStatus = row.original.status.replace(/_/g, " ");

        return (
          <div className="flex justify-center">
            <Badge variant={variant as any} className={`${color} px-1.5`}>
              {displayStatus}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">Created At</div>,
      cell: ({ row }) => (
        <div className="text-muted-foreground text-center">
          {formatDate(row.original.createdAt)}
        </div>
      ),
    },

    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-muted-foreground data-[state=open]:bg-muted flex size-8"
                size="icon"
                disabled={updateProcurementStatus.isPending}
              >
                <MoreVerticalIcon className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => handleViewDetails(row.original.id)}
              >
                <Eye className="h-4 w-4" /> View Details
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Update Status</DropdownMenuLabel>

              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() =>
                  handleStatusChange(row.original.id, "WAITING_CONFIRMATION")
                }
                disabled={
                  row.original.status === "WAITING_CONFIRMATION" ||
                  updateProcurementStatus.isPending
                }
              >
                <Clock className="h-4 w-4 text-yellow-600" />
                Waiting Confirmation
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center gap-2"
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
                className="flex items-center gap-2"
                onClick={() => handleStatusChange(row.original.id, "URGENT")}
                disabled={
                  row.original.status === "URGENT" ||
                  updateProcurementStatus.isPending
                }
              >
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Urgent
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() =>
                  handleStatusChange(row.original.id, "COMPLEMENT")
                }
                disabled={
                  row.original.status === "COMPLEMENT" ||
                  updateProcurementStatus.isPending
                }
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Complement
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => handleStatusChange(row.original.id, "REJECTED")}
                disabled={
                  row.original.status === "REJECTED" ||
                  updateProcurementStatus.isPending
                }
              >
                <XCircle className="h-4 w-4 text-gray-600" />
                Rejected
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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Input
            placeholder="Search procurements..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full md:max-w-md"
          />
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <span className="hidden sm:inline">Status Filter</span>
                  {statusFilter && (
                    <span className="ml-1 text-xs">
                      ({statusFilter.replace(/_/g, " ")})
                    </span>
                  )}
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => handleStatusFilterChange("")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleStatusFilterChange("WAITING_CONFIRMATION")
                  }
                >
                  Waiting Confirmation
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusFilterChange("PRIORITAS")}
                >
                  Prioritas
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusFilterChange("URGENT")}
                >
                  Urgent
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusFilterChange("COMPLEMENT")}
                >
                  Complement
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusFilterChange("REJECTED")}
                >
                  Rejected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  <ColumnsIcon className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Columns</span>
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
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
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
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
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-100">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            key={header.id}
                            colSpan={header.colSpan}
                            className="h-12 px-2 font-semibold whitespace-nowrap text-gray-700 md:px-4"
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
                        Loading procurements...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-red-500"
                      >
                        Error loading procurements: {error.message}
                      </TableCell>
                    </TableRow>
                  ) : updateProcurementStatus.isPending ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        Updating procurement status...
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
                        No procurements found. Try a different search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </DndContext>

          {procurementsData && procurementsData.meta && (
            <div className="border-t p-2 md:p-4">
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

      {/* Modal Detail Section */}
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
