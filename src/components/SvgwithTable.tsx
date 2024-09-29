import { useState, useEffect, useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Rnd } from "react-rnd";

export function SvgwithTable({
  block_name,
  parts_object,
  tablesize,
  phase_qty,
}) {
 
  // Memoize columns with updated dependencies
  const columns = useMemo(
    () => [
      {
        accessorKey: "Part Name",
        header: "Part Name",
      },
      {
        accessorKey: "Thickness (mm)",
        header: "Thickness (mm)",
      },
      {
        accessorKey: "Quantity",
        header: "Quantity",
      },
      {
        accessorKey: "QTY./BLDG.",
        header: "QTY./BLDG.",
        accessorFn: (row) => row["Quantity"] * phase_qty,
      },
      {
        accessorKey: "Length (mm)",
        header: "Length (mm)",
      },
      {
        accessorKey: "Width (mm)",
        header: "Width (mm)",
      },
      {
        accessorKey: "Area (m2)",
        header: "Area (m2)",
      },
      {
        accessorKey: "Volume (m3)",
        header: "Volume (m3)",
      },
      {
        accessorKey: "Weight (kg)",
        header: "Weight (kg)",
      },
    ],
    [phase_qty]
  );

  // Use MaterialReactTable with updated data
  const table = useMaterialReactTable({
    enablePagination: false,
    muiTableBodyRowProps: { hover: false },


    muiTableProps: {
      sx: {
        border: "1px solid rgba(81, 81, 81, .5)",
        caption: { captionSide: "top" },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        border: "1px solid rgba(81, 81, 81, .5)",
        fontStyle: "italic",
        fontWeight: "normal",
      },
    },
    muiTableBodyCellProps: {
      sx: { border: "1px solid rgba(81, 81, 81, .5)" },
    },
    columns, // columns will be recalculated when phase_name or parts_object changes
    data: parts_object["parts"], // updated data passed to the table
    enableColumnOrdering: true,
  });

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: parts_object["image_url"] }} />
      <Rnd
        
      >
        <div style={{ scale: tablesize }}>
          <MaterialReactTable key={block_name} table={table} />
        </div>
      </Rnd>
    </div>
  );
}
