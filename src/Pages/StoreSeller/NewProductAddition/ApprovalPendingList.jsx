import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Image, Row, Table } from 'react-bootstrap';
import { allCategoryeqList, sellerBrandRequestList, sellerCategoryRequestList } from '../../../API/api';
import { ChangeFormatDate2 } from '../../../common/DateFormat';
import { BsType } from 'react-icons/bs';
import { useNavigate, useParams } from "react-router-dom";

const ApprovalPendingList = () => {


  const [categoryApplicqation, setCategoryApplication] = useState()
  const [SubcategoryApplicqation, setSubCategoryApplication] = useState([])
  const [type, setType] = useState('');
  const [data,setData] = useState([])
  const [brandList, setBrandlist] = useState([])

  useEffect(() => {
    getCatsList();
    getbrandList();
  }, [])

  const navigate = useNavigate();

  const getbrandList  = async() =>{
    setType('brand');
    let res = await sellerBrandRequestList();
    console.log(res?.data?.data,'all brands')
    let typeadded  = res?.data?.data?.map((ele)=>{
      return {...ele, type:  'Brand'}
    })
    setData(typeadded)
    setBrandlist(typeadded)
  }

  const getCatsList = async () => {

    let res = await sellerCategoryRequestList();

    console.log(res?.data?.data, 'all cats list')
    setType('category')
    let typeAdded = res?.data?.data?.categoryData.map((ele) => {
      return { ...ele, type: 'Category' };
    });
    setCategoryApplication(typeAdded)
    setData(typeAdded)
    let newtypeadded = res?.data?.data?.subcategoryData.map((ele) => {
      return {...ele, type:'SubCategory'}
    })
    setSubCategoryApplication(newtypeadded)

  }

  const filterSubCatdata = (id) => {

    let find = SubcategoryApplicqation?.find((ele) => {
      return ele?.category?._id == id
    })

    return find;

  }


  const getAllLists = () =>{
    let alldata = [...brandList, ...categoryApplicqation, ...SubcategoryApplicqation];

    let sortedData = alldata.sort((a, b) => {
      const titleA = a?.title.toUpperCase(); // ignore upper and lowercase
      const titleB = b?.title.toUpperCase(); // ignore upper and lowercase

      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
      return 0;
    });

    console.log({ sortedData })

    setData(sortedData)

  }


  const handleFunctionCall = (type) =>{

    switch(type){
      case 'category' :
        getCatsList();
        setType('category');
        break;
      case 'brand' :
        getbrandList();
        setType('brand');
        break;
      case 'all':
        getAllLists();
        setType('all')
     }

  }

  console.log({data})

  return (
    <div>
      <Container>
        <Row>
          <Col xs={12}>
            <h4>View Selling Applications For {type?.toUpperCase()}</h4>
          </Col>
          <Col xs={12}>
            <p>Track and manage your selling application status. Use Add Products search to determine your eligibility to sell a product.</p>
          </Col>
        </Row>
        <Row>
          <Col className='d-flex gap-2'>
            <div><Button size='sm' variant={type != 'all' ? "outline-secondary" : "dark"} onClick={()=>handleFunctionCall('all')}> View All</Button></div>
            <div><Button size='sm' variant={type != 'category' ? "outline-secondary" : "dark" } onClick={() => handleFunctionCall('category')}>  Categories</Button></div>
            <div><Button size='sm' variant={type != 'brand' ? "outline-secondary" : "dark"} onClick={() => handleFunctionCall('brand')} >Brands</Button></div>
            <div><Button size='sm' variant="outline-secondary" onClick={() => handleFunctionCall('product')}>Products</Button></div>
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
                  <th>subCategory</th>
                  <th>Changed</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className='mt-2 '>

                {data?.length > 0 && data?.map((ele) => (
                  <tr>
                    <td>{ele?.title}</td>
                    <td>{ele?.type}</td>
                    <td>{filterSubCatdata(ele?._id)?.title || 'N/A'}</td>
                    <td>{ChangeFormatDate2(ele?.createdAt)}</td>
                    <td>{ele?.is_approved ? <span>Approved</span> : <span>Pending</span>}</td>
                    <td>
                      {ele?.is_approved ?
                        <button size='sm' className='gotoBtnYellow' variant='outline-dark' onClick={() => navigate('/seller/seller-addproduct')}>List Products</button>
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