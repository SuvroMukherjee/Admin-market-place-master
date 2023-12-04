import React, { useState } from "react";
import "./userlist.css";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { userRows } from '../../dummyData';
import { Link } from "react-router-dom";

export default function UserList() {
    const [data, setData] = useState(userRows);

    const handleDelete = (id) => {
        setData(data.filter((item) => item.id !== id));
    };

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "user",
            headerName: "User",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="userListUser">
                        <img className="userListImg" src={params.row.avatar} alt="" />
                        {params.row.username}
                    </div>
                );
            },
        },
        { field: "email", headerName: "Email", width: 200 },
        { field: "status", headerName: "Status", width: 120 },
        { field: "transaction", headerName: "Transaction Volume", width: 160 },
        {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={"/user/" + params.row.id}>
                            <IconButton size="small" color="primary">
                                Edit
                            </IconButton>
                        </Link>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(params.row.id)}
                        >
                            <DeleteOutline />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    return (
        <div className="userList">
            <DataGrid
                rows={data}
                columns={columns}
                pageSize={8}
                checkboxSelection
                disableSelectionOnClick
            />
        </div>
    );
}
