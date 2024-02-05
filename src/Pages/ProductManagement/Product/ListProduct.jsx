import { DataGrid } from "@mui/x-data-grid";
import "../product.css";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row, Modal, Form, ListGroup, Image } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlinePlus } from "react-icons/ai";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiEdit2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { BulkProductUpload, DeleteProductSpecification, FileUpload, ProductSpecificationCreate, SpecBulkProductUpload, StatusUpdateProduct, UpdateProductSpecification, allProductList, deleteProduct } from "../../../API/api";
import Spinner from 'react-bootstrap/Spinner';
import { productRows } from "../../../dummyData";
import { PiFileCsvDuotone } from "react-icons/pi";
import { IoIosAdd, IoMdCloseCircle } from 'react-icons/io';
import { RiListSettingsFill } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { PiFileCsvLight } from "react-icons/pi";
import { FaTrashAlt } from "react-icons/fa";

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
        getProductListFunc();
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
                        <img className="productListImg" src={params?.row?.image?.[0]?.image_path} alt="" />
                        {params?.row?.image?.length > 1 && <span>{params?.row?.image?.length - 1}+</span>}
                    </div>
                );
            }
        },
        // { field: "regular_price", headerName: "Price", width: 150, },
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
            field: "status", headerName: "Status", width: 100, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params?.row?.status ? <span className="ActiveStatus">Active</span> : <span className="DeactiveStatus">Not Active</span>}
                    </div>
                );
            }
        },
        { field: "type", headerName: "Type", width: 100 },
        {
            field: "action",
            headerName: "Actions",
            width: 400,
            renderCell: (params) => {
                return (
                    <>

                        <div className="buttonWrapper">
                            <Button variant="info" onClick={() => { handleShowModal(); setSeledtedProductId(params?.row) }} size="sm">
                                <RiListSettingsFill /> Add Specification
                            </Button>
                            {/* <Button className="addCategoryButton" size="sm" variant="danger" >
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
                                                <PiFileCsvDuotone /> 
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Button> */}
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
    const fileInputRef2 = useRef(null);

    const handleFileChange = (event) => {

        const file = event.target.files[0];
        if (file) {
            // Handle the file, e.g., upload or process it
            onFileUpload(file,'product')
        }
    };

    const handleFileChangeSpec = (event) => {

        const file = event.target.files[0];
        if (file) {
            // Handle the file, e.g., upload or process it
            onFileUpload(file,'spec')
        }
    };

    const handleButtonClick = () => {
        // Trigger the hidden file input
        console.log({fileInputRef})
        fileInputRef.current.click();
    };


    const onFileUpload = async (file, type) => {
        try {
           
            setUploading(true);

            const formData = new FormData();
            formData.append("file", file);

            const uploadResponse = await FileUpload(formData);
            const fileName = uploadResponse?.data?.data?.fileName;

            if (!fileName) {
                throw new Error("File upload failed");
            }

            const payload = { "file": fileName };
            const Bulkres = type == 'spec' ? await SpecBulkProductUpload(payload) : await BulkProductUpload(payload);

            if (Bulkres?.data?.error === false) {
                toast.success(`Upload successful: ${file.name}`);
                getProductListFunc();
            } else {
                throw new Error(`Could not upload file: ${file.name}`);
            }
        } catch (error) {
            console.error("Error in file upload:", error.message);
            toast.error(`Error in file upload: ${error.message}`);
        } finally {
            setUploading(false);
            getProductListFunc();
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
                          <Row>
                                <Col >
                                    <div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                        />
                                        <Button size='sm' variant="success" onClick={() => fileInputRef.current.click()}><PiFileCsvLight size="20" /> Product via CSV</Button>
                                    </div>
                            </Col>
                            <Col>
                                    <div>
                                        <input
                                            type="file"
                                            ref={fileInputRef2}
                                            style={{ display: 'none' }}
                                            onChange={handleFileChangeSpec}
                                        />
                                        <Button size='sm' variant="success" onClick={() => fileInputRef2.current.click()}><PiFileCsvLight size="20" />   Specification via CSV</Button>
                                    </div>
                            </Col>
                            <Col>
                                    <Button size="sm" variant="dark" onClick={() => navigate('/Admin/Addproduct')}>
                                        <AiOutlinePlus /> Add New Product
                                    </Button>
                            </Col>
                          </Row>
                        </Col>
                    
                        {/* <Col className="d-flex justify-content-end p-2">
                            
                                
                           
                                    
                                
                            
                            <Button className="addCategoryButton" variant="dark" >
                                <div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}

                                        onChange={handleFileChangeSpec}
                                    />
                                    <Button variant="dark" onClick={handleButtonClick}>
                                        {uploading ? (
                                            <Spinner animation="border" size="sm" />
                                        ) : (
                                            <>
                                                <PiFileCsvDuotone /> CSV Upload Spec
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Button>
                            <Button className="addCategoryButton" variant="dark" onClick={() => navigate('/Admin/Addproduct')}>
                                <AiOutlinePlus /> Add New Product
                            </Button>
                        </Col> */}
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col style={{ height: 400, width: '100%' }}>
                            {data?.length > 0 ?
                                <DataGrid
                                    rows={data}
                                    columns={columns}
                                    pageSize={2}
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

    const [productPrice, setproductPrice] = useState(0);

    const [isEdit, setIsEdit] = useState(false);

    const [productImges, setProductImages] = useState([]);

    const [selectedSpecId, setSelectedSpecId] = useState()

    const handleChange = (index, title, value) => {
        setSpecifications((prevSpecifications) => {
            const newSpecifications = [...prevSpecifications];
            newSpecifications[index] = { title, value };
            return newSpecifications;
        });
    };

    const addSpecification = () => {
        setSpecifications((prevSpecifications) => [
            ...prevSpecifications,
            { title: '', value: '' }, // Set user_choice to a default value
        ]);
    };

    const removeSpecification = (index) => {
        setSpecifications((prevSpecifications) => {
            const newSpecifications = [...prevSpecifications];
            newSpecifications.splice(index, 1);
            return newSpecifications;
        });
    };

    const handleSubmit = async () => {
        console.log('Submitted Data:', specifications);
        let payload = {
            productId: selectedproductid?._id,
            spec_det: specifications,
            price: productPrice,
            image: productImges,
            skuId: generateRandomKey(),
            // user_choice:false,
        }

        console.log(payload)

        let res = await ProductSpecificationCreate(payload);

        if (res?.data?.error) {
            toast.error('Something went wrong..')
        } else {
            console.log({ payload })
            getProductListFunc();
            setSpecifications([{
                title: '',
                value: '',
                //user_choice: false,
            }])
            setproductPrice('')
            setProductImages([])
            handleCloseModal(); // Close the modal after submitting
        }
    };


    const EdithandleSubmit = async () => {
        console.log('Submitted Data:', specifications);
        let payload = {
            productId: selectedproductid?._id,
            spec_det: specifications,
            price: productPrice,
            image: productImges,
            skuId: generateRandomKey(),
            // user_choice:false,
        }

        console.log(payload)

        let res = await UpdateProductSpecification(payload, selectedSpecId);

        if (res?.data?.error) {
            toast.error('Something went wrong..')
        } else {
            console.log({ payload })
            getProductListFunc();
            setSpecifications([{
                title: '',
                value: '',
                //user_choice: false,
            }])
            setproductPrice('')
            setProductImages([])
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

    // const [selectedFiles, setSelectedFiles] = useState([]);

    // const handleFileSelect = (files) => {
    //     setSelectedFiles(files);
    // };

    // const handleUpload = () => {
    //     console.log(selectedFiles);
    // };

    // const onFileUpload = async (file) => {
    //     //setUploading(true)
    //     const formData = new FormData();
    //     formData.append("file", file);

    //     try {
    //         const res = await FileUpload(formData);
    //         console.log(res?.data?.data)

    //         setTimeout(() => {
    //             setProductImages((prevData) => [
    //                 ...prevData,
    //                 res?.data?.data?.fileurl
    //             ]);
    //         }, 3000);
    //     } catch (err) {
    //         console.error(err, "err");
    //     }
    // };\

    const handleFileImageChange = async (event) => {
        const files = event.target.files;

        if (files.length > 0) {
            const selectedFiles = Array.from(files);
            console.log('Selected Files:', selectedFiles);
            selectedFiles.forEach((file, index) => {
                console.log(`File ${index + 1}:`, file);
            });

            for (const file of selectedFiles) {
                await onFileUpload(file);
            }
        }
    }

    const onFileUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await FileUpload(formData);
            console.log(res?.data?.data);

            setTimeout(() => {
                setProductImages((prevData) => [
                    ...prevData,
                    { image_path:  res?.data?.data?.fileurl}
                ]);
            }, 3000);
        } catch (err) {
            console.error(err, "err");
        }
    };

    const deleteImage = (id) => {
        console.log('clc')
        let filterData = productImges?.filter((ele, i) => {
            return i != id;
        })
        console.log({ filterData })
        setProductImages(filterData)
    }


    const EditHandler = (id) => {
        setSelectedSpecId(id)
        setIsEdit(true)
        let filterSpecData = selectedproductid?.specId?.find((ele) => {
            return ele?._id == id;
        })
        setSpecifications(filterSpecData?.spec_det)
        setProductImages(filterSpecData?.image)
        setproductPrice(filterSpecData?.price)
        console.log(filterSpecData)
    }

    console.table(productImges)


    const deleteSpec = async(id) =>{
     
        let res = await DeleteProductSpecification(id);
        console.log(res)
        if (res?.data?.error) {
            toast.error('Something went wrong..')
        } else {
          toast.success('Spec delete successfully')
          handleCloseModal();
        }

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
                                {selectedproductid?.specId?.map((ele, index) => (
                                    <ListGroup.Item key={ele?._id}>
                                        <Row>
                                            <Col xs={9}>
                                                <strong style={{ fontSize: '12px' }}>Specification Details: {index + 1}</strong>
                                            </Col>
                                            <Col xs={2}>
                                                <Button variant='success' size="sm" onClick={() => EditHandler(ele?._id)}><CiEdit /> EDIT</Button>
                                            </Col>
                                            <Col xs={1}>
                                                <Button variant='danger' size="sm" onClick={() => deleteSpec(ele?._id)}><FaTrashAlt /></Button>
                                            </Col>
                                        </Row>

                                        <Row className='locationTagHeader mt-2'>
                                            <Col>Price</Col>
                                            {ele?.spec_det?.map((e) => (
                                                <Col>{e?.title}</Col>
                                            ))}
                                            <Col>Images</Col>
                                        </Row>
                                        <Row className='locationTagvalue'>
                                            <Col >{ele?.price}</Col>
                                            {ele?.spec_det?.map((e) => (
                                                <Col>{e?.value}</Col>
                                            ))}
                                            <Col size={2}>
                                                {/* {ele?.image?.map((ele)=>(
                                                <Row>
                                                    <Col>
                                                         <Image src={ele} rounded />
                                                    </Col>
                                                </Row>
                                             ))} */}
                                                {ele?.image?.length}
                                            </Col>
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
                                    </Form.Group>
                                </Col>
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
                        <Col>
                            <Form.Group>
                                <Form.Group controlId="formFileMultiple" className="mb-3">
                                    <Form.Label>Choose Multiple Files</Form.Label>
                                    <Form.Control type="file" multiple onChange={handleFileImageChange} />
                                </Form.Group>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Row>
                                {productImges?.length > 0 && productImges?.map((ele, index) => (
                                    <Col xs={2}>
                                        <span>{index + 1}</span>
                                        <span><MdCancel style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }}
                                            onClick={() => deleteImage(index)}
                                        /></span>
                                        <Image src={ele?.image_path} thumbnail />
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        {/* <Col xs={3}>
                            <Button variant="dark" size="sm" onClick={addSpecification}>
                                <IoIosAdd /> Add Title
                            </Button>
                        </Col> */}
                        <Col xs={2}>
                            {isEdit ?
                                <Button variant="dark" size="sm" onClick={EdithandleSubmit}>
                                    Update Form
                                </Button>
                                :
                                <Button variant="dark" size="sm" onClick={handleSubmit}>
                                    Submit Form
                                </Button>}
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
};



// const FileUploadButton = ({ onFileSelect }) => {
//     const handleFileChange = (e) => {
//         const selectedFiles = Array.from(e.target.files);
//         onFileSelect(selectedFiles);
//     };

//     return (
//         <Form.Group controlId="formFileMultiple" className="mb-3">
//             <Form.Label>Choose Multiple Files</Form.Label>
//             <Form.Control type="file" multiple onChange={handleFileChange} />
//         </Form.Group>
//     );
// };


