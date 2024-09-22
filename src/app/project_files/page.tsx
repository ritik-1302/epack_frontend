"use client";
import Navbar from "@/components/Navbar";
import { CircleArrowUp, Ellipsis, FileBarChart2 } from "lucide-react";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";


const ProjectFiles = () => {

    const [loading,setLoading]=useState(false)
    const [filesList,setFilesList]=useState([])
    const router = useRouter();

   
    const loadData  = async (): Promise<void> => {
     setLoading(true)
     
     const projectname=localStorage.getItem('projectname')
     try {
       const response = await fetch(
         `http://13.233.201.77/get_project_files?projectname=${projectname}`,
         {
           method: "GET",
         }
       );
       if (response.status == 200) {
         const json_body = await response.json();
         console.log(json_body)
         setFilesList(json_body["data"])
         
         
       }else{
         alert("No such user exists")
       }
     } catch (error) {
       alert("Unable to fetch project  file List")
     }finally{
       setLoading(false)
     }
   
   
    }
    useEffect(()=>{
        loadData()
    },[])
  return (
    <div>
      <Navbar is_parts_table={false} />
      <div className="max-w-6xl mx-auto mt-14">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Project Files</h1>

          {loading?(<CircularProgress/>):(<div/>)}

          {filesList.map((file) => (
                  <div key={file} className="w-full border border-gray-300 p-[16px] flex items-center justify-between" onClick={()=>{
                    localStorage.setItem("filename", file);

                    router.push("/parts_table");
                  }}>
                  <div className="flex items-center gap-5">
                    <div className="p-[12px] border bg-slate-100 border-gray-300 rounded-md shadow-sm">
                      <FileBarChart2 size={16} />
                    </div>
                    <div className="flex flex-col">
                      <h1 className="text-gray-700 text-[20px] font-semibold">{file}</h1>
                    </div>
                  </div>
                </div>
                ))}

          
        </div>
      </div>
    </div>
  );
};

export default ProjectFiles;
