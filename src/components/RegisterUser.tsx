"use client"


import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleUser } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";



export function RegisterUser() {
  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")
  

  const handleRegister  = async (): Promise<void> => {
    try{
      const response = await fetch(
        `http://13.233.201.77/register`,
        {
          headers:{'content-type': 'application/json'},
          method: "POST",
          body: JSON.stringify({"username":username,"password":password})
        }  
      );

      if (response.status===201){
        alert("User Registerd Sucessfully")

      }else{
        alert("User Already Registerd")
        
      }
    }catch{
      
      alert("Not able to register anay user")
    }




  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-[436px] cursor-pointer p-[20px] border border-gray-300 rounded-md shadow-sm flex items-center gap-3">
          <div className="p-[12px] border border-gray-300 rounded-md shadow-sm">
            <CircleUser size={16} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-gray-700 text-[16px] font-semibold">
              Register
            </h1>
            <h1 className="text-[14px] font-normal text-gray-600">
             Register new user
            </h1>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">Register</DialogTitle>
          <DialogDescription className="">
            Register new user
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="username" className="text-sm">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
          />
          <Label htmlFor="password" className="text-sm">
            Password
          </Label>
          <Input
            id="password"
            type="text"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
          />
        </div>

        <DialogFooter>
          <Button
            type="submit"
            className="w-full"
            onClick={ handleRegister}
          >
           Register
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
