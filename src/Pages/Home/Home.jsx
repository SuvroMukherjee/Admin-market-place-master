import React, { useEffect } from 'react'
import FeaturedInfo from '../../components/FeaturedInfo/FeaturedInfo'
import './Home.css'
import WidgetSm from '../../components/widgetSm/WidgetSm'
import WidgetLg from '../../components/WidgetLg/WidgetLg'
import { useState } from 'react'
import { Button, ButtonGroup, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { AdminCreateUserList, AdminSellerLists, allProductList } from '../../API/api'

const Home = () => {
 
    const [loading, setLoading] = useState(true)
    const [product,setproduct] = useState([])
    const [user,setUser] = useState([]);
    const [seller,setSeller] = useState([])
 
    useEffect(()=>{
        setTimeout(() => {
            productCount();
            userCount();
            sellerCount();
        }, 3000);
    },[])

    async function productCount(){
        await allProductList().then((res)=>{
             setproduct(res?.data?.data)
            setLoading(false)
        }).catch((err)=>{
            console.log(err)
            setLoading(false)
        })
    }


    async function userCount(){
        await AdminCreateUserList().then((res)=>{
            setUser(res?.data?.data)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setLoading(false)
        })
    }

    async function sellerCount() {
        await AdminSellerLists().then((res) => {
            setSeller(res?.data?.data)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setLoading(false)
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
            <div className="home">

                <FeaturedInfo product={product} user={user} seller={seller}/>
                {/* <Chart data={userData} title="User Analytics" grid dataKey="Active User" /> */}
                <div className="homeWidgets">
                    <WidgetSm user={user} />
                    <WidgetLg product={product}/>
                </div>
            </div>
        </>
    )
}

export default Home