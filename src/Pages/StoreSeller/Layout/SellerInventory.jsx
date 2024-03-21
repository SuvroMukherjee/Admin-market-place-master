import { DataGrid } from "@mui/x-data-grid";
// import "./Seller.css";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Form, ButtonGroup, Card } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlinePlus } from "react-icons/ai";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiEdit2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { OwnProductSellerList, SellerProductAdd, SellerProductList, StatusUpdateProduct, UpdateSellerProduct, UpdateSellerProductDataStatus, allBrandList, allCategoryList, allProductList, deleteProduct, getLowestPriceProdut, getSubCategoryByCategory } from "../../../API/api";
import Spinner from 'react-bootstrap/Spinner';
import { categoryData, demoProductData, productRows } from "../../../dummyData";
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
import './sellerlayout.css'
import { ChangeFormatDate, ChangeFormatDate2 } from "../../../common/DateFormat";
import { CSVLink } from 'react-csv';
import Papa from 'papaparse';
import { useRef } from "react";
import { LuDownload } from "react-icons/lu";
import { FaFileUpload } from "react-icons/fa";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';



export default function SellerInventory() {
    const [data, setData] = useState(demoProductData);
    const [loading, setLoading] = useState(true);
    const [allcategoryList, setAllCategoryList] = useState(categoryData);
    const [maindata, setMaindata] = useState([])
    const [allSubcategorylist, setSubCatgoryList] = useState(categoryData);
    const [allbrandList, setAllBrandList] = useState(categoryData);
    const [selectedRows, setSelectedRows] = useState([]);
    const [activeButton, setActiveButton] = useState('sell');
    const [sellerOwnData, setSellerOwnData] = useState([]);
    const [searchtext, setSearchtext] = useState();
    const initialQuantities = [];
    const [clearInput, setClearInput] = useState(false);
    const [csvData, setCsvData] = useState([]);
    const [importedData, setImportedData] = useState([]);
    const [stratuploading, setStartUploading] = useState(false)
    const [selectedOption, setSelectedOption] = useState('');
    const [viewLowestPriceData, setViewLowestPriceData] = useState();
    const [lowIndex, setLowIndex] = useState()


    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
        console.log('Selected option:', e.target.value);
        if (e.target.value == 'Low Stocks') {

            let filterData = maindata?.filter((ele) => {
                return ele?.available_qty < 10;
            })

            setData(filterData)
        }
        else if (e.target.value == 'InActive') {

            let filterData = maindata?.filter((ele) => {
                return ele?.status !== true;
            })

            console.log({ filterData })

            setData(filterData)
        }
        else if (e.target.value == 'Active') {

            let filterData = maindata?.filter((ele) => {
                return ele?.status == true;
            })

            console.log({ filterData })

            setData(filterData)
        }
        else if (e.target.value == "listRemoved") {
            let filterData = maindata?.filter((ele) => {
                return ele?.status !== true;
            })

            console.log({ filterData })

            setData(filterData)
        }
        else {
            getProductListFunc();
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            Papa.parse(file, {
                complete: (result) => {
                    // Access the parsed data in result.dat
                    setImportedData(result.data);
                    let Qarray = []
                    result?.data?.map((ele) => {
                        if (ele?.['Add Quantity']) {
                            Qarray.push(ele?.['Add Quantity'])
                        }
                    })
                    console.log({ Qarray })
                    setQuantities(Qarray)
                },
                header: true, // Set this to true if your CSV file has headers
            });
        }
    };


    // State for quantities
    const [quantities, setQuantities] = useState([]);

    // Function to update quantity at a specific index
    const setQuantityAtIndex = (index, value) => {
        // Create a copy of the quantities array
        const updatedQuantities = [...quantities];
        // Update the quantity at the specified index
        updatedQuantities[index] = value;
        // Update the state

        console.warn(updatedQuantities, 'updatedQuantities')

        setQuantities(updatedQuantities);
    };

    const { userId } = JSON.parse(localStorage.getItem('auth'));



    useEffect(() => {

        getProductListFunc();
        getAllCats();
        getBrandList();
        //getAllOwnProducts();

    }, []);


    const navigate = useNavigate()


    async function getProductListFunc() {
        await SellerProductList(userId).then((res) => {
            console.log(res?.data?.data, 'data')
            const dataWithUniqueIds = res?.data?.data?.SellerProductData?.map((item, index) => ({
                ...item,
                id: index + 1,
            }));
            setData(dataWithUniqueIds)
            setFormData(dataWithUniqueIds)
            setMaindata(dataWithUniqueIds)
            const csvDataArray = res?.data?.data?.SellerProductData?.map((ele, index) => ({
                Status: ele.status ? 'Active' : 'Inactive',
                // Image: ele.specId.image[0]?.image_path,
                SKU: ele.specId.skuId,
                'Product Name': `${ele?.productId?.brandId?.title} ${ele?.name}`,
                'Date Created': ChangeFormatDate(ele?.updatedAt),
                'Available Quantity': ele?.available_qty || 0,
                'MRP price': ele?.specId?.price,
                'Selling Price': ele?.price,
                'Shipping Price': ele?.shipping_cost,
                // 'Commission Price': Math.round(ele?.comission_price),
                // 'Net Disbursement': Math.round(ele?.price - ele?.comission_price),
                'Add Quantity': quantities[index], // Adjust this based on your logic
            }));
            console.log({ csvDataArray })
            setCsvData([...csvDataArray]);
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        }).finally((data) => {
            setLoading(false)
        })
    };

    async function getAllCats() {
        await allCategoryList().then((res) => {
            setAllCategoryList(res?.data?.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    async function getBrandList() {
        await allBrandList().then((res) => {
            console.log(res?.data?.data, 'brands');
            setAllBrandList(res?.data?.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    async function getAllOwnProducts() {
        setLoading(true)
        await OwnProductSellerList(userId).then((res) => {
            console.log(res?.data?.data, 'own data');
            const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
                ...item,
                id: index + 1,
            }));
            setSellerOwnData(dataWithUniqueIds)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleCategoryChange = async (e) => {
        console.log(e.target.value)
        setLoading(true)
        let filterData = maindata?.filter((ele) => {
            return ele?.categoryId?._id == e?.target?.value;
        })
        setData(filterData);

        await getSubCategoryByCategory(e?.target?.value).then((res) => {
            console.log(res?.data?.data, 'subcats');
            setSubCatgoryList(res?.data?.data)
        }).catch((err) => {
            console.log(err)
        })
        setLoading(false)

    }

    const handleSubChange = (e) => {
        setLoading(true);
        let filterData = maindata?.filter((ele) => {
            return ele?.subcategoryId?._id == e.target.value;
        })
        setData(filterData);
        setLoading(false)
    }

    const handleBrandChange = (e) => {
        console.log(e.target.value)
        setLoading(true);
        let filterData = maindata?.filter((ele) => {
            return ele?.brandId?._id == e.target.value;
        })
        setData(filterData);
        setLoading(false)
    }

    const AddSellerProduct = async (Pid) => {
        let payload = {
            "sellerId": userId,
            "productId": Pid
        }
        await SellerProductAdd(payload).then((res) => {
            console.log(res?.data?.data)
            if (res?.response?.data?.error !== false) {
                toast.success('product added successfully')
            } else {
                toast.error(res?.response?.data?.data)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

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




    const handleButtonClick = (buttonType) => {
        if (buttonType == 'sell') {
            setLoading(true)
            getProductListFunc();
        }
        else if (buttonType == 'own') {
            getAllOwnProducts();
        }
        setActiveButton(buttonType);
    };




    const navbarStyle = {
        paddingLeft: '0px', // Adjust the left padding
        paddingRight: '10px', // Adjust the right padding
        height: '5vh'
    };




    const [formData, setFormData] = useState([]);

    const handleUpdate = async (index) => {
        console.log(formData[index])
        console.log(quantities[index])

        formData[index].quantity = quantities[index] || 0;

        let res = await UpdateSellerProduct(formData[index]?._id, formData[index]);

        console.log({ res })

        if (res.data.error == false) {
            toast.success('Inventory update successfully...')
            setQuantities([])
            setClearInput(true);
            setTimeout(() => {
                setClearInput(false);
            }, 100);
            getProductListFunc();

        }

    }


    const handleQuansChange = (specIndex, quantity) => {
        console.log(specIndex, quantity);

        setFormData((prevData) => {
            const newData = [...prevData];
            newData[specIndex] = { ...newData[specIndex], quantity: parseInt(quantity) };
            return newData;
        });
    };

    const handlePriceChange = (specIndex, quantity) => {
        setFormData((prevData) => {
            const newData = [...prevData];
            newData[specIndex] = { ...newData[specIndex], price: quantity };
            return newData;
        });
    };

    const handleShippingChange = (specIndex, shipping) => {
        setFormData((prevData) => {
            const newData = [...prevData];
            newData[specIndex] = { ...newData[specIndex], shipping };
            return newData;
        });
    };

    const handleSearch = () => {

        let filterData = data?.filter((ele) => {
            return ele?.name?.toLowerCase()?.includes(searchtext?.toLowerCase()) || ele?.specId?.skuId?.toLowerCase()?.includes(searchtext?.toLowerCase())
        })

        console.warn({ filterData });
        setData(filterData);
    }

    const handleSaveAll = async () => {
        // Iterate through all rows and invoke handleUpdate for each
        setStartUploading(true)
        console.log({ formData })
        for (let index = 0; index < formData?.length; index++) {
            if (formData[index]?.quantity > 0) {
                await handleUpdate(index);
            }
        }

        // Optionally, perform any additional actions after saving all
        // For example, reset state, show a success message, fetch updated data, etc.
        setQuantities([]);
        setClearInput(true);
        setTimeout(() => {
            setClearInput(false);
        }, 100);
        // getProductListFunc();
        setTimeout(() => {
            toast.success(' 🚀 All inventory updated successfully...');
            setStartUploading(false)
        }, 2000)
    };


    const fileInputRef = useRef(null);

    const handleChooseFile = () => {
        fileInputRef.current.click();
    };

    const closeListingProduct = async (data) => {

        let paylod = {
            status: !data?.status
        }

        let res = await UpdateSellerProductDataStatus(data?._id, paylod)

        getProductListFunc();
    }

    const getLowestPriceFunc = async (ele, index) => {

        console.log(ele)

        let res = await getLowestPriceProdut(ele?.productId?._id);

        const lowestPriceProduct = res?.data?.data.reduce((minProduct, product) => {
            return product.price < minProduct.price ? product : minProduct;
        }, res?.data?.data[0]);

        console.log('Lowest price:', lowestPriceProduct);

        setViewLowestPriceData(lowestPriceProduct)

        console.log(res?.data?.data)
        setLowIndex(index)

        // /setViewLowestPriceData
    }

    return (
        <div>
            <Container className="mt-4">
                <Row className="mt-4">
                    <Col className="dtext2">Manage Your Inventory : <span style={{ fontSize: '12px' }}>Total Products {data?.length}</span> </Col>
                </Row>
                <Row className="mt-4">
                    <Col xs={4}>
                        <Form.Control
                            type="text"
                            size="sm"
                            placeholder="Search by SKU or Product name"
                            name="searchtext"
                            required
                            value={searchtext}
                            onChange={(e) => setSearchtext(e.target.value)}
                        />
                    </Col>
                    <Col xs={2}>
                        <Button variant="warning" size="sm" onClick={() => handleSearch()}>Search</Button>
                    </Col>
                    <Col xs={2}>
                        <Button variant="dark" size="sm" onClick={() => { getProductListFunc(); setSearchtext('') }}>See All Products</Button>
                    </Col>
                </Row>

                <div class="d-flex flex-row-reverse mt-4">
                    <div class="p-2">
                        {csvData?.length > 0 &&
                            <CSVLink size="sm" data={csvData} filename={`product_data.csv`} className="downloadCSV">
                                <LuDownload /> Download CSV
                            </CSVLink>}
                    </div>
                    <div class="p-2">
                        <Button size="sm" variant="outline-dark" className="uploadCSV" onClick={handleChooseFile}><span className="m-1"><FaFileUpload /> </span>Import CSV</Button>
                        <input type="file" ref={fileInputRef} accept=".csv" style={{ display: 'none' }} onChange={handleFileUpload} />
                    </div>
                    <div class="p-2">
                        {importedData?.length > 0 &&
                            <Row>
                                <Button size="sm" variant="dark" className="uploadCSV" onClick={handleSaveAll}>
                                    Save All
                                    <span className="m-2">
                                        {stratuploading ? (
                                            <Spinner animation="border" size="sm" />
                                        ) : (
                                            `(${quantities?.filter(element => element !== 0)?.length} products changes)`
                                        )}
                                    </span>
                                </Button>

                            </Row>}
                    </div>
                </div>
                <Row className="mt-2 mx-1 p-2 inventoryBg">
                    <Col className="customRadiolabel">Listing Status : </Col>
                    <Col xs={12}>
                        <Row>

                            <Col className="d-flex justify-content-start align-items-center">
                                <Form.Check
                                    type="radio"
                                    label="All"
                                    name="options"
                                    id="allRadio"
                                    className="customRadio"
                                    value="All"
                                    checked={selectedOption === 'All'}
                                    onChange={handleOptionChange}
                                />
                            </Col>
                            <Col className="d-flex justify-content-start align-items-center">
                                <Form.Check
                                    type="radio"
                                    label="InActive"
                                    name="options"
                                    id="inactiveRadio"
                                    className="customRadio"
                                    value="InActive"
                                    checked={selectedOption === 'InActive'}
                                    onChange={handleOptionChange}
                                />
                            </Col>
                            <Col className="d-flex justify-content-start align-items-center">
                                <Form.Check
                                    type="radio"
                                    label="Active"
                                    name="options"
                                    className="customRadio"
                                    id="activeRadio"
                                    value="Active"
                                    checked={selectedOption === 'Active'}
                                    onChange={handleOptionChange}
                                />
                            </Col>
                            <Col className="d-flex justify-content-start align-items-center">
                                <Form.Check
                                    type="radio"
                                    label="Listing Removed"
                                    name="options"
                                    className="customRadio"
                                    id="listRemovedRadio"
                                    value="listRemoved"
                                    checked={selectedOption === 'listRemoved'}
                                    onChange={handleOptionChange}
                                />
                            </Col>
                            <Col className="d-flex justify-content-start align-items-center">
                                <Form.Check
                                    type="radio"
                                    label="Low In Stocks"
                                    name="options"
                                    id="lowStocksRadio"
                                    className="customRadio"
                                    value="Low Stocks"
                                    checked={selectedOption === 'Low Stocks'}
                                    onChange={handleOptionChange}
                                />
                            </Col>
                            <Col className="d-flex justify-content-center align-items-center">
                                <Button size="sm" variant="outline-dark">Additional Filters</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Image</th>
                                    <th>SKU</th>
                                    <th>Product Name</th>
                                    <th>Date Created</th>
                                    <th>Available Quantity</th>
                                    <th>MRP price</th>
                                    <th>Selling Price</th>
                                    <th>Shipping Price</th>
                                    <th>Commission Price</th>
                                    <th>Net Disbursement</th>
                                    <th>Add Stock</th>
                                    <th>Action</th>
                                    <th>Other Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.length > 0 && data?.map((ele, index) => (
                                    <tr style={{ background: 'red' }}>
                                        <td>{ele?.status ? <span style={{ color: 'green' }}>Active</span> : <span style={{ color: 'red' }}>Not Active</span>}<br />
                                        </td>
                                        <td>
                                            <Image src={ele?.specId?.image?.[0]?.image_path} fluid width={60} height={60} />
                                        </td>
                                        <td onClick={() => navigate(`/seller/product-deatils/${ele?._id}`)}>{ele?.specId?.skuId}</td>
                                        <td onClick={() => navigate(`/seller/product-deatils/${ele?._id}`)} className="pname">{ele?.productId?.brandId?.title} {ele?.name}</td>
                                        <td className="datecolor">{ChangeFormatDate2(ele?.updatedAt)}</td>
                                        <td className="avaible">
                                            {ele?.available_qty || 0}
                                        </td>
                                        <td>
                                            {ele?.specId?.price}
                                        </td>
                                        <td className="priceTD">
                                            <Form.Control
                                                type="tel"
                                                size="sm"
                                                placeholder="Product Price"
                                                name="price"
                                                required
                                                // value={formData[index]?.price}
                                                onChange={(e) => handlePriceChange(index, e.target.value)}
                                                defaultValue={ele?.price}

                                            />
                                            <br /> <span onClick={() => getLowestPriceFunc(ele, index)}>
                                                <p className="viewLowestPrice" size="sm"> View Lowest Price</p>
                                            </span>
                                            {lowIndex == index &&
                                                <span style={{ fontWeight: '500' }}>
                                                    Lowest Price :₹{viewLowestPriceData?.price?.toFixed(2)} + ₹ {viewLowestPriceData?.shipping_cost}
                                                </span>}
                                        </td>
                                        <td className="w-40">
                                            <Form.Control
                                                type="tel"
                                                size="sm"
                                                placeholder="Shipping Price"
                                                name="shipping_cost"
                                                required
                                                // value={formData[index]?.price}
                                                onChange={(e) => handleShippingChange(index, e.target.value)}
                                                defaultValue={ele?.shipping_cost}

                                            />

                                        </td>
                                        <td>{Math.round(ele?.price - ele?.comission_price)}</td>
                                        <td>{Math.round(ele?.comission_price)?.toLocaleString()}</td>
                                        <td>

                                            <Form.Control
                                                type="number"
                                                size="sm"
                                                placeholder="Add Stock"
                                                name="quantity"
                                                required
                                                value={clearInput ? '' : quantities?.[index]}
                                                // value={formData[index]?.price}
                                                onChange={(e) => setQuantityAtIndex(index, parseInt(e.target.value))}
                                            />

                                        </td>

                                        <td>
                                            <Button size="sm" variant="warning" onClick={() => handleUpdate(index)}>Save</Button>
                                        </td>
                                        <td className="priceTD">
                                            {/* <Button size="sm">Offer</Button> */}
                                            <DropdownButton className="w-100" id="dropdown-basic-button" title="Edit" size="sm" variant="secondary">
                                                <Dropdown.Item onClick={() => navigate(`/seller/product-deatils/${ele?._id}`)}>View Details</Dropdown.Item>
                                                <Dropdown.Item onClick={() => navigate(`/seller/seller-product-edit/${ele?._id}/new-offers/${ele?._id}`)}>Apply Offers</Dropdown.Item>
                                                <Dropdown.Item onClick={() => navigate(`/seller/add-ofers/${ele?._id}`)}>Edit Product</Dropdown.Item>
                                                <Dropdown.Item onClick={() => navigate(`/seller/seller-product-edit/${ele?._id}/new-mainVariants/${ele?._id}`)}>Manage Images</Dropdown.Item>
                                                <Dropdown.Item onClick={() => navigate(`/seller/seller-product-edit/${ele?._id}/new-mainVariants/${ele?._id}`)}>New Variations</Dropdown.Item>
                                                <Dropdown.Item onClick={() => closeListingProduct(ele)}>{ele?.status ? 'Close Listing' : 'Start Listing'}</Dropdown.Item>
                                            </DropdownButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Toaster position="top-right" />
            </Container>
        </div>
    )

}
