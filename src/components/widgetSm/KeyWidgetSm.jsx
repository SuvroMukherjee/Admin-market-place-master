import React from "react";
import "./widgetSm.css";
import { Visibility } from "@mui/icons-material";

export default function KeyWidgetSm({ user }) {
    console.log({ user })
    return (
        <div className="widgetSm">
            <span className="widgetSmTitle">New Added Sellers</span>
            <ul className="widgetSmList">
                {user?.map((ele, index) => (
                    <li className="widgetSmListItem" key={index}>
                        <img
                            src="https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&dpr=2&w=500"
                            alt=""
                            className="widgetSmImg"
                        />
                        <div className="widgetSmUser">
                            <span className="widgetSmUsername">{ele?.email}</span>
                            <span className="widgetSmUserTitle">{ele?.phone_no}</span>
                        </div>
                        <button className="widgetSmButton">
                            <Visibility className="widgetSmIcon" />
                            {ele?.status}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
