import { AppBar, Box, Drawer, List, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React, { useEffect, useState } from 'react';
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
import newlogo from '../../../assets/zoofilogo.png'
import useAuth from '../../../hooks/useAuth';
import { FaBars } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { sellerDetails } from '../../../API/api';



const MyNavbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { auth, logout } = useAuth();
    const [HeaderTitle, setHeaderTitle] = useState('Seller Dashboard')
    const [userInfo,setUserInfo] = useState();

    useEffect(() => {
        if (auth) {
            getProfileData()
        }
    }, [])

    async function getProfileData() {
        let res = await sellerDetails(auth?.userId)
        const { password, ...filteredData } = res?.data?.data;
        console.log(filteredData,'ss')
        setUserInfo(filteredData)
    }

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const navigate = useNavigate()

    // const [menuAnchor, setMenuAnchor] = useState(null);
    // const [menuAnchor2, setMenuAnchor2] = useState(null);

    // const handleMenuClick = (event) => {
    //     setMenuAnchor(event.currentTarget);
    // };

    // const handleMenuClose = () => {
    //     setMenuAnchor(null);
    // };

    // const handleMenuClick2 = (event) => {
    //     setMenuAnchor2(event.currentTarget);
    // };

    // const handleMenuClose2 = () => {
    //     setMenuAnchor2(null);
    // };

    // const navbarStyle = {
    //     height: '18vh',
    // };

    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const handleDropdownToggle = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleDropdownClose = () => {
        setDropdownOpen(false);
    };


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

    return (
        <div>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer} className='sidebatsellerBoard'>
                <Row>
                    <div className='sellSide mt-4 mb-4'>
                        <Col className='p-2 mx-2 text-left boldtext clos'  onClick={toggleDrawer}>
                            <MdCancel size={20} /> <span className='mx-1'>Close</span>
                        </Col>
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



            <Navbar expand="lg">
                <Col>
                    <Row className='d-flex justify-content-center align-items-center'>
                        <Col xs={8}>
                            <Row>
                                <Col className='d-flex justify-content-center align-items-center' xs={1} onClick={() => toggleDrawer()} style={{ cursor: 'pointer' }}>
                                    <FaBars color='white' size={20} />
                                </Col>
                                <Col xs={2} onClick={() => navigateFunction('Seller Dashboard')}>
                                    <img src={newlogo} alt='zoofi seller' width={120}  />
                                </Col>
                                <Col xs={3} className='d-flex align-items-center justify-content-center sidebarHeaderName'>
                                    {HeaderTitle}
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Dropdown show={isDropdownOpen} onClose={handleDropdownClose}>
                                <Dropdown.Menu className='dropdownMenus'>
                                    <Dropdown.Item onClick={() => navigate('/seller/reset')}>Change Passowrd</Dropdown.Item>
                                    <Dropdown.Item onClick={() => navigate('/seller/profile')}>Update Profile</Dropdown.Item>
                                    <Dropdown.Item onClick={() => logout()}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Row>
                                <Col></Col>
                                <Col style={{ cursor: 'pointer' }} xs={2} onClick={handleDropdownToggle}>
                                    <IoSettings color='white' size={25} /> <span><IoMdArrowDropdown color='#9af064' /></span>
                                </Col>
                                
                                <Col className='d-flex justify-content-center'  >
                                    <span><FaUserCircle color='#9af064' size={30} /></span> <span style={{ color:'white' }} className='mx-2'>{userInfo?.shope_name}</span>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Navbar>
            <Outlet />
        </div>
    );
};



export default MyNavbar;
