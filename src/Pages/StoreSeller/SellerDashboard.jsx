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
import { OwnProductSellerList, SellerProductList } from '../../API/api';
import { FaUsers } from 'react-icons/fa';
import { CiShop } from 'react-icons/ci';
// import KeyWidgetSm from '../../../components/widgetSm/KeyWidgetSm';


const SellerDashboard = () => {

    //const [seller, setSeller] = useState();
    const [loading, setLoading] = useState(true)
    const [addedProduct, setAddedProduct] = useState(0);
    const [ownproudct, setOwnproduct] = useState(0)


    const { userId } = JSON.parse(localStorage.getItem('auth'));

    useEffect(() => {
        getProductListFunc();
        getAllOwnProducts();
        setTimeout(() => {
            setLoading(false)
        }, 3000);
    }, [])

    async function getProductListFunc() {
        await SellerProductList(userId).then((res) => {
            console.log(res?.data?.data)
            setAddedProduct(res?.data?.data?.length)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        }).finally((data) => {
            setLoading(false)
        })
    };

    async function getAllOwnProducts() {
        setLoading(true)
        await OwnProductSellerList(userId).then((res) => {
            console.log(res?.data?.data, 'own data');
            setOwnproduct(res?.data?.data?.length)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        })
    }


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
            <div className="home mt-4">

                <div className="featured">
                    <div className="featuredItem">
                        <span className="featuredTitle">Added Product</span>
                        <div className="featuredMoneyContainer">
                            <span className="featuredMoney">{addedProduct} <FaUsers /></span>
                            <span className="featuredMoneyRate">
                                {/* -11.4 <ArrowDownwardIcon className="featuredIcon negative" /> */}
                            </span>
                        </div>
                    </div>
                    <div className="featuredItem">
                        <span className="featuredTitle">Own Product</span>
                        <div className="featuredMoneyContainer">
                            <span className="featuredMoney">{ownproudct} <CiShop /> </span>
                            <span className="featuredMoneyRate">
                                {/* -1.4 <ArrowDownwardIcon className="featuredIcon negative" /> */}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default SellerDashboard