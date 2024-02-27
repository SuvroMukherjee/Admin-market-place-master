import React, { useEffect, useState } from 'react'
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';
import { UpdatesellerOwnRegistrationForm, allCategoryList, allcatList } from '../../API/api';
import toast, { Toaster } from 'react-hot-toast';
import { IoIosAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";


const Step5 = ({ prevStep, reg_userdata, getUserdata }) => {
    const [formData, setFormData] = useState({
        commission_data: [{ categoryId: '', commission_rate: '' }]
    });
    const [categorylist, setcategorylist] = useState([]);


    useEffect(() => {
        getAllCats()
    }, [])

    const navigate = useNavigate()

    async function getAllCats() {
        await allcatList().then((res) => {
            setcategorylist(res?.data?.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedCategories = [...formData.commission_data];
        updatedCategories[index][name] = value;
        setFormData({ ...formData, commission_data: updatedCategories });
    };

    const addCategory = () => {
        setFormData({
            ...formData,
            commission_data: [...formData.commission_data, { categoryId: '', commission_rate: '' }]
        });
    };

    const handleSave = () => {
        console.log(formData.commission_data);
        addCategorytoForm(formData.commission_data)
    };

    const handleDelete = (index) => {
        const updatedCategories = [...formData.commission_data];
        updatedCategories.splice(index, 1);
        setFormData({ ...formData, commission_data: updatedCategories });
    };


    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleCheckboxChange = (categoryId) => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
        } else {
            setSelectedCategories([...selectedCategories, categoryId]);
        }
    };


    const handleSubmit = async() =>{

        let payload = { "interest_details": { "commission_data": formData?.commission_data, "categoryId" : selectedCategories } }

        console.log(payload)

        let response = await UpdatesellerOwnRegistrationForm(payload, reg_userdata?._id);

        if (response?.response?.data?.error) {
            toast.error(response?.response?.data?.data)
        } else {
            getUserdata(response?.data?.data)
            localStorage.setItem('seller-registration', JSON.stringify(response?.data?.data))
            toast.success(response?.data?.message)
            //nextStep();
            navigate('/login')

        }


    }
    

  return (
      <Container>
        <Row>
            <Col>
              <Row>
                <h4>Chhose Your Interst Category</h4>
                          <Row>
                              {categorylist.map((option) => (
                                  <Col key={option._id} xs={4} className='mt-2'>
                                      <input
                                          type="checkbox"
                                          id={option._id}
                                          name={option.title}
                                          checked={selectedCategories.includes(option._id)}
                                          onChange={() => handleCheckboxChange(option._id)}
                                      />
                                      <label className='mx-2' htmlFor={option._id}>{option.title}</label>
                                  </Col>
                              ))}
                          </Row>
              </Row>
            </Col>
        </Row>
        <Row>
              <h4>Add commission</h4>
            <Col xs={12} >
            {/* <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className="text-center">Category Title</th>
                        <th className="text-center">Commission Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {catsdata?.length > 0 && catsdata?.map((item, index) => (
                        <tr key={index}>
                            <td className="text-center">{item?.categoryId?.title}</td>
                            <td className="text-center">{item?.commission_rate}%</td>
                        </tr>
                    ))}
                </tbody>
            </Table> */}
            <Form.Group controlId="commissionRate">
                {/* <Form.Label>Commission rate against category(%)</Form.Label> */}
                {/* <span>
                    <Button variant="dark" onClick={handleSave} size="sm">Save</Button>
                </span> */}
                      {formData.commission_data.map((item, index) => (
                    <Row key={index} className="mb-2">
                        <Col xs={4}>
                            <Form.Label>category</Form.Label>
                            <Form.Select
                                name="categoryId"
                                value={item.categoryId}
                                onChange={(e) => handleChange(e, index)}
                                required
                            >
                                <option value="" disabled>Select category</option>
                                {categorylist?.length > 0 && categorylist.map((ele) => (
                                    <option value={ele?._id}>{ele?.title}</option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col xs={4}>
                            <Form.Label>commission(%)</Form.Label>
                            <Form.Control
                                type="number"
                                name="commission_rate"
                                value={item.commission}
                                onChange={(e) => handleChange(e, index)}
                                placeholder="Commisson rate"
                                required
                            />
                        </Col>
                        <Col className='d-flex align-items-end'>
                                  <Button variant='success' size='sm' onClick={() => handlecreateCommissionFunc(formData?.commission_data?.[index])}>save</Button>
                        </Col>
                        <Col className='d-flex align-items-end'>
                            <Button variant='danger' size='sm' onClick={() => handleDelete(index)}>cancel</Button>
                        </Col>
                    </Row>
                ))}
                <IoIosAddCircle size={26} onClick={addCategory} />
                <span style={{ marginLeft: '5px', color: 'grey', fontSize: '16px' }}  >Add more...</span>
            </Form.Group>
        </Col>
        </Row>
        <Row>
            <Col>
                  <Button variant="secondary" onClick={prevStep}>Previous</Button>{' '}
                  <Button variant="primary" onClick={()=>handleSubmit()}>Next</Button>
            </Col>
        </Row>
          <Toaster position="top-right" />
      </Container>
  )
}

export default Step5