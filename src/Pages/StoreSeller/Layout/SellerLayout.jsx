import { AppBar, Box, Drawer, List, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
// import Dropdown from 'react-bootstrap/Dropdown';
import { Col, Dropdown } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import { FaUserCircle } from "react-icons/fa";
import { GoArrowUpRight } from "react-icons/go";
import { MdCancel } from "react-icons/md";
import { Outlet, useNavigate } from 'react-router-dom';
// import cmp from '../../../assets/newlogo.png';
import newlogo from '../../../assets/newlogo.png'
import useAuth from '../../../hooks/useAuth';
import { FaBars } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";



const MyNavbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { auth, logout } = useAuth();
    const [HeaderTitle, setHeaderTitle] = useState('Seller Dashboard')

    console.log({ auth })

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
        height: 'vh',
        background: 'black'
    };

    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const handleDropdownToggle = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleDropdownClose = () => {
        setDropdownOpen(false);
    };

    const navigateToChange = () => {
        navigate('/seller/reset')
    }

    ///seller/brand-request/

    const navigateFunction = (pathName) => {

        switch (pathName) {
            case 'Seller Dashboard':
                navigate('/seller/seller-dashboard');
                setHeaderTitle(pathName);
                break;
            case 'Add Product':
                navigate('/seller/seller-addproduct')
                setHeaderTitle(pathName);
                break;
            case 'Product Request':
                navigate('/seller/seller-ownproduct-status/new-add')
                setHeaderTitle(pathName);
                break;
            case 'Brand Request':
                navigate('/seller/brand-request/')
                setHeaderTitle(pathName);
                break;
            case 'Category Request':
                navigate('/seller/category-request/')
                setHeaderTitle(pathName);
                break;
            case 'Category Request':
                navigate('/seller/category-request/')
                setHeaderTitle(pathName);
                break;
            case 'Application lists':
                navigate('/seller/approval-request-list/')
                setHeaderTitle(pathName);
                break;
            case 'Inventory Manage':
                navigate('/seller/seller-productList')
                setHeaderTitle(pathName);
                break;
            case 'Recent Order List':
                navigate('/seller/seller-orderlist')
                setHeaderTitle(pathName);
                break;
            case 'Manage Orders':
                navigate('/seller/manage-orders')
                setHeaderTitle(pathName);
                break;
            case 'Customer Feedback':
                navigate('/seller/customer-feedback')
                setHeaderTitle(pathName);
                break;
            case 'Service Feedback':
                navigate('/seller/service-feedback')
                setHeaderTitle(pathName);
                break;
        }
    }

    console.log({auth})

    return (
        <div>

            {/* AppBar for the top section */}
            {/* <AppBar position="static"  className='sellerheader'>
                <Toolbar>
                   
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => navigate('/seller/seller-dashboard')}>
                        <img src={newlogo} width={100} /> <span className='mx-4' style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 'bold', }}><strong>Seller central</strong></span>
                    </Typography>
                        <div onClick={handleDropdownToggle}>
                            <FaUserCircle size={25} />
                        </div>
                        <Dropdown show={isDropdownOpen} onClose={handleDropdownClose}>
                            <Dropdown.Menu>
                               <Dropdown.Item onClick={() => navigate('/seller/reset')}>Change Passowrd</Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate('/seller/profile')}>Update Profile</Dropdown.Item>
                               
                                <Dropdown.Item onClick={() => logout()}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    <span style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 'bold', color: '#FF9843' }}>{auth?.email}</span>
                </Toolbar>
            </AppBar> */}



            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer} className='sidebatsellerBoard'>
                {/* <Box
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
                                  
                                    <ListItemText primary={"logout"} />
                                </ListItemButton>

                            </ListItem>
                        </ListItem>
                    </List>
                </Box> */}
                <Row >
                    <Col className='p-4 mx-4 sidebarHeader text-left' style={{ cursor: 'pointer' }} onClick={toggleDrawer}>
                        <MdCancel size={20} /> <span>Close</span>
                    </Col>
                </Row>
                <Row>
                    <div className='sellSide mt-4 mb-4'>
                        <Col className='p-2 mx-2 text-left boldtext' onClick={() => navigateFunction('Seller Dashboard')}>
                            Home
                        </Col>
                        <Col className='p-2 mx-2 text-left boldtext' onClick={() => navigateFunction('Add Product')}>
                            Add Products
                        </Col>
                        <Col className='p-2 mx-2 text-left boldtext' onClick={() => navigateFunction('Product Request')}>
                            Request New Product
                        </Col>
                        <Col className='p-2 mx-2 text-left boldtext' onClick={() => navigateFunction('Brand Request')}>
                            Brand Request
                        </Col>
                        <Col className='p-2 mx-2 text-left boldtext' onClick={() => navigateFunction('Category Request')}>
                            Category Request
                        </Col>
                        <Col className='p-2 mx-2 text-left boldtext' onClick={() => navigateFunction('Application List')}>
                            View Applications
                        </Col>
                        <Col className='p-2 mx-2 text-left boldtext' onClick={() => navigateFunction('Inventory Manage')}>
                            Manage Inventory
                        </Col>
                        <Col className='p-2 mx-2 text-left boldtext' onClick={() => navigateFunction('Recent Order List')}>
                            Orders Lists
                        </Col>
                        <Col className='p-2 mx-2 text-left boldtext' onClick={() => navigateFunction('Manage Orders')}>
                            Manage Orders
                        </Col>
                        <Col className='p-2 mx-2 text-left boldtext' onClick={() => navigateFunction('Customer Feedback')}>
                            Customer Feedback
                        </Col>
                        <Col className='p-2 mx-2 text-left boldtext' onClick={() => navigateFunction('Service Feedback')}>
                            Service Feedback
                        </Col>
                    </div>
                </Row>
            </Drawer>

            

            <Navbar expand="lg" >

                {/* <Col xs={1} className='text-center' onClick={() => toggleDrawer()} style={{cursor:'pointer'}}>
                    <FaBars color='white' size={25} />
                </Col>
                <Col xs={4} style={{ color: '#9af064', fontWeight: '500', textTransform: 'uppercase', fontSize: '26px', letterSpacing: '1px' }}><img src={newlogo} alt='' width={80} /> <span className='mx-2' style={{ color: 'rgb(193 240 1 / 98%)', fontWeight: '500', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>{HeaderTitle}</span></Col>
                <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}

                <Col>
                    <Row>
                        <Col>
                            <Row xs={8}> 
                                <Col className='d-flex align-items-center justify-content-center' onClick={() => toggleDrawer()} style={{ cursor: 'pointer' }} xs={1}>
                                    <FaBars color='white' size={20} />
                                </Col>
                                <Col xs={6} className='d-flex align-items-end justify-content-start'>
                                    <span>
                                        <img src={newlogo} alt='' width={100} height={40} />
                                    </span>
                                    <span className='mx-3'>
                                        <Col className='d-flex align-items-center justify-content-center sidebarHeaderName'>{HeaderTitle}</Col>
                                    </span>
                                </Col>
                                
                            </Row>
                        </Col>
                        <Col xs={3}>
                            <Row>
                                <Col className='' xs={1}>
                                    <IoSettings color='grey' size={30} />
                                </Col>
                                <Col >
                                    <span><FaUserCircle color='white' size={25} /></span> <span style={{color:'green'}}>{auth?.email}</span>
                                </Col>
                            </Row> 
                        </Col>
                    </Row>
                </Col>


            </Navbar>



            {/* <Navbar expand="lg" className="" style={navbarStyle}>
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


                            <NavDropdown title="Customer feedback" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => navigate('/seller/customer-feedback')}>Selling Product <GoArrowUpRight size={20} /> </NavDropdown.Item>
                                <Dropdown.Divider />
                                <NavDropdown.Item onClick={() => navigate('/seller/service-feedback')}>Services <GoArrowUpRight size={20} /> </NavDropdown.Item>
                            </NavDropdown>

                        </Nav>
                    </Navbar.Collapse>

                </Container>

            </Navbar> */}
            {/* <p onClick={() => navigate('/seller/reset')}></p> */}
            <Outlet />
        </div>
    );
};

export default MyNavbar;
