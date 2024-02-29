import { AppBar, Box, Drawer, IconButton, List, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
// import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import { FaUserCircle } from "react-icons/fa";
import { GoArrowUpRight } from "react-icons/go";
import { IoIosMenu } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { Outlet, useNavigate } from 'react-router-dom';
import cmp from '../../../assets/cmp.png';
import useAuth from '../../../hooks/useAuth';
import { Dropdown, DropdownButton } from 'react-bootstrap';

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

    const navbarStyle = {
        paddingLeft: '0px', // Adjust the left padding
        paddingRight: '10px', // Adjust the right padding
        height: '7vh',
        background: 'black'
    };

    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const handleDropdownToggle = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleDropdownClose = () => {
        setDropdownOpen(false);
    };

    const navigateToChange = () =>{ 
        navigate('/seller/reset')
    }

    return (
        <div>
            {/* AppBar for the top section */}
            <AppBar position="static"  className='sellerheader'>
                <Toolbar>
                    <IconButton onClick={toggleDrawer} edge="start" color="inherit" aria-label="menu">
                        <IoIosMenu size={20} />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => navigate('/seller/seller-dashboard')}>
                        <img src={cmp} width={150} /> <span style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 'bold', }}><strong>Seller central</strong></span>
                    </Typography>
                    {/* <Button color="inherit" style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Sign In as  */}
                    
                        {/* FaUserCircle icon that opens/closes the dropdown */}
                        <div onClick={handleDropdownToggle}>
                            <FaUserCircle size={25} />
                        </div>
                       
                        {/* Dropdown content */}
                        <Dropdown show={isDropdownOpen} onClose={handleDropdownClose}>
                            <Dropdown.Menu>
                               <Dropdown.Item onClick={() => navigate('/seller/reset')}>Change Passowrd</Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate('/seller/profile')}>Update Profile</Dropdown.Item>
                                {/* <Dropdown.Item onClick={() => navigate('/seller/changepassword')}>Another action</Dropdown.Item> */}
                                <Dropdown.Item onClick={() => logout()}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* Your other content goes here */}
                    
                    <span style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 'bold', color: '#FF9843' }}>{auth?.email}</span>
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
                                        <MdCancel size={20} />
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
                            <MenuItem onClick={() => { navigate('/seller/seller-addproduct'); handleMenuClose() }}>Add product</MenuItem>
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

            <Navbar expand="lg" className="" style={navbarStyle}>
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ background: 'black' }} />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link onClick={() => navigate('/seller/seller-dashboard')} className='dtext'>Home</Nav.Link>
                            <NavDropdown title="Catalogue" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => navigate('/seller/seller-addproduct')}>Add Product <GoArrowUpRight size={20} /> </NavDropdown.Item>
                                <Dropdown.Divider />
                                <NavDropdown.Item onClick={() => navigate('/seller/seller-ownproduct-status')}>Sell Your Product <GoArrowUpRight size={20} /> </NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Inventory" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => navigate('/seller/seller-productList')}>Manage Inventory <GoArrowUpRight size={20} /> </NavDropdown.Item>
                                <Dropdown.Divider />
                            </NavDropdown>
                            <NavDropdown title="Orders" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => navigate('/seller/seller-orderlist')}>Orders Lists <GoArrowUpRight size={20} /> </NavDropdown.Item>
                                <Dropdown.Divider />
                                <NavDropdown.Item onClick={() => navigate('/seller/manage-orders')}>Manage Orders <GoArrowUpRight size={20} /> </NavDropdown.Item>
                            </NavDropdown>
                            {/* <Nav.Link onClick={() => navigate('/seller/seller-orderlist')}>Orders</Nav.Link> */}
                            <Nav.Link onClick={() => navigate('/seller/customer-feedback')}>Customer Feedback</Nav.Link>
                           
                        </Nav>
                    </Navbar.Collapse>
                  
                </Container>
                
            </Navbar>
            <p onClick={() => navigate('/seller/reset')}></p>
            <Outlet />
        </div>
    );
};

export default MyNavbar;
