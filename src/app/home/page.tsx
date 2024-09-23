"use client";
import Navbar from "@/components/Navbar";
import { ProjectSelection } from "@/components/ProjectSelection";
import { UploadFile } from "@/components/UploadFile";
import { CircleArrowUp, Ellipsis, FileBarChart2 } from "lucide-react";
import React, { useState, useEffect } from "react";

const Page = () => {
  const [projectList, setProjectList] = useState([]);
  const [loading,setLoading]=useState(false)

  const loadData = async () => {
    
    const username = localStorage.getItem("username");

    try {
      const response = await fetch(
        `http://13.233.201.77/get_projects?username=${username}`,
        {
          method: "GET",
        }
      );
      if (response.status == 200) {
        const json_body = await response.json();
        console.log(json_body)
        setProjectList(json_body["project_list"])
        
        
      }else{
        alert("No such user exists")
      }
    } catch (error) {
      alert("Unable to fetch project List")
    }finally{
      
    }
  };


  useEffect(() => {
    loadData();
  },[]);

 

  return (
      <div>
      <Navbar is_parts_table={false} is_admin={localStorage.getItem("username")==='epack'?(true):(false)} />
      <div className="max-w-6xl mx-auto mt-14">
        <div className="flex flex-col zgap-4 mb-5">
          {/* <h1 className="text-4xl font-bold">Radha Swami,</h1> */}
          
          <h1 className="text-4xl font-bold">Welcome,</h1>

          <div className="grid grid-cols-2 gap-4">
            <UploadFile project_list={projectList} />
            <ProjectSelection project_list={projectList}/>
          </div>
          
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Inventory Management</h1>
          <div className="w-full border border-gray-300 p-[16px] flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="p-[12px] border bg-slate-100 border-gray-300 rounded-md shadow-sm">
                <FileBarChart2 size={16} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-gray-700 text-[20px] font-semibold">SC1</h1>
                <h1 className="text-[14px] font-normal text-gray-600">
                  21 Sep 2023
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-20">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-gray-200 border border-gray-200 items-center flex justify-center px-2 py-1">
                  <h1 className="text-[14px] text-gray-700 font-medium">CP1</h1>
                </div>
                <div className="rounded-2xl bg-gray-200 border border-gray-200 items-center flex justify-center px-2 py-1">
                  <h1 className="text-[14px] text-gray-700 font-medium">WP2</h1>
                </div>
                <div className="rounded-2xl bg-gray-200 border border-gray-200 items-center flex justify-center px-2 py-1">
                  <h1 className="text-[14px] text-gray-700 font-medium">WP3</h1>
                </div>
                <div className="rounded-2xl bg-gray-200 border border-gray-200 items-center flex justify-center px-2 py-1">
                  <h1 className="text-[14px] text-gray-700 font-medium">WP4</h1>
                </div>
              </div>
              <div className="p-[12px] border bg-slate-100 border-gray-300 rounded-md shadow-sm">
                <Ellipsis size={16} />
              </div>
            </div>
          </div>
          <div className="w-full border border-gray-300 p-[16px] flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="p-[12px] border bg-slate-100 border-gray-300 rounded-md shadow-sm">
                <FileBarChart2 size={16} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-gray-700 text-[20px] font-semibold">RF1</h1>
                <h1 className="text-[14px] font-normal text-gray-600">
                  2 Jan 2024
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-20">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-gray-200 border border-gray-200 items-center flex justify-center px-2 py-1">
                  <h1 className="text-[14px] text-gray-700 font-medium">ST3</h1>
                </div>
                <div className="rounded-2xl bg-gray-200 border border-gray-200 items-center flex justify-center px-2 py-1">
                  <h1 className="text-[14px] text-gray-700 font-medium">ST2</h1>
                </div>
                <div className="rounded-2xl bg-gray-200 border border-gray-200 items-center flex justify-center px-2 py-1">
                  <h1 className="text-[14px] text-gray-700 font-medium">WP3</h1>
                </div>
                <div className="rounded-2xl bg-gray-200 border border-gray-200 items-center flex justify-center px-2 py-1">
                  <h1 className="text-[14px] text-gray-700 font-medium">PL1</h1>
                </div>
              </div>
              <div className="p-[12px] border bg-slate-100 border-gray-300 rounded-md shadow-sm">
                <Ellipsis size={16} />
              </div>
            </div>
          </div>
          <div className="w-full border border-gray-300 p-[16px] flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="p-[12px] border bg-slate-100 border-gray-300 rounded-md shadow-sm">
                <FileBarChart2 size={16} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-gray-700 text-[20px] font-semibold">PB1</h1>
                <h1 className="text-[14px] font-normal text-gray-600">
                  12 Mar 2024
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-20">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-gray-200 border border-gray-200 items-center flex justify-center px-2 py-1">
                  <h1 className="text-[14px] text-gray-700 font-medium">BD1</h1>
                </div>
                <div className="rounded-2xl bg-gray-200 border border-gray-200 items-center flex justify-center px-2 py-1">
                  <h1 className="text-[14px] text-gray-700 font-medium">WP1</h1>
                </div>
                <div className="rounded-2xl bg-gray-200 border border-gray-200 items-center flex justify-center px-2 py-1">
                  <h1 className="text-[14px] text-gray-700 font-medium">
                    PD1(103c)
                  </h1>
                </div>
                <div className="rounded-2xl bg-gray-200 border border-gray-200 items-center flex justify-center px-2 py-1">
                  <h1 className="text-[14px] text-gray-700 font-medium">
                    STD. 504
                  </h1>
                </div>
              </div>
              <div className="p-[12px] border bg-slate-100 border-gray-300 rounded-md shadow-sm">
                <Ellipsis size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
