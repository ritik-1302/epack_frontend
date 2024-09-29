"use client";
import Navbar from "@/components/Navbar";
import { ProjectAssign } from "@/components/ProjectAssign";
import { RegisterUser } from "@/components/RegisterUser";

import { useEffect, useState } from "react";






export default function AdminPanel(){
    const [allProjectList,setAllProjectList]=useState([])
    const [allUsersList,setAllUsersList]=useState([])
    const [username,setUsername]=useState("")
    const [triggerRerender, setTriggerRerender] = useState(false)

    const loadData = async () => {
    
        const user_name = localStorage.getItem("username") as string
        //get projects    
        try {
          const response = await fetch(
            `http://13.233.201.77/get_projects?username=${user_name}`,
            {
              method: "GET",
            }
          );
          if (response.status == 200) {
            const json_body = await response.json();
            console.log(json_body)
            setAllProjectList(json_body["project_list"])

            
            
          }else{
            alert("No such user exists")
          }
        } catch (error) {
          alert("Unable to fetch project List")
        }finally{
          
        }  
        //get all users
        try {
            const response = await fetch(
              `http://13.233.201.77/get_all_users`,
              {
                method: "GET",
              }
            );
            if (response.status == 200) {
              const json_body = await response.json();
              console.log(json_body)
              setAllUsersList(json_body["data"])
  
              
              
            }else{
              alert("Some error occuered")
            }
          } catch (error) {
            alert("Unable to fetch User List")
          }finally{
            
          }



      };

      const handleRerender = () => {
        setTriggerRerender((prev) => !prev); // Toggle the state to cause rerender
    };



    useEffect(()=>{
        loadData()

        const user_name=localStorage.getItem("username") as string
        setUsername(user_name)

    },[triggerRerender])
   

    return(<div>
        <Navbar is_parts_table={false} is_admin={username==='epack'?(true):(false)}/>
        <div className="max-w-6xl mx-auto mt-14">
        <div className="flex flex-col zgap-4 mb-5">
          <h1 className="text-4xl font-bold">Admin Panel</h1>
          <div className="grid grid-cols-2 gap-4">
            <RegisterUser refresh_trigger={handleRerender}/>
            <ProjectAssign project_list={allProjectList} user_list={allUsersList} refresh_trigger={handleRerender}/>
            
          </div>
          
        </div>
        </div>
        
        </div>
    )
}