"use client";
import React from "react";
import { Button } from "./ui/button";
import { BellIcon, Settings2Icon,OctagonAlert ,ArrowDownToLine} from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

const Navbar = ({is_parts_table}) => {
  return (
    <div className="flex bg-white border-b shadow-sm p-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-gray-900">EPACK</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={()=>{
            window.location.href = "https://forms.gle/kex9fL6V5jngzrfL7"
          }}>
             <OctagonAlert style={{
              color:"red"
             }}/>
          </Button>
          <Button variant="outline" size="icon">
            <Settings2Icon className="h-[20px] w-[20px] text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon">
            <BellIcon className="h-[20px] w-[20px] text-gray-500" />
          </Button>
          <Avatar>
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
          {
            is_parts_table?(<Button variant="ghost" size="icon" >
              <ArrowDownToLine className="h-[20px] w-[20px] text-gray-500" />
            </Button>):(<div></div>)
          }
          
        </div>
      </div>
    </div>
  );
};

export default Navbar;

