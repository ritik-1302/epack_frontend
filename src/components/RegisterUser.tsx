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

import CircularProgress from "@mui/material/CircularProgress";

import Router, { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleArrowUp, CloudUpload, Plus, WatchIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function RegisterUser({ project_list }) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [density, setDensity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [existingProject, setExistingProject] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const router = useRouter();

  console.log("From upload Component", project_list);

  // Shows the size of the file and stores the file
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      const filetemp = event.target.files?.[0];
      if (filetemp) {
        const size = Math.round((filetemp.size / (1000 * 1024)) * 100) / 100;
        const uploadedFile: any = {
          name: filetemp.name,
          size: size,
          type: filetemp.type,
          // cors: "no-cors"
        };
        setUploadedFile(uploadedFile);
        setFile(event.target.files[0]);
      }
      setFile(event.target.files[0]);
    }
  };

  //uploads the file in the server as well as uploads it in S3 Storage
  const handleUpload = async (): Promise<void> => {
    if (!uploadedFile) {
      console.error("");
      return;
    }
    if (newProjectName === "" && existingProject === "") {
      alert("Please select the project Name");
      return;
    }

    const formData = new FormData();
    if (file !== null) {
      formData.append("file", file);
    }
    formData.append("density", density);
    formData.append("height", window.innerHeight.toString());
    formData.append("width", window.innerWidth.toString());
    if (newProjectName === "") {
      formData.append("projectName", existingProject);
    } else {
      formData.append("projectName", newProjectName);
      try {
        console.log("adding new project in db");
        const response = await fetch("http://13.233.201.77/add_project", {
          method: "POST",
          body: JSON.stringify({
            username: localStorage.getItem("username"),
            projectname: newProjectName,
          }),
          headers: { "content-type": "application/json" },
        });

        console.log(response.status);
        console.log(response.body);

        if (response.status === 200) {
          console.log("new project creation sucess");
        } else {
          console.log("new project creation failed");
          return;
        }
      } catch {
        alert("cant create a new project");
      }
    }

    setLoading(true);

    try {
      console.log("Uploading file:", formData.get("file"));
      const response = await fetch("http://13.233.201.77/get_dxf_info", {
        method: "POST",
        body: formData,
      });

      console.log("Response:", response);
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (response.status == 200) {
        const data = await response.json();
        console.log("Data:", data);
        localStorage.setItem("filename", data["file_name"]);

        setLoading(false);
        router.push("/parts_table");
      } else {
        console.error("Data format is incorrect");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  //shows the acess to the projects of the user

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-[436px] cursor-pointer p-[20px] border border-gray-300 rounded-md shadow-sm flex items-center gap-3">
          <div className="p-[12px] border border-gray-300 rounded-md shadow-sm">
            <CircleArrowUp size={16} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-gray-700 text-[16px] font-semibold">
              Upload your Autocad DXF file
            </h1>
            <h1 className="text-[14px] font-normal text-gray-600">
              Generate BOQ
            </h1>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">Upload and attach file</DialogTitle>
          <DialogDescription className="">
            Upload and attach files to this project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="density" className="text-sm">
            Density(kg/m3)
          </Label>
          <Input
            id="density"
            type="text"
            value={density}
            onChange={(event) => setDensity(event.target.value)}
            placeholder="Density"
          />
          <div className="flex flex-col gap-1.5 justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="text-center">
                <div className="border p-2 rounded-md max-w-min mx-auto">
                  <CloudUpload size="1.6em" />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-900">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  DXF (max. 1mb)
                </p>
              </div>
            </label>
            <Input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {uploadedFile && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">{uploadedFile.name}</p>
              <p className="text-sm text-gray-600">{uploadedFile.size} MB</p>
            </div>
          )}
          <Label htmlFor="density" className="text-sm">
            Select Project
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{existingProject}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select Project</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuRadioGroup
                value={existingProject}
                onValueChange={setExistingProject}
              >
                <DropdownMenuRadioItem value="New Project">
                  New Project
                </DropdownMenuRadioItem>
                {project_list.map((project) => (
                  <DropdownMenuRadioItem key={project} value={project}>
                    {project}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {existingProject === "New Project" ? (
            <Input
              id="project name"
              type="text"
              value={newProjectName}
              onChange={(event) => setNewProjectName(event.target.value)}
              placeholder="Project Name"
            />
          ) : (
            <div />
          )}
        </div>

        <DialogFooter>
          <Button
            type="submit"
            className="w-full"
            onClick={() => handleUpload()}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <WatchIcon size={16} />
                <span className="ml-2">Uploading...</span>
              </div>
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
