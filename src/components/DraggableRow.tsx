// components/table/DraggableRow.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { flexRender } from "@tanstack/react-table";
import { TableCell, TableRow } from "@/components/ui/table";

interface DraggableRowProps {
  row: any;
  isEmptyRow?: boolean;
  columnCount?: number;
}

export function DraggableRow({
  row,
  isEmptyRow = false,
  columnCount = 7,
}: DraggableRowProps) {
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
      className="relative border-b hover:bg-slate-50 data-[dragging=true]:z-10 data-[dragging=true]:bg-slate-100 data-[dragging=true]:opacity-90"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {isEmptyRow
        ? Array.from({ length: columnCount }).map((_, index) => (
            <TableCell
              key={`empty-cell-${index}`}
              className="py-2 sm:py-3 px-2 sm:px-4 border-l border-r border-gray-200"
            >
              &nbsp;
            </TableCell>
          ))
        : row.getVisibleCells().map((cell: any) => {
            let cellClass =
              "py-2 sm:py-3 px-2 sm:px-4 border-l border-r border-gray-200";

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