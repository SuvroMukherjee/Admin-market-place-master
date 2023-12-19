import React from 'react';

import './Seller.css';
// import KeyFeaturedInfo from '../../../components/FeaturedInfo/KeyFeaturedInfo'
// import { allSellerList } from '../../../API/api'
// import WidgetSm from '../../components/widgetSm/WidgetSm'
// import WidgetLg from '../../components/WidgetLg/WidgetLg'
import { Col, Row } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { useState } from 'react';
import { useEffect } from 'react';
// import KeyWidgetSm from '../../../components/widgetSm/KeyWidgetSm';


const SellerDashboard = () => {

    //const [seller, setSeller] = useState();
    const [loading, setLoading] = useState(true)

    


    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 3000); 
    }, [])

    // async function getAllSellersList() {
    //     await allSellerList().then((res) => {
    //         setSeller(res?.data?.data)
    //         if (res?.data?.data) {
    //             setLoading(false)
    //         }
    //     }).catch((err) => {
    //         console.log(err)
    //     }).finally(() => {
    //         setTimeout(() => {
    //             setLoading(false)
    //         }, 3000);
    //     })
    // };

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

                {/* <KeyFeaturedInfo seller={seller} />
                
                <div className="homeWidgets">
                    <KeyWidgetSm user={seller} />
                    <WidgetLg />
                </div> */}
            </div>
        </>

    )
}

export default SellerDashboard