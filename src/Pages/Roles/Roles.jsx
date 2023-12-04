import React, { useEffect, useState } from "react";
import "./roles.css";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { userRows } from '../../dummyData';
import { Link } from "react-router-dom";
import { Grid, List, ListItem, ListItemText, TextField, Button } from '@mui/material';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { allRoleList, createRole } from "../../API/api";

export default function Roles() {
    const [roleList, setRoleList] = useState(['Item 1', 'Item 2', 'Item 3']);
    const [inputValue, setInputValue] = useState('');


    useEffect(() => {
        getAllroll()
    }, [])


    async function getAllroll() {
        await allRoleList().then((res) => {
           // console.log('roles', res)npm npm 
            console.log('call')
            setRoleList(res?.data?.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleAddItem = async () => {
        if (inputValue.trim() !== '') {
            let payload = {
                name: inputValue
            }
            await createRole(payload).then((res) => {
                // console.log(res)
                setInputValue('');
                getAllroll()
            }).catch((err) => {
                console.log(err)
            })
        }
    };


    const [data, setData] = useState(userRows);

    const handleDelete = (id) => {
        setData(data.filter((item) => item.id !== id));
    };


    return (
        <div className="userList">
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={6} md={6} style={{ textAlign: 'center' }}>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                       
                        {roleList?.length > 0 && roleList.map((role) => (
                            <>
                            
                             <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary= {role?.name}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {/* {role?.name} */}
                                                </Typography>
                                                {" — I'll be in your neighborhood doing errands this…"}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" /> 
                            </>

                        ))}
                    </List>
                </Grid>
                <Grid item xs={6} md={6} style={{ textAlign: 'center' }}>
                    <TextField
                        label="Add New Role"
                        variant="outlined"
                        fullWidth
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <br />
                    <br />
                    <Button variant="contained" color="primary" onClick={handleAddItem} fullWidth>
                        Save Role
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}

