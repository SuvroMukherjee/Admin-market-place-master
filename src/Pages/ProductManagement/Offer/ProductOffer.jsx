
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { SlCalender } from "react-icons/sl";
import { useNavigate, useParams } from "react-router-dom";
import { allProductList, offerCreate, offerTypeCreate, offerTypeList, sellerProductDeatils } from '../../../API/api';
import { ChangeFormatDate2 } from '../../../common/DateFormat';
import useAuth from '../../../hooks/useAuth';
import "../product.css";
import { productRows } from '../../../dummyData';
import { BiSolidOffer } from "react-icons/bi";

const ProductOffer = () => {

    const [data, setData] = useState(productRows);

    useEffect(() => {
            getProductListFunc();
    }, []);


    const navigate = useNavigate()


    async function getProductListFunc() {
        await allProductList().then((res) => {
            const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
                ...item,
                id: index + 1,
            }));
            setData(dataWithUniqueIds)
        }).catch((err) => {
            console.log(err)
        }).finally((data) => {
            console.log(data)
        })
    };

  return (
      <div className="newProduct mt-4">
         <h4 className='text-center'>Select your Product to Apply Offers</h4>
          <Container>
              <Row className="mt-4">
                  <Table responsive striped bordered hover>
                      <thead>
                          <tr>
                              <th>ID</th>
                              <th>Product Id</th>
                              <th>Name</th>
                              <th>Image</th>
                              <th>Variants</th>
                              <th>Category</th>
                              <th>Sub Category</th>
                              <th>Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          {data.map((row, index) => (
                              <tr key={index}>
                                  <td>{row?.id}</td>
                                  <td>{row?.productId?.substring(0, 15)}
                                  </td>
                                  <td>{row?.name?.substring(0, 20) + '...'}</td>
                                  <td>
                                      <div className="productListItem">
                                          <img className="productListImg" src={row.image?.[0]?.image_path} alt="" />
                                      </div>
                                  </td>
                                  <td style={{ width: '150px' }}>
                                      {row?.specId?.length}
                                  </td>
                                 
                                  <td>{row?.categoryId?.title}</td>
                                  <td>{row?.subcategoryId?.title}</td>
                                 
                                  <td>
                                      <Button variant='warning' size='sm' onClick={() => navigate(`/Admin/offer/${row?._id}`)}><span className='mx-1'><BiSolidOffer size={20}/></span> APPLY OFFERS</Button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </Table>
              </Row>
          </Container>
        </div>
  )
}

export default ProductOffer