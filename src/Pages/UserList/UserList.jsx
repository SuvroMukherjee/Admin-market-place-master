import React, { useEffect, useState } from "react";
import "./userlist.css";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { userRows } from '../../dummyData';
import { Link } from "react-router-dom";
import { AdminCreateUserList } from "../../API/api";

export default function UserList() {
    const [data, setData] = useState([]);

    useEffect(() => {
        getUserList();
    }, [])

    async function getUserList() {
        await AdminCreateUserList().then((res) => {
            console.log(res?.data)
            const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
                ...item,
                id: index + 1, // Generate a unique ID
            }));
            setData(dataWithUniqueIds)
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleDelete = (id) => {
        setData(data.filter((item) => item.id !== id));
    };

    const columns = [
        { field: "id", headerName: "SL No", width: 90 },
        {
            field: "user",
            headerName: "User",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="userListUser">
                        {params?.row?.name}
                    </div>
                );
            },
        },
        { field: "email", headerName: "Email", width: 200 },
        {
            field: "role", headerName: "Role", width: 200, renderCell: (params) => {
                return (
                    <div className="userListUser">
                        {params?.row?.role?.name}
                    </div>
                );
            }
        },
        { field: "status", headerName: "Active", width: 160 },
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
