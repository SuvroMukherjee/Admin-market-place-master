import { DataGrid } from "@mui/x-data-grid";
import "../product.css";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row, Modal, Form, ListGroup } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlinePlus } from "react-icons/ai";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiEdit2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { BulkProductUpload, FileUpload, ProductSpecificationCreate, StatusUpdateProduct, allProductList, deleteProduct } from "../../../API/api";
import Spinner from 'react-bootstrap/Spinner';
import { productRows } from "../../../dummyData";
import { PiFileCsvDuotone } from "react-icons/pi";
import { IoIosAdd, IoMdCloseCircle } from 'react-icons/io';
import { RiListSettingsFill } from "react-icons/ri";

export default function ListProduct() {
    const [data, setData] = useState(productRows);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [selectedproductid, setSeledtedProductId] = useState()

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };


    // const getProductSpecification = (specifications) => {
    //     setSeledtedProductId(specifications?._id)
    // };


    useEffect(() => {
        setTimeout(() => {
            getProductListFunc();
        }, 5000)
    }, []);


    const navigate = useNavigate()


    async function getProductListFunc() {
        await allProductList().then((res) => {
            const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
                ...item,
                id: index + 1,
            }));
            setData(dataWithUniqueIds)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        }).finally((data) => {
            setLoading(false)
        })
    };

    const handleStatus = async (dataset) => {
        let payload = {
            "status": !dataset?.status
        }

        await StatusUpdateProduct(dataset?._id, payload).then((res) => {
            console.log(res)
            getProductListFunc()
            toast.success('Product status updated successfully!');
        }).catch((err) => {
            console.log(err)
        })
    }


    const handledeleteProduct = async (id) => {
        await deleteProduct(id).then((res) => {
            console.log(res)
            getProductListFunc()
            toast.success('Product deleted successfully!');
        }).catch((err) => {
            console.log(err)
        })
    }


    const columns = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "productId", headerName: "Product Id", width: 150 },
        { field: "name", headerName: "Name", width: 150 },
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
        {
            field: "action",
            headerName: "Action",
            width: 300,
            renderCell: (params) => {
                return (
                    <>

                        <div className="buttonWrapper">
                            <Button variant="info" onClick={() => { handleShowModal(); setSeledtedProductId(params?.row)}} size="sm">
                                <RiListSettingsFill /> Add Specification
                            </Button>
                            <Button variant="warning" onClick={() => navigate(`/Admin/Editproduct/${params?.row?._id}`)} size="sm">
                                <RiEdit2Line /> Edit
                            </Button>
                            {params?.row?.status ?
                                <Button variant="danger" onClick={() => handleStatus(params?.row)} size="sm">
                                    Deactive
                                </Button> :
                                <Button variant="success" onClick={() => handleStatus(params?.row)} size="sm">
                                    Active
                                </Button>}
                            <Button variant="outline-danger" onClick={() => handledeleteProduct(params?.row?._id)} size="sm">
                                <FaRegTrashAlt />
                            </Button>
                        </div>
                    </>
                );
            },
        },
    ];


    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {

        const file = event.target.files[0];
        if (file) {
            // Handle the file, e.g., upload or process it
            console.log('Selected File:', file);
            onFileUpload(file)
        }
    };

    const handleButtonClick = () => {
        // Trigger the hidden file input
        fileInputRef.current.click();
    };


    const onFileUpload = async (file) => {
        setUploading(true)
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await FileUpload(formData);
            console.log(res?.data?.data)

            let payload = {
                file: res?.data?.data?.fileName
            }

            let response = await BulkProductUpload(payload);

            if (response?.data?.error) {
                toast.error('Could not upload csv');
                setUploading(false)
            } else {
                console.log(response?.data)
                toast.success('Upload successfully')
                getProductListFunc();
                setUploading(false)
            }

            console.log(response)
            // setTimeout(() => {
            //     setFormData((prevData) => ({
            //         ...prevData,
            //         image: [...prevData.image, res?.data?.data?.fileurl],
            //     }));
            // }, 3000);
        } catch (err) {
            console.error(err, "err");
        }
    };

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
            <div className="productList mt-2 p-4">

                <Container>
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <h3>Product List</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex justify-content-end p-2">
                            <Button className="addCategoryButton" variant="dark" >
                                <div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                    <Button variant="dark" onClick={handleButtonClick}>
                                        {uploading ? (
                                            <Spinner animation="border" size="sm" />
                                        ) : (
                                            <>
                                                <PiFileCsvDuotone /> CSV Upload
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Button>
                            <Button className="addCategoryButton" variant="dark" onClick={() => navigate('/Admin/Addproduct')}>
                                <AiOutlinePlus /> Add New Product
                            </Button>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col>
                            {data?.length > 0 ?
                                <DataGrid
                                    rows={data}
                                    columns={columns}
                                    pageSize={8}
                                /> :

                                <DataGrid
                                    rows={[]}
                                    columns={columns}
                                    pageSize={8}
                                />
                            }
                        </Col>
                    </Row>
                    <Row>
                        <ProductSpecificationForm
                            selectedproductid={selectedproductid}
                            showModal={showModal}
                            handleCloseModal={handleCloseModal}
                            getProductListFunc={getProductListFunc}
                        />
                    </Row>
                    <Toaster position="top-right" />
                </Container>
            </div>
        </>
    );
}





