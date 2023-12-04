import React from "react";
import "./widgetLg.css";
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { CheckCircleOutline, HighlightOff, QueryBuilder } from "@mui/icons-material";

export default function WidgetLg() {
    return (
        <div className="widgetLg">
            <h3 className="widgetLgTitle">Latest transactions</h3>
            <Table className="widgetLgTable">
                <TableHead>
                    <TableRow>
                        <TableCell>Customer</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[1, 2, 3, 4].map((index) => (
                        <TableRow key={index} className="widgetLgTr">
                            <TableCell className="widgetLgUser">
                                <img
                                    src="https://images.pexels.com/photos/4172933/pexels-photo-4172933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                                    alt=""
                                    className="widgetLgImg"
                                />
                                <span className="widgetLgName">Susan Carol</span>
                            </TableCell>
                            <TableCell className="widgetLgDate">2 Jun 2021</TableCell>
                            <TableCell className="widgetLgAmount">$122.00</TableCell>
                            <TableCell className="widgetLgStatus">
                                <Button
                                    startIcon={<CheckCircleOutline />}
                                    className="widgetLgButton Approved"
                                >
                                    Approved
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

