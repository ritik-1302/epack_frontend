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
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuCheckboxItem,
   
    
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FolderKanban } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export function ProjectAssign({ project_list, user_list }) {
 
  const [projects,setProjects]=useState<{ [key: string]: boolean }>({})
  const [users,setUsers]=useState<{ [key: string]: boolean }>({})

  

  const handleAssign = async (): Promise<void> => {

    let us_list:string[]=[]
    let pro_list:string[]=[]

    console.log(projects)


    Object.keys(projects).forEach(key=>{
       if (projects[key]===true){
        pro_list.push(key)
        console.log(key)
       }
    })

    Object.keys(users).forEach(key=>{
      if (users[key]===true){
       us_list.push(key)
      }
   })


   console.log("users",us_list)
   console.log("project",pro_list)


    

    if (us_list.length===0||pro_list.length===0){
        alert("Please populate all the feilds")
        return
    }

    


    try{
      const response = await fetch(
        `http://13.233.201.77/add_project`,
        {
          headers:{'content-type': 'application/json'},
          method: "POST",
          body: JSON.stringify({"username":us_list,"projectname":pro_list,"isnew":false})
        }  
      );

      if (response.status===200){
        alert("Project Assigned Succcesfully")

      }else{
        alert("Project already assigned")
        
      }
    }catch{
      
      alert("Not able to assign the project try again later")
    }

  }

 

 

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-[436px] cursor-pointer p-[20px] border border-gray-300 rounded-md shadow-sm flex items-center gap-3">
          <div className="p-[12px] border border-gray-300 rounded-md shadow-sm">
            <FolderKanban size={16} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-gray-700 text-[16px] font-semibold">
              Assign Project
            </h1>
            <h1 className="text-[14px] font-normal text-gray-600">
              Assign project to a exisitng user
            </h1>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">Assign Project</DialogTitle>
          <DialogDescription className="">
            Assign project to a exisitng user
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="project" className="text-sm">
            Select Project
          </Label>
          <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline"></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Projects</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {project_list.map((project_name) => (
            <DropdownMenuCheckboxItem
              key={project_name}
              checked={projects[project_name]}
              onCheckedChange={() => {
                setProjects((prevProjects) => ({
                  ...prevProjects,
                  [project_name]: !prevProjects[project_name],
                }));
                console.log(project_name);
              }}
            >
              {project_name}
            </DropdownMenuCheckboxItem>
          ))}
        
       
      </DropdownMenuContent>
    </DropdownMenu>
          <Label htmlFor="username" className="text-sm">
            Select Username
          </Label>
          <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline"></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Projects</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {user_list.map((user) => (
            <DropdownMenuCheckboxItem
              key={user}
              checked={users[user]}
              onCheckedChange={() => {
                setUsers((prevUsers) => ({
                  ...prevUsers,
                  [user]: !prevUsers[user],
                }));
                console.log(user);
              }}
            >
              {user}
            </DropdownMenuCheckboxItem>
          ))}
        
       
      </DropdownMenuContent>
    </DropdownMenu>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            className="w-full"
            onClick={ handleAssign}
          >
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
