"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Rnd } from "react-rnd";
import { Button } from "@/components/ui/button";

export default function SvgwithTable({
  block_name,
  parts_object,
  phase_qty,
  dark_mode,
   setPos,
   pos
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [data,setData]=useState(parts_object["parts"])
 

  const handleAddPart = (values) => {
    setData([...data, values]);
  };

  const columns = 
    [
      {
        accessorKey: "Part Name",
        header: "Part Name",
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
        accessorFn: (row)=>phase_qty*row["Quantity"]
      },
      {
        accessorKey: "Weight (kg)",
        header: "Weight (kg)",
        accessorFn: (row)=>row["Weight (kg)"]*row["Quantity"]
      },
      {
        accessorKey: "Area (m2)",
        header: "Area (m2)",
      },
      {
        accessorKey: "Yield",
        header: "Yield",
      },
      {
        accessorKey: "Volume (m3)",
        header: "Volume (m3)",
      },
    ]

    const table = useMaterialReactTable({
      columns,
      data: data,
      enablePagination: false,
      enableEditing: true,
      editDisplayMode: 'cell', 
      state:{
        density:'compact'

      },
      onEditingRowSave: ({ table, values }) => {
        //validate data
        //save data to api
        table.setEditingRow(null); //exit editing mode
      },
      onCreatingRowSave: ({ values, table }) => {
        handleAddPart(values);
        table.setCreatingRow(null);
      },
      renderTopToolbarCustomActions: ({ table }) => (
        <div>
          <Button
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
       Add Item
      </Button>
        </div>
        
      
      ),
      renderBottomToolbarCustomActions:({table})=>(
        <div>
        {block_name}
        </div>
      ) ,
      
      
      
      muiTableBodyRowProps: { hover: false },
      muiTableProps: {
        sx: {
          border: "1px solid rgba(81, 81, 81, .5)",
          caption: { captionSide: "top" },
        },
      },
      muiTableHeadCellProps: {
        sx: {
          border: "2px solid rgba(81, 81, 81, .5)",
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: "22px",
        },
      },
      muiTableBodyCellProps: {
        sx: { border: "2px solid rgba(81, 81, 81, .5)",
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: "22px",
         },
       
      },
      enableColumnOrdering: true,
  
    },);



  

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
      canvas.width = 3508;
      canvas.height = 2480;
      // canvas.width = window.innerWidth;
      // canvas.height = window.innerHeight;
      setCanvasSize({ width: canvas.width, height: canvas.height-50 });

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

    
  }, [parts_object,phase_qty]);

  return (
    <div
      style={{
        position: "relative",
        width: canvasSize.width,
        height: canvasSize.height,
       filter: dark_mode ? "invert(1) hue-rotate(180deg)" : "none",
      }}
    >
      <canvas ref={canvasRef} />
      <Rnd
     
    
      onDragStop={(e,d)=>{
        setPos((prevPos)=>({
          ...prevPos,
          [block_name]:{
            ...prevPos[block_name],
            x:d.x,
            y:d.y
          }


        }))
        console.log(d.x,d.y)}
      }
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
        default={{
          x: pos[block_name].x,
          y: pos[block_name].y,
          width: 320,
          height: 200,
        }}
      >
        <div
          style={{
            transform: `scale(${pos[block_name].scale})`,
            transformOrigin: "top left",
            width: "fit-content",
            filter: dark_mode ? "invert(1) hue-rotate(180deg)" : "none",
           
          }}
        >
          <MaterialReactTable   table={table} key={`${block_name}`}></MaterialReactTable>
          
        </div>
      </Rnd>
    </div>
  );
}


