import React from "react";
import "./featuredInfo.css";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { FaBoxOpen } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { CiShop } from "react-icons/ci";

function KeyFeaturedInfo({ seller }) {

    console.log(seller, 'p')

    

    return (
        <div className="featured">
            <div className="featuredItem">
                <span className="featuredTitle">Seller</span>
                <div className="featuredMoneyContainer">
                    <span className="featuredMoney">{seller?.length} <FaUsers /></span>
                    <span className="featuredMoneyRate">
                        {/* -11.4 <ArrowDownwardIcon className="featuredIcon negative" /> */}
                    </span>
                </div>
                {/* <span className="featuredSub">Compared to last month</span> */}
            </div>
            {/* <div className="featuredItem">
                <span className="featuredTitle">Seller</span>
                <div className="featuredMoneyContainer">
                    <span className="featuredMoney">{seller?.length} <FaUsers /></span>
                    <span className="featuredMoneyRate">
                       
                    </span>
                </div>
               
            </div>
            <div className="featuredItem">
                <span className="featuredTitle">Seller</span>
                <div className="featuredMoneyContainer">
                    <span className="featuredMoney">{seller?.length} <FaUsers /></span>
                    <span className="featuredMoneyRate">
                      
                    </span>
                </div>
              
            </div> */}
        </div>
    );
}

export default KeyFeaturedInfo;