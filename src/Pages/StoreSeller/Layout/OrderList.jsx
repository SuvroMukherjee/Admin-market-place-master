import React, { useEffect, useState } from 'react'
import { sellerStockoutlist } from '../../../API/api';
import { DataGrid } from "@mui/x-data-grid";
import { Button, Col, Container, Row, Form, ButtonGroup, Card } from 'react-bootstrap';

const OrderList = () => {

    const { userId } = JSON.parse(localStorage.getItem('auth'));

    const [list,setList] = useState()

    useEffect(()=>{
        getOrdersist()
    },[])

    const getOrdersist  = async() =>{
        let res = await sellerStockoutlist(userId);
        console.log(res?.data?.data,'order')
        const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
            ...item,
            id: index + 1,
        }));
        setList(dataWithUniqueIds)
    }

    const columns = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "productId", headerName: "Product Id", width: 150 },
        { field: "name", headerName: "Name", width: 250 },
        {
            field: "image", headerName: "Image", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        <img className="productListImg" src={params?.row?.image?.[0]} alt="" />
                        {params?.row?.image?.length > 1 && <span>{params?.row?.image?.length - 1}+</span>}
                    </div>
                );
            }
        },
        { field: "regular_price", headerName: "Price", width: 150, },
        { field: "desc", headerName: "Description", width: 150 },
        {
            field: "category", headerName: "Category", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params.row.categoryId?.title}
                    </div>
                );
            }
        },
        {
            field: "Subcategory", headerName: "Sub Category", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params.row.subcategoryId?.title}
                    </div>
                );
            }
        },
        {
            field: "Brand", headerName: "Brand", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params.row?.brandId?.title}
                    </div>
                );
            }
        },
        {
            field: "tags", headerName: "Tags", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params.row?.tags?.map((ele, i) => (
                            <p key={i}>{ele},</p>
                        ))}
                    </div>
                );
            }
        },
        {
            field: "status", headerName: "Status", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params?.row?.status ? <span className="ActiveStatus">Active</span> : <span className="DeactiveStatus">Not Active</span>}
                    </div>
                );
            }
        },
        { field: "type", headerName: "Type", width: 150 },
    ];


  return (
    <div>
        <Container className='mt-4'>
            <Row>
                <Col>
                      {/* <DataGrid
                          rows={list}
                          columns={columns}
                          pageSize={8}
                          noRowsOverlay={
                              list?.length === 0 && <div style={{ textAlign: 'center', padding: '20px' }}>No Data Found</div>
                          }
                      /> */}
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default OrderList