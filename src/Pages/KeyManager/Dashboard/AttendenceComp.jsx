import { useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { productRows } from "../../../dummyData";
import "../Seller/listStyle.css";
import { UpdateSellerStatus, allSellerList, attendenceList } from "../../../API/api";
import { useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Button, Col, Container, Row, ButtonGroup } from 'react-bootstrap';
import { DataGrid } from "@mui/x-data-grid";
import { RiEdit2Line } from "react-icons/ri";
import { width } from "@mui/system";
import { calculateTimeDifference, getDayOfWeek, splitDateTime } from "../../../common/DateFormat";



export default function AttendenceComp() {
    const [attendenceadata, setAttendencedata] = useState();
    const [loading, setLoading] = useState(true)

    const userId = JSON.parse(localStorage.getItem('auth'))?.userId;

    const getAttendenceList = async (userId) => {
        const response = await attendenceList(userId);
        console.log(response, 'getAttendenceList');
        const dataWithUniqueIds = response?.data?.data?.map((item, index) => ({
            ...item,
            id: index + 1,
        }));
        setAttendencedata(dataWithUniqueIds)
        setLoading(false)
    };

    useEffect(() => {
        getAttendenceList(userId);
    }, [])

    const columns = [
        { field: "id", headerName: "ID", width: 50 },
        {
            field: "date",
            headerName: 'Date',
            width: 100,
            renderCell: (params) => {
                return (
                    <div>
                        {params?.row?.log_in_time}
                        {/* <span className="loglocation">{splitDateTime(params?.row?.log_in_time)?.date}</span> */}
                    </div>
                );
            }
        },
        {
            field: "day",
            headerName: 'Day',
            width: 100,
            renderCell: (params) => {
                return (
                    <div>
                        {params?.row?.log_in_time}
                        {/* <span className="loglocation">{getDayOfWeek(splitDateTime(params?.row?.log_in_time)?.date)}</span> */}
                    </div>
                );
            }
        },
        {
            field: "log_in_time",
            headerName: 'Login Time',
            width: 100,
            renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params?.row?.log_in_time}
                        {/* <span className="loginT">{splitDateTime(params?.row?.log_in_time)?.time}</span> */}
                    </div>
                );
            }
        },
        {
            field: "log_in_loce",
            headerName: "Login Location",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="productListItem">
                      
                        <span className="loglocation">{params?.row?.log_in_loc?.location},{params?.row?.log_in_loc?.city},{params?.row?.log_in_loc?.state}</span>
                    </div>
                );
            }
        },
        {
            field: "log_out_time",
            headerName: "Logout time",
            width: 100,
            renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params?.row?.log_out_time && 
                            <span className="logoutT">{splitDateTime(params?.row?.log_out_time)?.time}</span>}
                    </div>
                );
            }
        },
        {
            field: "log_out_loc",
            headerName: "Logout Location",
            width: 220,
            renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params?.row?.log_out_time && 
                            <span className="loglocation"> {params?.row?.log_out_loc?.location},{params?.row?.log_out_loc?.city},{params?.row?.log_out_loc?.state}</span>}
                    </div>
                );
            }
        },
        {
            field: "duration",
            headerName: "Work Log",
            width: 250,
            renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params?.row?.log_out_time && 
                            <span className="duraT">{calculateTimeDifference(params?.row?.log_out_time, params?.row?.log_in_time)}</span>}
                    </div>
                );
            }
        }

    ];


    return (
        <>
            {loading ? 
                <div className="productList mt-2 p-4 contentLoader">
                    <Row>
                        <Col>
                            <Spinner animation="border" size="lg" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                </div>:  
            <div className="productList mt-2 p-4">
                <Container>
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <h3>Attendence Report</h3>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col>
                            <DataGrid
                                style={{ height: 400, width: '100%' }}
                                rows={attendenceadata}
                                columns={columns}
                                pageSize={8}
                                noRowsOverlay={
                                    attendenceadata?.length == 0 && <div style={{ textAlign: 'center', padding: '20px' }}>No Data Found</div>
                                }
                            />
                        </Col>
                    </Row>
                </Container>
                <Toaster position="top-right" />
            </div> }
        </>


    );
}
