import React, { useEffect, useState } from 'react'
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';
import { UpdatesellerOwnRegistrationForm, allCategoryList, allCommissionList, allcatList, createCommission, deleteCommission, updateCommission } from '../../../API/api';
import toast, { Toaster } from 'react-hot-toast';
import { IoIosAddCircle, IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { RiShareForwardFill } from "react-icons/ri";
import { IoSaveSharp } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import useAuth from '../../../hooks/useAuth';
import { AiFillDelete } from "react-icons/ai";


const CategoryComissions = () => {

    const [formData, setFormData] = useState({
        commission_data: [{ categoryId: '', commission_rate: '' }]
    });
    const [categorylist, setcategorylist] = useState([]);
    const { auth, logout } = useAuth();
    const [allcommissionList, setCommissionList] = useState([])
    const [updateCommissionRate, setUpdateCommissionRate] = useState();
    const [updateIndex, setUpdateIndex] = useState()
    const [updateformData, setupdateFormData] = useState([]);




    useEffect(() => {
        getAllCats()
        getAllCommissions();
    }, [])

    const navigate = useNavigate()


    async function getAllCommissions() {
        await allCommissionList().then((res) => {
            let filterCommissions = res?.data?.data?.filter((err) => {
                return "sellerId" in err == false
            })
            console.log({ filterCommissions })
            setCommissionList(filterCommissions)
        }).catch((err) => [
            console.log(err)
        ])
    }

    async function getAllCats() {
        await allcatList().then((res) => {
            let data = res?.data?.data?.filter((item) => item?.status === true)?.sort((a, b) => a.title.localeCompare(b.title))
            setcategorylist(data)
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


    const handlecreateCommissionFunc = async (dataValue) => {

        console.log({ dataValue })

        let payload = {

            "staff": auth?.userId,
            "categoryId": dataValue?.categoryId,
            "commission_rate": parseInt(dataValue?.commission_rate)
        }

        console.log({ payload })

        let res = await createCommission(payload);

        if (res?.response?.data?.error) {
            toast.error(res?.response?.data?.message)
        } else {
            toast.success('Commission Added successfully')
        }

        getAllCommissions();
    }

    const updateCategoryCommission = async (data) => {

        console.log({ data })

        // let payload = {

        //     "commission_rate": parseInt(dataValue?.commission_rate)
        // }

        // let res = await updateCommission(payload,data?._id);
    }


    const handleInputChangeCommission = (e, index) => {
        const { name, value } = e.target;

        // Create a copy of the existing state array
        const updatedFormData = [...updateformData];

        // Update the data at the specified index
        updatedFormData[index] = { index, updateData: value };

        // Set the updated state
        setupdateFormData(updatedFormData);
    }

    console.log({ updateformData })


    const handleUpdate = async (index, ele) => {

        let payload = {

            "commission_rate": parseInt(updateformData[index]?.updateData)
        }

        let res = await updateCommission(payload, ele?._id);

        if (res?.response?.data?.error) {
            toast.error(res?.response?.data?.message)
        } else {
            toast.success('Commission update successfully')
        }

        setUpdateIndex('');
        const updatedFormData = [...updateformData]
        updatedFormData.splice(index, 1);
        setupdateFormData(updatedFormData);
        getAllCommissions();
    }


    const handleDeleteFromDB = async (id) => {

        let res = await deleteCommission(id);

        getAllCommissions();


    }

    return (
        <div className="newProduct">
            <h3 className="addProductTitle mt-4 text-center">Add commissions</h3>
            <div>
                <Row className='mt-2'>
                    
                    <Col xs={8} className='d-flex justify-content-start mb-3' >
                    <Button variant="dark" size="sm" onClick={() => navigate('/Admin/category')}>
                       <span><IoMdArrowBack size={25} /></span> Back to Category
                    </Button>
                    </Col>
                    <Col xs={12} >
                        <Form.Group controlId="commissionRate">
                            {formData.commission_data.map((item, index) => (
                                <Row key={index} className="mb-2">
                                    <Col xs={4}>
                                        <Form.Label className='frmLable'>category</Form.Label>
                                        <Form.Select
                                            name="categoryId"
                                            value={item.categoryId}
                                            onChange={(e) => handleChange(e, index)}
                                            size='sm'
                                            className='tapG form-control'
                                            required
                                        >
                                            <option value="" disabled>Select category</option>
                                            {categorylist?.length > 0 && categorylist.map((ele) => (

                                                <option value={ele?._id}>{ele?.title}</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col xs={4}>
                                        <Form.Label className='frmLable'>commission(%)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            className='tapG form-control'
                                            name="commission_rate"
                                            value={item.commission}
                                            onChange={(e) => handleChange(e, index)}
                                            placeholder="Commisson rate"
                                            size='sm'
                                            required
                                        />
                                    </Col>
                                    <Col className='d-flex align-items-end' xs={1}>
                                        <Button variant='success' size='sm' onClick={() => handlecreateCommissionFunc(formData?.commission_data?.[index])}>save</Button>
                                    </Col>
                                    <Col className='d-flex align-items-end' xs={1}>
                                        <Button variant='danger' size='sm' onClick={() => handleDelete(index)}>cancel</Button>
                                    </Col>
                                </Row>
                            ))}
                            <IoIosAddCircle size={20} onClick={addCategory} />
                            <span className='frmLable mx-2' >Add more...</span>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <h6>Commission List</h6>
                    <Col xs={6}>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Commissions</th>
                                    <th>Action</th>
                                    {/* <th>Delete</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {allcommissionList?.length > 0 && allcommissionList?.map((ele, index) => (
                                    <tr>
                                        <td>{ele?.categoryId?.title}</td>
                                        <td>
                                            {ele?.commission_rate}%
                                            {updateIndex === index && (
                                                <span className='mx-2'>
                                                    <Form.Control
                                                        type="number"
                                                        size='sm'
                                                        placeholder="Enter Comission Rate %"
                                                        name="updatedata"
                                                        onChange={(e) => handleInputChangeCommission(e, index)}
                                                    />
                                                </span>
                                            )}
                                        </td>
                                        <td>

                                            {
                                                updateformData[index]?.index === index ? (
                                                    // Render the Update button if the condition is true
                                                    <Button size='sm' variant='success' onClick={() => handleUpdate(index, ele)}>Update</Button>
                                                ) : (
                                                    // Render the Edit button if the condition is false
                                                    <Button size='sm' onClick={() => setUpdateIndex(index)}>Edit</Button>
                                                )
                                            }

                                        </td>
                                        {/* <td>
                                            <AiFillDelete color='red' size={25} onClick={() => handleDeleteFromDB(ele?._id)} />
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
            <Toaster position="top-right" />
        </div>
    )
}




export default CategoryComissions