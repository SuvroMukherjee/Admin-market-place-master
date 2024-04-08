import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import toast, { Toaster } from 'react-hot-toast';
import { FaLongArrowAltRight } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { SubcategoryApproval, allCategoryeqList, categoryApproval } from '../../../API/api';
import { ChangeFormatDate2 } from '../../../common/DateFormat';
import "../product.css";

export default function CatReqList() {
    const [loading, setLoading] = useState(true)
    const [categoryApplicqation, setCategoryApplication] = useState([])
    const [SubcategoryApplicqation, setSubCategoryApplication] = useState([])

    useEffect(() => {
        getCatsList();
    }, [])


    const getCatsList = async () => {

        let res = await allCategoryeqList();

        console.log(res?.data?.data, 'all cats list')
        setCategoryApplication(res?.data?.data?.categoryData)
        setSubCategoryApplication(res?.data?.data?.subcategoryData)
        setLoading(false)
    }

    const navigate = useNavigate()


    const handleUpdateFunction = async(data,subId) =>{

        let payload = {
            is_approved: !data?.is_approved
        }

        let res = await categoryApproval(payload,data?._id);

        let res2 = await SubcategoryApproval(payload, filterSubCatdata(data?._id)?._id)


        if (res?.response?.data?.error && res2?.response?.data?.error) {
            toast.error(res?.response?.data?.message)
        } else {
            toast.success('Category Request updated')
            setTimeout(() => {
                navigate('/Admin/category-commission')
            }, 2000);
            getCatsList();
        }

    }


   const filterSubCatdata  = (id) =>{
     
       let find = SubcategoryApplicqation?.find((ele)=>{
           return ele?.category?._id == id
       })
       return find;
    }



  return (
   
         <>
          {loading &&
              <div className="productList p-4 contentLoader">
                  <Row>
                      <Col>
                          <Spinner animation="border" size="lg" role="status">
                              <span className="visually-hidden">Loading...</span>
                          </Spinner>
                      </Col>
                  </Row>
              </div>}
          <div className="productList mt-2 p-4">
            <div className='text-center'><h4>Category Request Lists</h4></div>
              <Container className='mt-4'>
                  <Row>
                      <Col xs={12}>Total Data : {categoryApplicqation?.length}</Col>
                      <Col>
                          <Table responsive hover striped >
                              <thead>
                                  <tr>
                                      <th>Requestd By (seller)</th>
                                      <th> Name</th>
                                      <th>Changed</th>
                                      <th>Subcategory</th>
                                      <th>Contact Details</th>
                                      <th>Documents</th>
                                      <th>Status</th>
                                      <th>Action</th>
                                  </tr>
                              </thead>
                              <tbody className='mt-2 '>

                                  {categoryApplicqation?.length > 0 && categoryApplicqation?.map((ele) => ( 
                                      <tr>
                                          <td>{ele?.user?.shope_name} <br /> <span className='viewSeller' onClick={() => navigate(`/SellerDetails/${ele?.user?._id}`)}>view
                                              <FaLongArrowAltRight/> </span></td>
                                          <td>{ele?.title}<br/>
                                              <a
                                                  href={ele?.image?.[0]?.image_path}
                                                  target="_blank" rel="noreferrer"
                                              >

                                                  <span className=''>image</span>
                                              </a>
                                          </td>
                                          <td>{ChangeFormatDate2(ele?.createdAt)}</td>
                                          <td>{filterSubCatdata(ele?._id)?.title}<br/>
                                              <a
                                                  href={filterSubCatdata(ele?._id)?.image?.[0]?.image_path}
                                                  target="_blank" rel="noreferrer"
                                              >

                                                  <span className=''>image</span>
                                              </a>
                                          </td>
                                          <th>{ele?.seller_contc_info?.email} | {ele?.seller_contc_info?.phone_no}</th>
                                          <th>
                                              {ele?.seller_doc?.doc_file &&
                                                  <a
                                                      href={ele?.seller_doc?.doc_file}
                                                      target="_blank" rel="noreferrer"
                                                  >

                                                      <span className=''><IoDocumentTextOutline size={20}/> <span>{ele?.seller_doc?.doc}</span> </span>
                                                  </a>
                                              }
                                          </th>
                                          <td>{ele?.is_approved ? <span>Approved</span> : <span>Pending</span>}</td>
                                          <td>
                                              {ele?.is_approved ?
                                                  <Button size='sm'  variant='outline-error' onClick={() => handleUpdateFunction(ele)}>Reject</Button>
                                                  :
                                                  <Button size='sm'  variant='outline-success' onClick={() => handleUpdateFunction(ele)}>Approve</Button>
                                              }

                                          </td>
                                      </tr>
                                  ))}

                              </tbody>
                          </Table>
                      </Col>
                  </Row>
              </Container>
              <Toaster position="top-right" />
         </div>
      </>
  )
}
