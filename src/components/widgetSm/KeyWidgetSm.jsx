import React from "react";
import "./widgetSm.css";
import { Visibility } from "@mui/icons-material";

export default function KeyWidgetSm({ user }) {
    console.log({ user })
    return (
        <div className="widgetSm">
            <span className="widgetSmTitle">New Added Sellers</span>
            <ul className="widgetSmList w-50">
                {user?.map((ele, index) => (
                    <li className="widgetSmListItem" key={index}>
                        <img
                            src={ele?.pic_of_shope?.[0]}
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
