
"use client";
import Navbar from "@/components/Navbar";
import { ProjectSelection } from "@/components/ProjectSelection";
import { UploadFile } from "@/components/UploadFile";
import React, { useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Button } from "@/components/ui/button";

const hardCodedData=[
      
  {"itemDescription":"5NB - 2.5 MM THICK",
    "grade":"210/240/310",
    "weight":1.99
  },
  {"itemDescription":"25NB - 3.2 MM THICK",
    "grade":"210/240/310",
    "weight":2.41
  },
  {"itemDescription":"32NB - 2.6 MM THICK",
    "grade":"210/240/310",
    "weight":2.55
  },
  {"itemDescription":"32 NB- 3.2 MM THICK",
    "grade":"210/240/310",
    "weight":3.25
  },
  {"itemDescription":"40 NB- 3.2MM THICK",
    "grade":"210/240/310",
    "weight":3.56
  },
  {"itemDescription":"40 NB- 4.0 MM THICK",
    "grade":"210/240/310",
    "weight":4.37
  },
  {"itemDescription":"50 NB- 2.9 MM THICK",
    "grade":"210/240/310",
    "weight":4.11
  },
  {"itemDescription":"50 NB- 3.6 MM THICK",
    "grade":"210/240/310",
    "weight":5.04
  },
  {"itemDescription":"50 NB- 4.5 MM THICK",
    "grade":"210/240/310",
    "weight":6.9
  },
  {"itemDescription":"50 NB- 4.8 MM THICK",
    "grade":"210/240/310",
    "weight":6.57
  },


  ]

const Page = () => {
  const [projectList, setProjectList] = useState([]);
  const [username, setUsername] = useState("");
  const [tableData, setTableData] = useState(hardCodedData);

  const loadData = async () => {
    // ... (previous loadData function remains unchanged)
  };

  useEffect(() => {
    const user_name = localStorage.getItem("username") as string;
    setUsername(user_name);
    loadData();
  }, []);

  const columns = [
    {
      accessorKey: "itemDescription",
      header: "ITEMS DESCRIPTION",
    },
    {
      accessorKey: "grade",
      header: "Grade",
    },
    {
      accessorKey: "weight",
      header: "WEIGHT/METER (KG)",
    },
  ];

  const handleCreateUser = (values) => {
    setTableData([...tableData, values]);
  };

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    enableEditing: true,
    onCreatingRowSave: ({ values, table }) => {
      handleCreateUser(values);
      table.setCreatingRow(null);
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Add new Item
      </Button>
    ),
    // ... (other table properties remain unchanged)
  });

  return (
    <div>
      <Navbar is_parts_table={false} is_admin={username === 'epack'} />
      <div className="max-w-6xl mx-auto mt-14">
        <div className="flex flex-col gap-4 mb-5">
          <h1 className="text-4xl font-bold mb-3">Welcome</h1>
          <div className="grid grid-cols-2 gap-4">
            <UploadFile project_list={projectList} />
            <ProjectSelection project_list={projectList} />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold">Inventory Management</h1>
            <div>
              <MaterialReactTable table={table} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;