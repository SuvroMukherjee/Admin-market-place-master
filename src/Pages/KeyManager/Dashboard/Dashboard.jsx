import React, { useEffect, useState } from 'react';

import { allSellerList, attendenceList, getUserLoginLocation, setAttendenceLogin } from '../../../API/api';
import KeyFeaturedInfo from '../../../components/FeaturedInfo/KeyFeaturedInfo';
import './dashboard.css';
// import WidgetSm from '../../components/widgetSm/WidgetSm'
// import WidgetLg from '../../components/WidgetLg/WidgetLg'
import { Col, Row } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import KeyWidgetSm from '../../../components/widgetSm/KeyWidgetSm';
import { DataGrid } from "@mui/x-data-grid";
import { ChangeFormatDate, calculateTimeDifference, splitDateTime } from '../../../common/DateFormat';

const Dashboard = () => {

    const [seller, setSeller] = useState();
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        getAllSellersList();
    }, [])

    async function getAllSellersList() {
        await allSellerList().then((res) => {
            setSeller(res?.data?.data)
            if(res?.data?.data){
                setLoading(false)
            }
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setTimeout(() => {
                setLoading(false)
            }, 3000);
        })
    };

    // const getLocation = () => {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 const { latitude, longitude } = position.coords;
    //                 getUserLocation(latitude, longitude);
    //             },
    //             (error) => {
    //                 switch (error.code) {
    //                     case error.PERMISSION_DENIED:
    //                         setError("User denied the request for Geolocation.");
    //                         break;
    //                     case error.POSITION_UNAVAILABLE:
    //                         setError("Location information is unavailable.");
    //                         break;
    //                     case error.TIMEOUT:
    //                         setError("The request to get user location timed out.");
    //                         break;
    //                     case error.UNKNOWN_ERROR:
    //                         setError("An unknown error occurred.");
    //                         break;
    //                     default:
    //                         setError("An error occurred while getting the location.");
    //                 }
    //             }
    //         );
    //     } else {
    //         setError("Geolocation is not supported by this browser.");
    //     }
    // };


    // const getUserLocation = async (lat, long) => {
    //     let res = await getUserLoginLocation(lat, long);

    //     console.log(res);
    //     let  payload = {
    //         "log_in_time": res?.data?.location?.localtime,
    //         "log_in_loc": {
    //             locaton: res?.data?.location?.name ,
    //             city: res?.data?.location?.tz_id,
    //             state: res?.data?.location?.region,
    //         } 
    //     }
    //         console.log(payload);
        
    //     setUserAttendence(payload)
    // }

    // const setUserAttendence = async(payload)=>{
    //    let res = await setAttendenceLogin(payload);
    //    console.log(res,'resdata')
    // }

    return (
        <>
            {loading &&
                <div className="productList mt-2 p-4 contentLoader">
                    <Row>
                        <Col>
                            <Spinner animation="border" size="lg" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                </div>}
            <div className="home">
                <KeyFeaturedInfo seller={seller} />
                {/* <Chart data={userData} title="User Analytics" grid dataKey="Active User" /> */}
               
                        {/* <Attendence /> */}
                    
                <div className="homeWidgets">
                    <KeyWidgetSm user={seller} />
                    {/* <WidgetLg /> */}
                </div>
            </div>
        </>

    )
}


const Attendence = () =>{

    const [attendenceadata,setAttendencedata] = useState();

    const userId = JSON.parse(localStorage.getItem('auth'))?.userId;
    
    const getAttendenceList = async (userId) => {
        const response = await attendenceList(userId);
        console.log(response, 'getAttendenceList');
        const dataWithUniqueIds = response?.data?.data?.map((item, index) => ({
            ...item,
            id: index + 1,
        }));
        setAttendencedata(dataWithUniqueIds)
    };

    useEffect(()=>{
        getAttendenceList(userId);
    },[])

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "log_in_time",
            headerName: 'Login Time',
            width: 200,
            // renderCell: (params) => {
            //     return (
            //         <div className="productListItem">
            //             {/* <img className="productListImg" src={params?.row?.log_in_time} alt="" /> */}
            //             <span>{splitDateTime(params?.row?.log_in_time)}</span>
            //         </div>
            //     );
            // }
        },
        {
            field: "log_in_loce",
            headerName: "Login Location",
            width: 250,
            renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {/* <img className="productListImg" src={params?.row?.log_in_time} alt="" /> */}
                        <span>{params?.row?.log_in_loc?.location},{params?.row?.log_in_loc?.city},{params?.row?.log_in_loc?.state}</span>
                    </div>
                );
            }
        },
        {
            field: "log_out_time",
            headerName: "Logout time",
            width: 200,
            // renderCell: (params) => {
            //     return (
            //         <div className="productListItem">
            //             {/* <img className="productListImg" src={params?.row?.log_in_time} alt="" /> */}
            //             <span>{splitDateTime(params?.row?.log_out_time)?.date}</span>
            //         </div>
            //     );
            // }
        },
        // {
        //     field: "log_out_loc",
        //     headerName: "Logout Location",
        //     width: 250,
        //     renderCell: (params) => {
        //         return (
        //             <div className="productListItem">
        //                 {/* <img className="productListImg" src={params?.row?.log_in_time} alt="" /> */}
        //                 <span>{params?.row?.log_out_loc?.location},{params?.row?.log_out_loc?.city},{params?.row?.log_out_loc?.state}</span>
        //             </div>
        //         );
        //     }
        // },
        {
            field: "duration",
            headerName: "Duration",
            width: 250,
            renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {/* <img className="productListImg" src={params?.row?.log_in_time} alt="" /> */}
                        <span>{calculateTimeDifference(params?.row?.log_out_time, params?.row?.log_in_time)}</span>
                    </div>
                );
            }
        }
        
    ];


    return (
       
        <div>
            { console.log(attendenceadata)}
            {attendenceadata?.length > 0 && 
            <DataGrid
                style={{ height: 400, width: '100%' }}
                rows={attendenceadata}
                columns={columns}
                pageSize={8}
            />}
        </div>
    )

}

export default Dashboard