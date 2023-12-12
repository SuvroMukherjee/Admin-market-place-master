import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import { RiUserSettingsFill } from "react-icons/ri"
import { FaUsers } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { MdCategory } from "react-icons/md";
import { IoPricetagsSharp } from "react-icons/io5";
import { FaCartArrowDown } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa6";

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
        icon: <FaUsers />,
        cName: 'nav-text'
    },
    {
        title: 'Category',
        path: '/Admin/category',
        icon: <BiSolidCategory />,
        cName: 'nav-text'
    },
    {
        title: 'Sub Category',
        path: '/Admin/subcategory',
        icon: <MdCategory />,
        cName: 'nav-text'
    },
    {
        title: 'Brand',
        path: '/Admin/brand',
        icon: <IoPricetagsSharp />,
        cName: 'nav-text'
    },
    {
        title: 'Product',
        path: '/Admin/product',
        icon: <FaCartArrowDown />,
        cName: 'nav-text'
    }
]; 