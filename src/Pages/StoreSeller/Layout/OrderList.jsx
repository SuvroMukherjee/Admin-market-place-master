import React, { useEffect, useState } from 'react'
import { sellerStockoutlist } from '../../../API/api';
import { DataGrid } from "@mui/x-data-grid";
import { Button, Col, Container, Row, Form, ButtonGroup, Card,Image} from 'react-bootstrap';
import { ChangeFormatDate } from '../../../common/DateFormat';
import Table from 'react-bootstrap/Table';

const OrderList = () => {

    const { userId } = JSON.parse(localStorage.getItem('auth'));

    const [list,setList] = useState([])

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

    console.log({list})

    // const columns = [
    //     { field: "id", headerName: "ID", width: 50 },
    //     {
    //         field: "product name", headerName: "Product Name", width: 200, renderCell: (params) => {
    //             return (
    //                 <div>
    //                     {params?.row?.productId?.name}
    //                 </div>
    //             );
    //         }
    //     },
    //     {
    //         field: "product Image", headerName: "Product Image", width: 150, renderCell: (params) => {
    //             return (
    //                 <div>
    //                     <Image src={params?.row?.productId?.specId?.image?.[0]?.image_path}  thumbnail width={40} height={40}/>
    //                 </div>
    //             );
    //         }
    //     },
    //     {
    //         field: "SKU", headerName: "SKU", width: 100, renderCell: (params) => {
    //             return (
    //                 <div>
    //                     {params?.row?.productId?.specId?.skuId}
    //                 </div>
    //             );
    //         }
    //     },
    //     {
    //         field: "Order Quantity", headerName: "Order Quantity", width: 150, renderCell: (params) => {
    //             return (
    //                 <div>
    //                     {params?.row?.quantity}
    //                 </div>
    //             );
    //         }
    //     },
    //     {
    //         field: "Price", headerName: "Price", width: 150, renderCell: (params) => {
    //             return (
    //                 <div>
    //                     {params?.row?.productId?.price}
    //                 </div>
    //             );
    //         }
    //     },
    //     {
    //         field: "Shipping Cost", headerName: "Shipping Cost", width: 150, renderCell: (params) => {
    //             return (
    //                 <div>
    //                     {params?.row?.productId?.price}
    //                 </div>
    //             );
    //         }
    //     },
    //     {
    //         field: "Commission Price", headerName: "Commission Price", width: 150, renderCell: (params) => {
    //             return (
    //                 <div>
    //                     {params?.row?.productId?.shipping_cost}
    //                 </div>
    //             );
    //         }
    //     },
    //     {
    //         field: "Order Time", headerName: "Order Time", width: 200, renderCell: (params) => {
    //             return (
    //                 <div>
    //                     {ChangeFormatDate(params?.row?.createdAt)}
    //                 </div>
    //             );
    //         }
    //     },

    // ];


  return (
    <div>
        <Container className='mt-4'>
            <Row>
                  <Col className='dtext'>
                    Order List
                </Col>
            </Row>
            <Row className='mt-4'>
                <Col>
                      <Table striped bordered hover responsive>
                      <thead>
                          <tr>
                              <th>ID</th>
                              <th>Product Name</th>
                              <th>Product Image</th>
                              <th>SKU</th>
                              <th>Order Quantity</th>
                              <th>Price</th>
                              <th>Shipping Cost</th>
                              <th>Commission Price</th>
                              <th>Order Date & Time</th>
                              <th>Available Quantiy</th>
                          </tr>
                      </thead>
                      <tbody>
                          {list.map((row) => (
                              <tr key={row.id}>
                                  <td>{row.id}</td>
                                  <td>{row.productId ? row.productId.name : ''}</td>
                                  <td>
                                      <Image src={row.productId?.specId?.image?.[0]?.image_path} thumbnail width={40} height={40} />
                                  </td>
                                  <td>{row.productId?.specId?.skuId}</td>
                                  <td className='amount'>{row.quantity}</td>
                                  <td className='amount'> {row.productId?.price}</td>
                                  <td className='amount'>{row.productId?.shipping_cost}</td>
                                  <td className='amount'>{row.productId?.comission_price}</td>
                                  <td className='datecolor'>{ChangeFormatDate(row.createdAt)}</td>
                                  <td className='avaible'>{row.productId?.available_qty}</td>
                              </tr>
                          ))}
                      </tbody>
                  </Table>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default OrderList