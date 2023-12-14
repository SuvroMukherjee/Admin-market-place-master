import React from "react";
import "./widgetLg.css";
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { CheckCircleOutline, HighlightOff, QueryBuilder } from "@mui/icons-material";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

export default function WidgetLg({product}) {
    console.log({product})
    return (
        <div className="widgetLg">
            <h3 className="widgetLgTitle">Latest Products</h3>
            <Table className="widgetLgTable">
                <TableHead>
                    <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Sub Category</TableCell>
                        <TableCell>Amount</TableCell>
                        {/* <TableCell>Status</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {product?.length > 0 && product.map((ele,index) => (
                        <TableRow key={index} className="widgetLgTr">
                            <TableCell className="widgetLgUser">
                                <img
                                    src={ele?.image?.[0]}
                                    alt=""
                                    className="widgetLgImg"
                                />
                                <span className="widgetLgName">{ele?.name}</span>
                            </TableCell>
                            <TableCell className="widgetLgDate">{ele?.categoryId?.title}</TableCell>
                            <TableCell className="widgetLgDate">{ele?.subcategoryId?.title}</TableCell>
                            {/* <TableCell className="widgetLgAmount"></TableCell> */}
                            <TableCell className="widgetLgStatus">
                                <Button
                                    startIcon={<CurrencyRupeeIcon style={{border:'1px solid',borderRadius:'50px'}}/>}
                                    className="widgetLgButton Approved"
                                    style={{fontWeight:'bold'}}
                                >
                                    {ele?.regular_price}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

