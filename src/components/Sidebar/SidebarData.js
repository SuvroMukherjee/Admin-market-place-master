import * as AiIcons from 'react-icons/ai';
import { BiSolidCategory } from 'react-icons/bi';
import { FaCartArrowDown, FaUsers } from 'react-icons/fa';
import { IoPricetagsSharp } from 'react-icons/io5';
import { MdCategory } from 'react-icons/md';
import { RiUserSettingsFill } from 'react-icons/ri';
import { BsShop } from "react-icons/bs";

export const AdminSidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: AiIcons.AiFillHome,
        cName: 'nav-text'
    },
    {
        title: 'Roles',
        path: '/roles',
        icon: RiUserSettingsFill,
        cName: 'nav-text'
    },
    {
        title: 'Users',
        path: '/users',
        icon: FaUsers,
        cName: 'nav-text'
    },
    {
        title: 'Sellers',
        path: '/SellerManagment',
        icon:  BsShop,
        cName: 'nav-text'
    },
    {
        title: 'Category',
        path: '/Admin/category',
        icon: BiSolidCategory,
        cName: 'nav-text'
    },
    {
        title: 'Sub Category',
        path: '/Admin/subcategory',
        icon: MdCategory,
        cName: 'nav-text'
    },
    {
        title: 'Brand',
        path: '/Admin/brand',
        icon: IoPricetagsSharp,
        cName: 'nav-text'
    },
    {
        title: 'Product',
        path: '/Admin/product',
        icon: FaCartArrowDown,
        cName: 'nav-text'
    }
];

export const KeyManagerSidebarData = [
    {
        title: 'Dashboard',
        path: '/key/dashboard',
        icon: AiIcons.AiFillHome,
        cName: 'nav-text'
    },
    {
        title: 'Seller',
        path: '/key/seller',
        icon: BsShop,
        cName: 'nav-text'
    }
];
