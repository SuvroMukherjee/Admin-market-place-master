import React from "react";
import "./widgetLg.css";
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { CheckCircleOutline, HighlightOff, QueryBuilder } from "@mui/icons-material";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

export default function WidgetLg({ product }) {
    console.log({ product })
    return (
        <div className="widgetLg">
            <h3 className="widgetLgTitle">Latest Products</h3>
            <Table className="widgetLgTable">
                <TableHead>
                    <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Sub Category</TableCell>
                        <TableCell>Brand</TableCell>
                        {/* <TableCell>Status</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {product?.length > 0 && product?.slice(0,15).map((ele, index) => (
                        <TableRow key={index} className="widgetLgTr">
                            <TableCell className="widgetLgUser flex">
                                <img
                                    src={ele?.image?.[0]?.image_path}
                                    alt=""
                                    className="widgetLgImg "
                                    style={{objectFit:'contain'}}
                                />
                                {console.log({ ele })}
                                <span className="widgetLgName d-flex align-items-center">{ele?.name}</span>
                            </TableCell>
                            <TableCell className="widgetLgDate">
                                <img src={ele?.categoryId?.image?.[0]?.image_path} width={40} height={40} />
                            </TableCell>
                            <TableCell className="widgetLgDate">
                                < img src={ele?.subcategoryId?.image?.[0]?.image_path} width={40} height={40} />
                            </TableCell>
                            {/* <TableCell className="widgetLgAmount"></TableCell> */}
                            <TableCell className="widgetLgDate" style={{objectFit:'contain'}}>

                                <img src={ele?.brandId?.image?.[0]?.image_path} width={40} height={40} />

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

