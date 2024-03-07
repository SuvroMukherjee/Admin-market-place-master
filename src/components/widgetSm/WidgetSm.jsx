import React from "react";
import "./widgetSm.css";
import { Visibility } from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function WidgetSm({user}) {
    console.log({user})
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
                        <button className="widgetSmButton">
                            <Visibility className="widgetSmIcon" />
                            Display
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