const ProductSpecificationForm = ({ selectedproductid, showModal, handleCloseModal, getProductListFunc }) => {

    console.log({ selectedproductid })

    const [specifications, setSpecifications] = useState([
        {
            title: '',
            value: '',
            //user_choice: false,
        },
    ]);

    const [productPrice,setproductPrice] = useState(0)

    const handleChange = (index, title, value) => {
        setSpecifications((prevSpecifications) => {
            const newSpecifications = [...prevSpecifications];
            newSpecifications[index] = { title, value};
            return newSpecifications;
        });
    };

    const addSpecification = () => {
        setSpecifications((prevSpecifications) => [
            ...prevSpecifications,
            { title: '', value: ''}, // Set user_choice to a default value
        ]);
    };

    const removeSpecification = (index) => {
        setSpecifications((prevSpecifications) => {
            const newSpecifications = [...prevSpecifications];
            newSpecifications.splice(index, 1);
            return newSpecifications;
        });
    };

    const handleSubmit = async() => {
        console.log('Submitted Data:', specifications);
        let payload = {
            productId: selectedproductid?._id,
            spec_det: specifications,
            price: productPrice,
            skuId: generateRandomKey(),
           // user_choice:false,
        }
        
        let res = await ProductSpecificationCreate(payload);

        if(res?.data?.error){
            toast.error('Something went wrong..')
        }else{
            console.log({ payload })
            getProductListFunc();
            setSpecifications([{
                title: '',
                value: '',
                //user_choice: false,
            }])
            setproductPrice('')
            handleCloseModal(); // Close the modal after submitting
        }
    };

    function generateRandomKey() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = '';

        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            key += characters.charAt(randomIndex);
        }

        return key;
    }

    return (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Product Specification Form</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Col>
                            <ListGroup style={{ maxHeight: '150px', overflowY: 'auto' }} className='p-2'>
                                {selectedproductid?.specId?.map((ele,index)=>(
                                    <ListGroup.Item key={ele?._id}>
                                        <Row>
                                            <Col xs={10}>
                                                <strong style={{ fontSize: '12px' }}>Specification Details: {index + 1}</strong>
                                            </Col>
                                            {/* <Col xs={2}>
                                                <Button variant='outline-success' size="sm" onClick={() => saveAddress(data)}>SAVE</Button>
                                            </Col> */}
                                        </Row>

                                        <Row className='locationTagHeader mt-2'>
                                            <Col>Price</Col>
                                            {ele?.spec_det?.map((e)=>(
                                                <Col>{e?.title}</Col>
                                            ))}
                                        </Row>
                                        <Row className='locationTagvalue'>
                                            <Col >{ele?.price}</Col>
                                            {ele?.spec_det?.map((e) => (
                                                <Col>{e?.value}</Col>
                                            ))}
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        {specifications.map((specification, index) => (
                            <Row key={index}>
                                <Col>
                                    <Form.Group controlId={`key-${index}`}>
                                        <Form.Label>Title :</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={specification.title}
                                            onChange={(e) => handleChange(index, e.target.value, specification.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col >
                                    <Form.Group controlId={`value-${index}`}>
                                        <Form.Label>Option :</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={specification.value}
                                            onChange={(e) => handleChange(index, specification.title, e.target.value)}
                                        />
                                        {/* <Form.Text className="text-muted">
                                            Separate values with commas (e.g., value1, value2).
                                        </Form.Text> */}
                                    </Form.Group>
                                </Col>
                                {/* <Col className='d-flex align-items-center'>
                                    <Form.Group controlId={`value-${index}`}>
                                        <Form>
                                            <Form.Check // prettier-ignore
                                                type="switch"
                                                id={`custom-switch-${index}`}
                                                label="User Select Option"
                                                checked={specification.user_choice}
                                                onChange={(e) => handleChange(index, specification.title, specification.value, e.target.checked)}
                                            />
                                        </Form>
                                    </Form.Group>
                                </Col> */}
                                <Col className='d-flex align-items-start'>
                                    <Button variant="danger" size="sm" onClick={() => removeSpecification(index)}>
                                        <IoMdCloseCircle size={26} />
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                    </Row>
                    <Row className="mt-2">
                        <Col xs={3}>
                            <Button variant="dark" size="sm" onClick={addSpecification}>
                                <IoIosAdd /> Add Title
                            </Button>
                        </Col>
                        {/* <Col xs={2}>
                            <Button variant="dark" size="sm" onClick={handleSubmit}>
                                Submit Form
                            </Button>
                        </Col> */}
                    </Row>
                    <Row>
                        <Col xs={6}>
                            <Form.Group>
                                <Form.Label>Product Price :</Form.Label>
                                <Form.Control
                                    type="tel"
                                    value={productPrice}
                                    placeholder="Enter Product Price"
                                    onChange={(e) => setproductPrice(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        {/* <Col xs={3}>
                            <Button variant="dark" size="sm" onClick={addSpecification}>
                                <IoIosAdd /> Add Title
                            </Button>
                        </Col> */}
                        <Col xs={2}>
                            <Button variant="dark" size="sm" onClick={handleSubmit}>
                                Submit Form
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
};


