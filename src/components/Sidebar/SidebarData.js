import * as AiIcons from "react-icons/ai";
import { BiSolidCategory } from "react-icons/bi";
import { BsShop } from "react-icons/bs";
import { FaCartArrowDown, FaUsers } from "react-icons/fa";
import { GiVerticalBanner } from "react-icons/gi";
import { IoMdImages } from "react-icons/io";
import { TbBrandAdobe } from "react-icons/tb";
import { MdCategory } from "react-icons/md";
import { RiUserSettingsFill } from "react-icons/ri";
import { VscFeedback } from "react-icons/vsc";
import { IoStatsChart } from "react-icons/io5";
import { MdSell } from "react-icons/md";
import { CgWebsite } from "react-icons/cg";

export const AdminSidebarData = [
  {
    title: "Home",
    path: "/",
    icon: AiIcons.AiFillHome,
    cName: "nav-text",
  },
  {
    title: "Roles",
    path: "/roles",
    icon: RiUserSettingsFill,
    cName: "nav-text",
  },
  {
    title: "Users",
    path: "/users",
    icon: FaUsers,
    cName: "nav-text",
  },
  {
    title: "Sellers",
    path: "/SellerManagment",
    icon: BsShop,
    cName: "nav-text",
  },
  {
    title: `Seller's Product`,
    path: "/SellerProductManagment",
    icon: BsShop,
    cName: "nav-text",
  },
  {
    title: `Seller Report`,
    path: "/SellerReport",
    icon: IoStatsChart,
    cName: "nav-text",
  },
  {
    title: `Best Seller`,
    path: "/BestSeller",
    icon: MdSell,
    cName: "nav-text",
  },
  {
    title: `Ecommerce-Report`,
    path: "/EcommerceReport",
    icon: CgWebsite,
    cName: "nav-text",
  },
  //   {
  //     title: `Seller's Product`,
  //     path: "/SellerProductManagment",
  //     icon: BsShop,
  //     cName: "nav-text",
  //   },
  {
    title: "Category",
    path: "/Admin/category",
    icon: BiSolidCategory,
    cName: "nav-text",
  },
  {
    title: "Sub Category",
    path: "/Admin/subcategory",
    icon: MdCategory,
    cName: "nav-text",
  },
  {
    title: "Brand",
    path: "/Admin/brand",
    icon: TbBrandAdobe,
    cName: "nav-text",
  },
  {
    title: "Product",
    path: "/Admin/product",
    icon: FaCartArrowDown,
    cName: "nav-text",
  },
  {
    title: "Bulk Product",
    path: "/Admin/uploadbulk",
    icon: FaCartArrowDown,
    cName: "nav-text",
  },
  {
    title: "Offers",
    path: "/Admin/product-offer",
    icon: FaCartArrowDown,
    cName: "nav-text",
  },
  {
    title: "Testimonial",
    path: "/Admin/testimonial",
    icon: VscFeedback,
    cName: "nav-text",
  },
  {
    title: "Banner Managment",
    path: "/bannermanagment",
    icon: GiVerticalBanner,
    cName: "nav-text",
  },
  {
    title: "Image Converter", //templete-upload
    path: "/image-convert",
    icon: IoMdImages,
    cName: "nav-text",
  },
  // {
  //   title: "Template Upload",
  //   path: "/templete-upload",
  //   icon: RiFileExcel2Line,
  //   cName: "nav-text",
  // },
];

export const KeyManagerSidebarData = [
  {
    title: "Dashboard",
    path: "/key/dashboard",
    icon: AiIcons.AiFillHome,
    cName: "nav-text",
  },
  {
    title: "Attendance",
    path: "/key/attencdence",
    icon: BsShop,
    cName: "nav-text",
  },
  {
    title: "Seller",
    path: "/key/seller",
    icon: BsShop,
    cName: "nav-text",
  },
];

export const SellerSidebarData = [
  {
    title: "Dashboard",
    path: "/seller/seller-dashboard",
    icon: AiIcons.AiFillHome,
    cName: "nav-text",
  },
  {
    title: "Product List",
    path: "/seller/seller-productList",
    icon: BsShop,
    cName: "nav-text",
  },
  {
    title: "Add Product",
    path: "/seller/seller-addproduct",
    icon: BsShop,
    cName: "nav-text",
  },
  {
    title: "Own Product",
    path: "/seller/seller-ownproduct",
    icon: BsShop,
    cName: "nav-text",
  },
];
