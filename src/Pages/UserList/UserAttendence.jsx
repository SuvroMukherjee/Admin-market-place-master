import { useState } from "react";
// import "../Seller/listStyle.css";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { useEffect } from "react";
import { Col, Container, Row } from 'react-bootstrap';
import { attendenceList } from "../../API/api";
import { calculateTimeDifference } from "../../common/DateFormat";


function UserAttendence({ userId }) {
    const [attendenceadata, setAttendencedata] = useState();
    const [loading, setLoading] = useState(true)

    //const userId = JSON.parse(localStorage.getItem('auth'))?.userId;

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
        // { field: "id", headerName: "ID", width: 50 },
        {
            field: "date",
            headerName: 'Date',
            width: 100,
            renderCell: (params) => {
                return (
                    <div>
                        {/* {params?.row?.log_in_time} */}
                        <span className="loglocation">{params?.row?.log_in_time ? formatDate(params?.row?.log_in_time) : ''}</span>
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

                        <span className="loglocation">{params?.row?.log_in_time ? new Date(params?.row?.log_in_time).toLocaleDateString('en-US', { weekday: 'long' }) : ''}</span>
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

                        <span className="loginT">{params?.row?.log_in_time?.slice(11, 16)}</span>
                    </div>
                );
            }
        },
        {
            field: "log_in_loce",
            headerName: "Login Location",
            width: 250,
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
                            <span className="logoutT">{params?.row?.log_out_time?.slice(11, 16)}</span>}
                    </div>
                );
            }
        },
        {
            field: "log_out_day",
            headerName: "Logout Day",
            width: 100,
            renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params?.row?.log_out_time &&
                            <span className="logoutT">{params?.row?.log_out_time ? new Date(params?.row?.log_out_time).toLocaleDateString('en-US', { weekday: 'long' }) : ''}</span>}
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

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarExport />
            </GridToolbarContainer>
        );
    }


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return '';
        }
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}-${month < 10 ? '0' + month : month}-${year}`;
    };

    // Calculate difference between two times
    const getTimeDifference = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTim1234546e);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return '';
        }
        const diff = end.getTime() - start.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    // Extract relevant data
    const { log_in_time, log_in_loc, log_out_time, log_out_loc } = attendenceadata || {};

    // Calculate date and day for login and logout times if data exists
    const loginDate = log_in_time ? formatDate(log_in_time) : '';
    const loginDay = log_in_time ? new Date(log_in_time).toLocaleDateString('en-US', { weekday: 'long' }) : '';
    const logoutDate = log_out_time ? formatDate(log_out_time) : '';
    const logoutDay = log_out_time ? new Date(log_out_time).toLocaleDateString('en-US', { weekday: 'long' }) : '';

    // Calculate time difference if login and logout times exist
    const timeDiff = log_in_time && log_out_time ? getTimeDifference(log_in_time, log_out_time) : '';

    // Create table data if all necessary data exists
    let tableData = [];
    if (loginDate && loginDay && logoutDate && logoutDay && timeDiff) {
        tableData = [
            [loginDate, loginDay, log_in_time.slice(11, 16), log_in_loc?.location, log_out_time.slice(11, 16), log_out_loc?.location, timeDiff]
        ];
    }


    return (
        <>

            <Container>
                <Row className="justify-content-md-center">
                    <Col>
                        {attendenceadata &&
                            <DataGrid
                                style={{ height: 400, width: '100%' }}
                                rows={attendenceadata}
                                columns={columns}
                                pageSize={8}
                                slots={{
                                    toolbar: CustomToolbar,
                                }}
                                noRowsOverlay={
                                    attendenceadata?.length == 0 && <div style={{ textAlign: 'center', padding: '20px' }}>No Data Found</div>
                                }
                            />}
                    </Col>
                  
                </Row>
            </Container>

        </>


    );

}

export default UserAttendence;