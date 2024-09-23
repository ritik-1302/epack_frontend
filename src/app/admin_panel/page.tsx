"use client";
import Navbar from "@/components/Navbar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export default function AdminPanel(){
    const [username,setUsername]=useState("")

    useEffect(()=>{

        const user_name=localStorage.getItem("username") as string
        setUsername(user_name)

    },[])
   

    return(<div>
        <Navbar is_parts_table={false} is_admin={username==='epack'?(true):(false)}/>
        <div className="max-w-6xl mx-auto mt-14">
        <div className="flex flex-col zgap-4 mb-5">
          {/* <h1 className="text-4xl font-bold">Radha Swami,</h1> */}
          
          <h1 className="text-4xl font-bold">Admin Panel</h1>

          <div className="grid grid-cols-2 gap-4">
            {/* <UploadFile project_list={projectList} />
            <ProjectSelection project_list={projectList}/> */}
          </div>
          
        </div>
        </div>
        
        </div>
    )
}