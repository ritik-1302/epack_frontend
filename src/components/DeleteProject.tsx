import { Delete } from "lucide-react";
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
  import { Trash } from "lucide-react";
  import { Label } from "@/components/ui/label";
  import {  useState } from "react";

export default function DeleteProject({project_list,refresh_trigger}){

    const [project,setProject]=useState("")

    const handleDeleteProject = async (): Promise<void> => {
        try{
            const response = await fetch(
              `http://13.233.201.77/remove_project?projectname=${project}`,
              {
                method: "DELETE",
                
              }  
            );
      
            if (response.status===200){
              alert("Sucessfully deleted the project")
              refresh_trigger()
      
            }else{
              alert("BAD request")
              
            }
          }catch{
            
            alert("Unable to delete the project as of right now")
          }
          finally{

            setProject("")

          }

    }

 return (
    <Dialog>
        <DialogTrigger asChild >
          <div className="w-[436px] cursor-pointer p-[20px] border border-gray-300 rounded-md shadow-sm flex items-center gap-3">
            <div className="p-[12px] border border-gray-300 rounded-md shadow-sm">
              <Trash size={16} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-gray-700 text-[16px] font-semibold">
               Delete Project
              </h1>
              <h1 className="text-[14px] font-normal text-gray-600">
                Delete a exisitng project
              </h1>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="">Delete Project</DialogTitle>
            <DialogDescription className="">
            Delete a exisitng project
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="project" className="text-sm">
              Select Project
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{project || "Select a project"}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
                <DropdownMenuLabel>Project</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={project} onValueChange={(value)=>{
                    setProject(value)

                }}>
                  {project_list.map((project) => (
                    <DropdownMenuRadioItem
                      key={project}
                      value={project}
                    >
                      {project}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
          </div>
  
          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              onClick={handleDeleteProject}
            >
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
 )

}