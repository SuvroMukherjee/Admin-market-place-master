import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, Box, List, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';
import { FaUnlockAlt } from 'react-icons/fa';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Outlet } from 'react-router-dom'
import { SellerSidebarData } from '../../../components/Sidebar/SidebarData';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import useAuth from '../../../hooks/useAuth';
import { MdCancel } from "react-icons/md";

const MyNavbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { auth, logout } = useAuth();

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const navigate = useNavigate()

    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuAnchor2, setMenuAnchor2] = useState(null);

    const handleMenuClick = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleMenuClick2 = (event) => {
        setMenuAnchor2(event.currentTarget);
    };

    const handleMenuClose2 = () => {
        setMenuAnchor2(null);
    };
    

    return (
        <div>
            {/* AppBar for the top section */}
            <AppBar position="static">
                <Toolbar>
                    <IconButton onClick={toggleDrawer} edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div">
                        Sant Sales <span className='titlename'>Seller central</span>
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Drawer for the bottom section */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                <Box
                    sx={250}
                    role="presentation"
                >
                    <List>
                        <ListItem >
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <MdCancel size={28}/>
                                    </ListItemIcon>
                                    <ListItemText primary={"MENU"} />
                                </ListItemButton>

                            </ListItem>
                        </ListItem>
                        <Divider />
                        <ListItem > 
                            <ListItem  disablePadding>
                                <ListItemButton onClick={handleMenuClick}>
                                    <ListItemIcon>
                                        <InboxIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={"catalogue"} />
                                </ListItemButton>

                            </ListItem>
                            <Menu
                                anchorEl={menuAnchor}
                                open={Boolean(menuAnchor)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={() => { navigate('/seller/seller-addproduct');handleMenuClose()}}>Add product</MenuItem>
                                <MenuItem onClick={handleMenuClose}>Option 2</MenuItem>
                                <MenuItem onClick={handleMenuClose}>Option 3</MenuItem>
                            </Menu>
                        </ListItem>
                        <ListItem >
                            <ListItem disablePadding>
                                <ListItemButton onClick={handleMenuClick2}>
                                    <ListItemIcon>
                                        <InboxIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={"Inventory"} />
                                </ListItemButton>

                            </ListItem>
                            <Menu
                                anchorEl={menuAnchor2}
                                open={Boolean(menuAnchor2)}
                                onClose={handleMenuClose2}
                            >
                                <MenuItem onClick={() => { navigate('/seller/seller-productList'); handleMenuClose() }}>Manage All Inventory</MenuItem>
                                {/* <MenuItem onClick={handleMenuClose}>Option 2</MenuItem>
                                <MenuItem onClick={handleMenuClose}>Option 3</MenuItem> */}
                            </Menu>
                        </ListItem>
                        <ListItem >
                            <ListItem disablePadding>

                                <ListItemButton onClick={() => logout()}>
                                    <ListItemIcon>
                                        <FaUnlockAlt />
                                    </ListItemIcon>
                                    <ListItemText primary={"logout"} />
                                </ListItemButton>

                            </ListItem>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            <Outlet />
        </div>
    );
};

export default MyNavbar;
