import { useState, useEffect, useMemo, useRef } from "react";
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

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

  const table = useMaterialReactTable({
    columns,
    data: parts_object["parts"],
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
    enableColumnOrdering: true,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");

      // Parse the SVG string
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(
        parts_object["image_url"],
        "image/svg+xml"
      );
      const svgElement = svgDoc.documentElement;

      // Get SVG dimensions
      const svgWidth = parseFloat(svgElement.getAttribute("width")!);
      const svgHeight = parseFloat(svgElement.getAttribute("height")!);

      console.log(svgWidth, svgHeight);

      // Set canvas size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setCanvasSize({ width: canvas.width, height: window.innerHeight - 50 });

      // Create a Blob from the SVG string
      const svgBlob = new Blob([parts_object["image_url"]], {
        type: "image/svg+xml;charset=utf-8",
      });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      // Create an Image object
      const img = new Image();
      img.onload = function () {
        // Draw the SVG onto the canvas
        if (ctx) ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(blobURL);
      };
      img.src = blobURL;
    }
  }, [parts_object]);

  return (
    <div
      style={{
        position: "relative",
        width: canvasSize.width,
        height: canvasSize.height,
      }}
    >
      <canvas ref={canvasRef} />
      <Rnd
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
        default={{
          x: 0,
          y: 0,
          width: 320,
          height: 200,
        }}
      >
        <div
          style={{
            transform: `scale(${tablesize})`,
            transformOrigin: "top left",
            width: "fit-content",
          }}
        >
          <MaterialReactTable key={block_name} table={table} />
        </div>
      </Rnd>
    </div>
  );
}
