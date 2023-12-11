import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import { RiUserSettingsFill } from "react-icons/ri"



export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
    {
        title: 'Roles',
        path: '/roles',
        icon: <RiUserSettingsFill />,
        cName: 'nav-text'
    },
    {
        title: 'Users',
        path: '/users',
        icon: <FaIcons.FaCartPlus />,
        cName: 'nav-text'
    },
    {
        title: 'Category',
        path: '/Admin/category',
        icon: <IoIcons.IoMdPeople />,
        cName: 'nav-text'
    },
    {
        title: 'Sub Category',
        path: '/Admin/subcategory',
        icon: <FaIcons.FaEnvelopeOpenText />,
        cName: 'nav-text'
    },
    {
        title: 'Brand',
        path: '/Admin/brand',
        icon: <IoIcons.IoMdHelpCircle />,
        cName: 'nav-text'
    },
    {
        title: 'Product',
        path: '/Admin/product',
        icon: <IoIcons.IoMdHelpCircle />,
        cName: 'nav-text'
    }
]; 