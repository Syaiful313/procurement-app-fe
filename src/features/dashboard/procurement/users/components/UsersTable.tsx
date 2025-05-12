"use client";
import PaginationSection from "@/components/PaginationSection";
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
import useDeleteUser from "@/hooks/api/dashboard-procurement/useDeleteUser";
import useGetUsers from "@/hooks/api/dashboard-procurement/useGetUsers";

import { User } from "@/types/user";
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
import { useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDownIcon, FilterIcon, Loader2, Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import RegisterModal from "./RegisterModal";

const ROLE_CONFIG = {
  USER: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    label: "User",
  },
  DIROPS: {
    color: "bg-purple-50 text-purple-700 border-purple-200",
    label: "Dirops",
  },
  MANAGER: {
    color: "bg-green-50 text-green-700 border-green-200",
    label: "Manager",
  },
  PROCUREMENT: {
    color: "bg-orange-50 text-orange-700 border-orange-200",
    label: "Procurement",
  },
};

function DraggableRow({ row }: { row: Row<User> }) {
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
        let cellClass = "py-1 sm:py-3 px-0.5 sm:px-4";

        // Mobile-first responsive classes with all columns visible
        if (cell.column.id === "index")
          cellClass += " w-8 sm:w-16 text-[10px] sm:text-sm text-center";
        else if (cell.column.id === "nik")
          cellClass += " min-w-[50px] sm:w-32 text-[10px] sm:text-sm";
        else if (cell.column.id === "username")
          cellClass += " min-w-[65px] sm:w-36 text-[10px] sm:text-sm font-medium";
        else if (cell.column.id === "email")
          cellClass += " min-w-[90px] sm:w-auto text-[10px] sm:text-sm";
        else if (cell.column.id === "role") 
          cellClass += " min-w-[55px] sm:w-32 text-center";
        else if (cell.column.id === "password")
          cellClass += " min-w-[60px] sm:w-36 text-[10px] sm:text-sm";
        else if (cell.column.id === "actions") 
          cellClass += " w-10 sm:w-32 text-center";

        return (
          <TableCell key={cell.id} className={cellClass}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

export function UsersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounceValue(searchQuery, 400);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [roleFilter, setRoleFilter] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: number;
    username: string;
  } | null>(null);

  const queryClient = useQueryClient();

  const {
    data: usersData,
    isLoading,
    error,
  } = useGetUsers({
    page: currentPage,
    take: pageSize,
    search: debouncedSearch,
    role: roleFilter,
  });

  const deleteUserMutation = useDeleteUser();

  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    if (usersData?.data) {
      setData(usersData.data);
    }
  }, [usersData]);

  const RoleBadge = ({ role }: { role: string }) => {
    const config = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] || {
      color: "bg-gray-50 text-gray-600 border-gray-200",
      label: role,
    };

    return (
      <Badge
        variant="outline"
        className={`px-1 sm:px-3 py-0 sm:py-1 font-medium text-[8px] sm:text-xs whitespace-nowrap ${config.color}`}
      >
        {config.label}
      </Badge>
    );
  };

  const handleDeleteUser = (userId: number, username: string) => {
    setUserToDelete({ id: userId, username });
    setShowDeleteAlert(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id, {
        onSuccess: () => {
          setShowDeleteAlert(false);
          setUserToDelete(null);
        },
      });
    }
  };

  const handleRegisterSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "index",
      header: () => (
        <div className="text-center text-[9px] sm:text-xs font-semibold uppercase tracking-wider">
          No
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center text-[10px] sm:text-sm">{row.index + 1}</div>
      ),
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: "nik",
      header: () => (
        <div className="text-left text-[9px] sm:text-xs font-semibold uppercase tracking-wider">
          NIK
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-left font-medium text-[10px] sm:text-sm truncate">
          {row.original.nik}
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: "username",
      header: () => (
        <div className="text-left text-[9px] sm:text-xs font-semibold uppercase tracking-wider">
          Username
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-left font-medium text-[10px] sm:text-sm truncate" title={row.original.username}>
          {row.original.username}
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "password",
      header: () => (
        <div className="text-left text-[9px] sm:text-xs font-semibold uppercase tracking-wider">
          Password
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-left text-[10px] sm:text-sm text-gray-600 truncate" title={row.original.password}>
          {row.original.password}
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "email",
      header: () => (
        <div className="text-left text-[9px] sm:text-xs font-semibold uppercase tracking-wider">
          Email
        </div>
      ),
      cell: ({ row }) => (
        <div
          className="text-left text-[10px] sm:text-sm text-gray-600 truncate"
          title={row.original.email}
        >
          {row.original.email}
        </div>
      ),
      size: 150,
    },
    {
      accessorKey: "role",
      header: () => (
        <div className="text-center text-[9px] sm:text-xs font-semibold uppercase tracking-wider">
          Role
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <RoleBadge role={row.original.role} />
        </div>
      ),
      size: 80,
    },
    {
      id: "actions",
      header: () => (
        <div className="text-center text-[9px] sm:text-xs font-semibold uppercase tracking-wider">
          <span className="hidden sm:inline">Actions</span>
          <span className="sm:hidden">Act</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center gap-0.5 sm:gap-1">
          <Button
            variant="ghost"
            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-0 sm:p-1 rounded-full h-6 w-6 sm:h-8 sm:w-8"
            size="icon"
            onClick={() =>
              handleDeleteUser(Number(row.original.id), row.original.username)
            }
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="sr-only">Delete user</span>
          </Button>
        </div>
      ),
      enableHiding: false,
      size: 60,
    },
  ];

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
    <>
      <div className="space-y-3 sm:space-y-4 max-w-full">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 sm:gap-3">
          <div className="flex-1 max-w-full lg:max-w-md">
            <Input
              placeholder="Cari user..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-sm"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 sm:flex-initial">
              <RegisterModal onSuccess={handleRegisterSuccess} />
            </div>

            <div className="flex gap-2 flex-1 sm:flex-initial">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center flex-1 sm:flex-initial justify-center sm:justify-start text-xs md:text-sm h-9 sm:h-9 px-2 sm:px-3"
                  >
                    <FilterIcon className="h-3.5 w-3.5 mr-1" />
                    <span className="truncate">
                      {roleFilter
                        ? ROLE_CONFIG[roleFilter as keyof typeof ROLE_CONFIG]
                            ?.label || roleFilter
                        : "Roles"}
                    </span>
                    <ChevronDownIcon className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => {
                      setRoleFilter("");
                      setCurrentPage(1);
                    }}
                    className="cursor-pointer"
                  >
                    All Roles
                  </DropdownMenuItem>
                  {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => {
                        setRoleFilter(role);
                        setCurrentPage(1);
                      }}
                      className="flex items-center cursor-pointer"
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
                    className="flex items-center flex-1 sm:flex-initial justify-center sm:justify-start text-xs md:text-sm h-9 sm:h-9 px-2 sm:px-3"
                  >
                    <span>Cols</span>
                    <ChevronDownIcon className="ml-1 h-3.5 w-3.5" />
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
                        className="capitalize cursor-pointer"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
              <Table className="w-full min-w-[600px]">
                <TableHeader className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-b border-gray-200"
                    >
                      {headerGroup.headers.map((header) => {
                        let headerClass = "h-7 sm:h-10 px-0.5 sm:px-4 text-gray-700";

                        if (header.id === "index") headerClass += " w-8 sm:w-16";
                        else if (header.id === "nik")
                          headerClass += " min-w-[50px] sm:w-32";
                        else if (header.id === "username")
                          headerClass += " min-w-[65px] sm:w-36";
                        else if (header.id === "email")
                          headerClass += " min-w-[90px] sm:w-auto";
                        else if (header.id === "role")
                          headerClass += " min-w-[55px] sm:w-32";
                        else if (header.id === "password")
                          headerClass += " min-w-[60px] sm:w-36";
                        else if (header.id === "actions")
                          headerClass += " w-10 sm:w-32";

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
                          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-t-blue-500 rounded-full animate-spin"></div>
                          <span className="ml-2 text-xs sm:text-sm text-gray-500">
                            Loading...
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
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-sm">Error loading data</span>
                          <span className="text-xs sm:text-sm text-red-400">
                            {error.message || "Unknown error"}
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
                          Tidak ada data user ditemukan
                        </span>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </DndContext>

          {usersData?.meta && (
            <div className="border-t border-gray-200 bg-gray-50 py-2 sm:py-3 px-2 sm:px-4">
              <PaginationSection
                page={usersData.meta.page}
                take={usersData.meta.take}
                total={usersData.meta.total}
                onChangePage={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus User</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus user{" "}
              <strong>{userToDelete?.username}</strong>? Tindakan ini tidak
              dapat dibatalkan. User akan kehilangan akses ke sistem, tetapi
              semua procurement yang terkait akan tetap tersimpan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Menghapus...
                </>
              ) : (
                "Hapus User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}