import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Image, Row, Table } from 'react-bootstrap';
import { allCategoryeqList, sellerCategoryRequestList } from '../../../API/api';
import { ChangeFormatDate2 } from '../../../common/DateFormat';

const ApprovalPendingList = () => {


  const [categoryApplicqation, setCategoryApplication] = useState()
  const [SubcategoryApplicqation, setSubCategoryApplication] = useState([])

  useEffect(() => {
    getCatsList();
  }, [])


  const getCatsList = async () => {

    let res = await sellerCategoryRequestList();

    console.log(res?.data?.data, 'all cats list')
    setCategoryApplication(res?.data?.data?.categoryData)
    setSubCategoryApplication(res?.data?.data?.subcategoryData)

  }

  const filterSubCatdata = (id) => {

    let find = SubcategoryApplicqation?.find((ele) => {
      return ele?.category?._id == id
    })

    return find;

  }


  return (
    <div>
      <Container>
        <Row>
          <Col xs={12}>
            <h4>View Selling Applications</h4>
          </Col>
          <Col xs={12}>
            <p>Track and manage your selling application status. Use Add Products search to determine your eligibility to sell a product.</p>
          </Col>
        </Row>
        <Row>
          <Col className='d-flex gap-2'>
            <div><Button size='sm' variant="outline-secondary"> View All</Button></div>
            <div><Button size='sm' variant="outline-secondary">  Category</Button></div>
            <div><Button size='sm' variant="outline-secondary">Brand</Button></div>
            <div><Button size='sm' variant="outline-secondary">Product</Button></div>
          </Col>
          <Col>

          </Col>
        </Row>
      </Container>

      <Container className='mt-4'>
        <Row>
          <Col>
            <Table responsive hover striped >
              <thead>
                <tr>
                  <th>Application Name</th>
                  <th>Application Type</th>
                  <th>Subcategory</th>
                  <th>Changed</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className='mt-2 '>

                {categoryApplicqation?.length > 0 && categoryApplicqation?.map((ele) => (
                  <tr>
                    <td>{ele?.title}</td>
                    <td>Category</td>
                    <td>{filterSubCatdata(ele?._id)?.title}</td>
                    <td>{ChangeFormatDate2(ele?.createdAt)}</td>
                    <td>{ele?.is_approved ? <span>Approved</span> : <span>Pending</span>}</td>
                    <td>
                      {ele?.is_approved ?
                        <button size='sm' className='gotoBtnYellow' variant='outline-dark'>List Products</button>
                        :
                        <button size='sm' className='gotoBtn' variant='outline-dark'>Go to Application</button>
                      }

                    </td>
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

export default ApprovalPendingList;