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
import Button from '@mui/material/Button';
import cmp from '../../../assets/cmp.png'
import { FaUserCircle } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";

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
            <AppBar position="static" onClick={() => navigate('/seller/seller-dashboard')} className='sellerheader'>
                <Toolbar>
                    <IconButton onClick={toggleDrawer} edge="start" color="inherit" aria-label="menu">
                        <IoIosMenu size={20}/>
                    </IconButton>
                    <Typography  variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <img src={cmp} width={150} /> <span style={{ fontSize: '12px',letterSpacing:'1px',textTransform:'uppercase',fontWeight:'bold', }}><strong>Seller central</strong></span>
                    </Typography>
                    {/* <Button color="inherit" style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Sign In as  */}
                    <FaUserCircle size={25}/>
                    <span style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#0766AD', fontWeight: 'bold', color:'#FF9843' }}>{auth?.email}</span>
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
                                <ListItemButton onClick={toggleDrawer}>
                                    <ListItemIcon>
                                        <MdCancel size={20}/>
                                    </ListItemIcon>
                                    <ListItemText primary={"Menu"} />
                                </ListItemButton>

                            </ListItem>
                        </ListItem>
                        <Divider />
                        
                            <ListItem  >
                                <ListItemButton onClick={handleMenuClick}>
                                    {/* <ListItemIcon>
                                        <InboxIcon/>
                                    </ListItemIcon> */}
                                    <ListItemText primary={"Catalogue"} />
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
                        
                       
                            <ListItem >
                                <ListItemButton onClick={handleMenuClick2}>
                                    {/* <ListItemIcon>
                                        <InboxIcon />
                                    </ListItemIcon> */}
                                    <ListItemText primary={"Inventory"} />
                                </ListItemButton>

                            </ListItem>
                            <Menu
                                anchorEl={menuAnchor2}
                                open={Boolean(menuAnchor2)}
                                onClose={handleMenuClose2}
                            >
                                <MenuItem onClick={() => { navigate('/seller/seller-productList'); handleMenuClose() }}>Manage All Inventory</MenuItem>
                            </Menu>
                        
                        <ListItem >
                            <Divider />
                            <ListItem >
                                <ListItemButton onClick={() => logout()}>
                                    {/* <ListItemIcon>
                                        <FaUnlockAlt />
                                    </ListItemIcon> */}
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
