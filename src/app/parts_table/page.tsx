
"use client";

import React, { useEffect, useState, CSSProperties, useRef } from "react";
import Navbar from "../../components/Navbar";
import CircularProgress from "@mui/material/CircularProgress";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Rnd } from "react-rnd";
import { useReactToPrint } from "react-to-print";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const tableHeaderList = [
  "Part Name",
  "Thickness",
  "Quantity",
  "Length (mm)",
  "Width (mm)",
  "Area (m2)",
  "Volume (m3)",
  "Weight (kg)",
];

const arrowStyles: CSSProperties = {
  color: "red",
  position: "absolute",
  zIndex: 2,
  top: "calc(50%)",
  width: 100,
  height: 50,
  cursor: "pointer",
  fontSize: "30px",
};

const svgStyles: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignContent: "center",
  objectFit: "contain",
  maxHeight: "20%",
  top: "10px",
  left: "10px",
};

const floatingButtonStyles: CSSProperties = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  zIndex: 999,
  display: "flex",
  flexDirection: "column",
};

const moveButtonStyles: CSSProperties = {
  marginBottom: "10px",
  padding: "10px",
  fontSize: "20px",
  backgroundColor: "gray",
  color: "white",
  border: "none",
  cursor: "pointer",
};

export default function PartsTable() {
  const [data, setData] = useState({});
  const [tableSizes, setTableSizes] = useState<{ [key: string]: number }>({});
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [expandAll, setExpandAll] = useState(false); // State to expand all sides during print
  const componentRef = useRef(null); // Reference for printing
  let elements: any[] | undefined = [];
  const [username, setUsername] = useState(""); 



 const loadData = async (): Promise<void> => {
    const filename = localStorage.getItem("filename");

    try {
      console.log("fetching file from S3");
      const response = await fetch(
        `http://13.233.201.77/get_parts_info?filename=${filename}`,
        {
          method: "GET",
        }
      );
      if (response.status == 200) {
        const json_body = await response.json();
        setData(json_body);
      }
    } catch (error) {
      console.error("Error retrieving file:", error);
    }
  };

  const increaseTableSize = () => {
    if (hoveredKey) {
      setTableSizes((prevSizes) => ({
        ...prevSizes,
        [hoveredKey]: (prevSizes[hoveredKey] || 1) + 0.05, 
      }));


      if (tableSizes[hoveredKey]>1.2){
        alert("Scaling too High")
      }

      
      
    }
  };

  const decreaseTableSize = () => {
    if (hoveredKey) {
      setTableSizes((prevSizes) => ({
        ...prevSizes,
        [hoveredKey]: (prevSizes[hoveredKey] || 1) - 0.05, 
      }));

      if (tableSizes[hoveredKey]<0.5){
        alert("Scaling too Low")
      }
    }
  };

  
  const handlePrint = useReactToPrint({
    
    content: () => componentRef.current, // Target the component for printing
    documentTitle: 'PartsTable', // Optional: name of the PDF file
    onBeforeGetContent: () => {
      
      // Expand all sides before printing
      return new Promise((resolve) => {
        setExpandAll(true);
        setTimeout(resolve, 0); // Allow some time to apply the changes before print
      });
    },
    onAfterPrint: () => {
      // Reset the state after printing
      setExpandAll(false);
    },
  });


  useEffect(() => {
  const user_name=localStorage.getItem("username") as string
  setUsername(user_name)
    loadData();
  }, []);

  let i = 0;
  Object.entries(data as object).forEach(([k, v]) => {
    Object.entries(v as Record<string, object>).forEach(([key, value]) => {
      const tableSize = tableSizes[key] || 1;

      const svgString = value["image_url"];
      elements.push(
        <div key={i} onMouseMove={() => setHoveredKey(key)}>
          <div
            style={svgStyles}
            dangerouslySetInnerHTML={{ __html: svgString }}
          />
          <Rnd style={{ padding: "10px" }} >
            <Table
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                scale: tableSize,
              }}
            >
              <TableCaption>{key}</TableCaption>
              <TableHeader>
                <TableRow>
                  {tableHeaderList.map((header) => (
                    <TableHead className="text-center" key={header}>
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {value["parts"].map((parts) => (
                  <TableRow key={parts["Part Name"]}>
                    <TableCell className="font-medium">
                      {parts["Part Name"]}
                    </TableCell>
                    <TableCell>{parts["Thickness (mm)"]}</TableCell>
                    <TableCell>{parts["Quantity"]}</TableCell>
                    <TableCell>{parts["Length (mm)"]}</TableCell>
                    <TableCell>{parts["Width (mm)"]}</TableCell>
                    <TableCell>{parts["Area (m2)"]}</TableCell>
                    <TableCell>{parts["Volume (m3)"]}</TableCell>
                    <TableCell>{parts["Weight (kg)"]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Rnd>
        </div>
      );
      i = i + 1;
    });
  });

  
  return (
    <div ref={componentRef}>
      <Navbar is_parts_table={true} is_admin={username==='epack'?(true):(false)}/>

      {data["data"] ? (
        <div>
          <div  
          > 

            {expandAll?(elements):(<Carousel
              showIndicators={false}
              renderArrowPrev={(onClickHandler, hasPrev, label) =>
                hasPrev && (
                  <button
                    type="button"
                    onClick={onClickHandler}
                    title={label}
                    style={{ ...arrowStyles, left: 30 }}
                  >
                    &larr;
                  </button>
                )
              }
              renderArrowNext={(onClickHandler, hasNext, label) =>
                hasNext && (
                  <button
                    type="button"
                    onClick={onClickHandler}
                    title={label}
                    style={{ ...arrowStyles, right: 30 }}
                  >
                    &rarr;
                  </button>
                )
              }
            >
              {elements} 
            </Carousel >)}
            
          </div>

          <div style={floatingButtonStyles}>
            <button style={moveButtonStyles} onClick={increaseTableSize}>
              +
            </button>
            <button style={moveButtonStyles} onClick={decreaseTableSize}>
              -
            </button>

          
            <button style={moveButtonStyles} onClick={handlePrint}>
              Download as PDF
            </button>
          </div>
        </div>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}

