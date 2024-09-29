"use client";
import React, { useEffect, useState, CSSProperties, useRef } from "react";
import Navbar from "../../components/Navbar";
import CircularProgress from "@mui/material/CircularProgress";
import { useReactToPrint } from "react-to-print";
import { SvgwithTable } from "@/components/SvgwithTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
export default function PartsTable() {
  const [data, setData] = useState({});
  const [username, setUsername] = useState("");
  const componentRef = useRef(null);
  const [tableSizes, setTableSizes] = useState<{ [key: string]: number }>({});
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [phase, setPhase] = useState("PHASE_1");
  const [phaseList, setPhaseList] = useState<string[]>([]);
  const [trigger, setTriggerRerender] = useState(false);
  const [dimensions,setDimensions]=useState<{width:string|null,height:string|null}>({width:null,height:null})

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

  const handleExcelDownload = async (): Promise<void> => {
    const filename = localStorage.getItem("filename");

    try {
      console.log("Fetching file from S3...");
      const response = await fetch(
        `http://13.233.201.77/download_boq?filename=${filename}&phase=${phase}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        alert("Error in downloading BOQ");
        throw new Error(`Error fetching file: ${response.statusText}`);
      }

      // Extract the file name from the Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      let downloadFilename = "boq.xlsx"; // Fallback in case the header is not set

      if (contentDisposition && contentDisposition.includes("filename=")) {
        // Extract filename from 'Content-Disposition' header
        downloadFilename = contentDisposition
          .split("filename=")[1]
          .trim()
          .replace(/"/g, ""); // Remove any quotes
      }

      // Get the file data as a Blob (Binary Large Object)
      const blob = await response.blob();

      // Create a temporary URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element to download the file
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadFilename; // Set the dynamically fetched filename
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Clean up by removing the link and revoking the URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("File downloaded successfully");
    } catch (error) {
      console.error("Error retrieving file:", error);
      alert("Couldn't download your file");
    }
  };

  const handlePrint = useReactToPrint({
    pageStyle: `@media print {
      @page {
        size: ${dimensions.width}  ${dimensions.height};
      }
    }`,
    content: () => componentRef.current,
    documentTitle: "PartsTable",
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        
        setTimeout(resolve, 1000);
      });
    },
   
  });

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

        let i = 0;
        let res: string[] = [];

        Object.entries(json_body).forEach(([k, v]) => {
          Object.entries(v as Record<string, object>).forEach(
            ([key, value]) => {
              if (i <= 0) {
                Object.entries(value["phase"]).forEach(([ke, val]) => {
                  res.push(ke);
                });
              }
              i += 1;
            }
          );
        });

        

        setPhaseList(res);
        console.log(res);
      } else {
        alert("No such file exist in the Cloud");
      }
    } catch (error) {
      alert("Not able to retrieve your DXF file");
      console.error("Error retrieving file:", error);
    }
  };
  const increaseTableSize = () => {
    if (hoveredKey) {
      setTableSizes((prevSizes) => ({
        ...prevSizes,
        [hoveredKey]: (prevSizes[hoveredKey] || 0.5) + 0.05,
      }));

      if (tableSizes[hoveredKey] > 1) {
        alert("Scaling too High");
      }
    }
  };
    const getSvgDimensions = (svgStr) => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgStr, "image/svg+xml");
    const svgElement = svgDoc.querySelector('svg');

    if (svgElement) {
      const width = svgElement.getAttribute('width');
      const height = svgElement.getAttribute('height');
      return { width, height };
    }
    return { width: null, height: null };
  }
  const decreaseTableSize = () => {
    if (hoveredKey) {
      setTableSizes((prevSizes) => ({
        ...prevSizes,
        [hoveredKey]: (prevSizes[hoveredKey] || 0.5) - 0.05,
      }));

      if (tableSizes[hoveredKey] < 0.2) {
        alert("Scaling too Low");
      }
    }
  };
  const handleRerender = () => {
    setTriggerRerender((prev) => !prev); // Toggle the state to cause rerender
  };

 

  useEffect(() => {
   
    if (Object.keys(data).length > 0) {
      Object.entries(data).forEach(([k, v]) => {
        Object.entries(v as Record<string, object>).forEach(([key, value]) => {
         
          const dimensions =getSvgDimensions(value['image_url'])
          setDimensions({height:dimensions.height,width:dimensions.width})
          setTableSizes((prevSizes) => ({
            ...prevSizes,
            [key]: 0.5,
          }));




        });
      });
    }

   
  }, [data, trigger]);


  useEffect(() => {
    const user_name = localStorage.getItem("username") as string;
    setUsername(user_name);
    loadData();
    
  }, [trigger]);

  return (
    <div>
      <Navbar
        is_parts_table={true}
        is_admin={username === "epack" ? true : false}
      />
      {data["data"] ? (
        <div ref={componentRef}>
          {Object.entries(data).map(([k, v]) =>
            Object.entries(v as Record<string, object>).map(([key, value]) => (
              <div key={key} onMouseMove={() => setHoveredKey(key)}>
                <SvgwithTable
                  block_name={key}
                  parts_object={value}
                  tablesize={tableSizes[key]}
                  phase_qty={value["phase"][phase]}
                  
                />
              </div>
            ))
          )}
          <div style={floatingButtonStyles}>
            <button style={moveButtonStyles} onClick={increaseTableSize}>
              +
            </button>
            <button style={moveButtonStyles} onClick={decreaseTableSize}>
              -
            </button>
            <button style={moveButtonStyles} onClick={handlePrint}>
              Print Button
            </button>
            <button style={moveButtonStyles} onClick={handleExcelDownload}>
              Print BOQ
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button style={moveButtonStyles}>Select Phase</button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="">Register</DialogTitle>
                  <DialogDescription className="">
                    Select Phase
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Label htmlFor="username" className="text-sm">
                    Select Phase
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">{phase}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Select Project</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={phase}
                        onValueChange={setPhase}
                      >
                        {phaseList.map((phase) => (
                          <DropdownMenuRadioItem
                            key={phase}
                            value={phase}
                            onClick={handleRerender}
                          >
                            {phase}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : (
        <CircularProgress></CircularProgress>
      )}
    </div>
  );
}
