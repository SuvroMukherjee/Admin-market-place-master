import React from "react";
import "./featuredInfo.css";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { FaBoxOpen } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { CiShop } from "react-icons/ci";

export default function FeaturedInfo({ product, user, seller }) {

    console.log(product,'p')

    return (
        <div className="featured">
            <div className="featuredItem">
                <span className="featuredTitle">Staffs</span>
                <div className="featuredMoneyContainer">
                    <span className="featuredMoney">{user?.length} <FaUsers /></span>
                    <span className="featuredMoneyRate">
                        {/* -11.4 <ArrowDownwardIcon className="featuredIcon negative" /> */}
                    </span>
                </div>
                {/* <span className="featuredSub">Compared to last month</span> */}
            </div>
            <div className="featuredItem">
                <span className="featuredTitle">Sellers</span>
                <div className="featuredMoneyContainer">
                    <span className="featuredMoney">{seller?.length} <CiShop/> </span>
                    <span className="featuredMoneyRate">
                        {/* -1.4 <ArrowDownwardIcon className="featuredIcon negative" /> */}
                    </span>
                </div>
                {/* <span className="featuredSub">Compared to last month</span> */}
            </div>
            <div className="featuredItem">
                <span className="featuredTitle">Products</span>
                <div className="featuredMoneyContainer">
                    <span className="featuredMoney">{product?.length} <FaBoxOpen /></span>
                    {/* <span className="featuredMoneyRate">
                        +2.4 <ArrowUpwardIcon className="featuredIcon" />
                    </span> */}
                </div>
                {/* <span className="featuredSub">Compared to last month</span> */}
            </div>
        </div>
    );
}
