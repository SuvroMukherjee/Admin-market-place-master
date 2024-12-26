import React, { useEffect, useState } from "react";
import "./widgetSm.css";
import { Visibility } from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from "react-router-dom";
import { AdminSellerLists } from "../../API/api";
import { BsShop } from "react-icons/bs";

export default function WidgetSm({user}) {
    console.log({user})
    const navigate = useNavigate();
    const [sellers,setSellers] = useState([])

    const getAllSellers = async () => {
        try {
            const sellersResponse = await AdminSellerLists();
            setSellers(sellersResponse?.data?.data?.filter((ele) => ele?.status));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAllSellers();
    }, []);

    return (
        <div className="widgetSm">
            <span className="widgetSmTitle">New Joined Members</span>
            <ul className="widgetSmList">
                {user?.length > 0 && user.map((ele,index) => (
                    <li className="widgetSmListItem" key={index}>
                        {/* <img
                            src="https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&dpr=2&w=500"
                            alt=""
                            className="widgetSmImg"
                        /> */}
                        <AccountCircleIcon className="widgetSmImg"  />
                        <div className="widgetSmUser">
                            <span className="widgetSmUsername">{ele?.name}</span>
                            <span className="widgetSmUserTitle">{ele?.role?.name}</span>
                        </div>
                        <button className="widgetSmButton" onClick={() => navigate('/users') }>
                            <Visibility className="widgetSmIcon" />
                            Display
                        </button>
                    </li>
                ))}
                {user?.length === 0 && <li className="widgetSmListItem">No data</li>}
               
            </ul>
            <ul className="widgetSmList">
                {sellers?.length > 0 && sellers.map((ele,index) => (
                    <li className="widgetSmListItem" key={index}>
                        {/* <img
                            src="https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&dpr=2&w=500"
                            alt=""
                            className="widgetSmImg"
                        /> */}
                        <BsShop  className="widgetSmImg"  />
                        <div className="widgetSmUser">
                            <span className="widgetSmUsername">{ele?.user_name}</span>
                            <span className="widgetSmUserTitle">{ele?.Shop_Details_Info?.shope_name}</span>
                        </div>
                        <button className="widgetSmButton" onClick={() => navigate('/SellerManagment') }>
                            <Visibility className="widgetSmIcon" />
                            Display
                        </button>
                    </li>
                ))}
                {sellers?.length === 0 && <li className="widgetSmListItem">No data</li>}
            </ul>
        </div>
    );
}
