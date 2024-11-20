// import "./Seller.css";
import Papa from "papaparse";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import { CSVLink } from "react-csv";
import toast, { Toaster } from "react-hot-toast";
import { FaFileUpload, FaMagic } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import {
  GetAllServices,
  SellerProductList,
  UpdateSellerProduct,
  UpdateSellerProductDataStatus,
  addSerivices,
  getLowestPriceProdut,
  getSearcKeyword,
} from "../../../API/api";
import {
  ChangeFormatDate,
  ChangeFormatDate2,
} from "../../../common/DateFormat";
import "./sellerlayout.css";
import Modal from "react-bootstrap/Modal";
import { estimatedDeliveryTimes } from "../../../dummyData";
import SellerStock from "./SellerStock";

export default function SellerInventory() {
  // const [data, setData] = useState([]);
  // const [searchtext, setSearchtext] = useState("");
  // const [clearInput, setClearInput] = useState(false);
  // const [csvData, setCsvData] = useState([]);
  // const [importedData, setImportedData] = useState([]);
  // const [stratuploading, setStartUploading] = useState(false);
  // const [selectedOption, setSelectedOption] = useState("");
  // const [viewLowestPriceData, setViewLowestPriceData] = useState();
  // const [lowIndex, setLowIndex] = useState();
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");
  // const [show, setShow] = useState(false);
  // const [showService, setShowServices] = useState(false);
  // const [selectedProduct, setSelectedProduct] = useState();
  // const [selectedTime, setSelectedTime] = useState("select");

  // const handleSelectEstimateChange = (event) => {
  //   const selectedValue = event.target.value;
  //   setSelectedTime(selectedValue);
  //   console.log(`Selected Delivery Time: ${selectedValue}`);
  // };

  // const handleOptionChange = (e) => {
  //   setSelectedOption(e.target.value);
  //   console.log("Selected option:", e.target.value);
  // };

  // const handleFileUpload = (event) => {
  //   const file = event.target.files[0];

  //   if (file) {
  //     Papa.parse(file, {
  //       complete: (result) => {
  //         // Access the parsed data in result.dat
  //         setImportedData(result.data);
  //         let Qarray = [];
  //         result?.data?.map((ele) => {
  //           if (ele?.["Add Quantity"]) {
  //             Qarray.push(ele?.["Add Quantity"]);
  //           }
  //         });
  //         console.log({ Qarray });
  //         setQuantities(Qarray);
  //       },
  //       header: true, // Set this to true if your CSV file has headers
  //     });
  //   }
  // };

  // // State for quantities
  // const [quantities, setQuantities] = useState([]);

  // // Function to update quantity at a specific index
  // const setQuantityAtIndex = (index, value) => {
  //   // Create a copy of the quantities array
  //   const updatedQuantities = [...quantities];
  //   // Update the quantity at the specified index
  //   updatedQuantities[index] = value;
  //   // Update the state

  //   console.warn(updatedQuantities, "updatedQuantities");

  //   setQuantities(updatedQuantities);
  // };

  // //  useEffect(() => {
  // //    console.log("call");
  // //    getServices();
  // //  }, []);

  // //  async function getServices() {
  // //    let res = await GetAllServices();
  // //    console.log(res?.data?.data, "ff");
  // //    setServices(res?.data?.data);
  // //  }

  // const { userId } = JSON.parse(localStorage.getItem("auth"));

  // useEffect(() => {
  //   getProductListFunc();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const navigate = useNavigate();

  // async function getProductListFunc() {
  //   await SellerProductList(userId)
  //     .then((res) => {
  //       console.log(res?.data?.data, "data");
  //       const dataWithUniqueIds = res?.data?.data?.SellerProductData?.map(
  //         (item, index) => ({
  //           ...item,
  //           id: index + 1,
  //         })
  //       );
  //       setData(dataWithUniqueIds);
  //       setFormData(dataWithUniqueIds);
  //       const csvDataArray = res?.data?.data?.SellerProductData?.map(
  //         (ele, index) => ({
  //           Status: ele?.status ? "Active" : "Inactive",
  //           SKU: ele?.specId?.skuId,
  //           "Product Name": `${ele?.productId?.brandId?.title} ${ele?.name}`,
  //           "Date Created": ChangeFormatDate(ele?.updatedAt),
  //           "Available Quantity": ele?.available_qty || 0,
  //           "MRP price": ele?.specId?.price,
  //           "Selling Price": ele?.price,
  //           "Shipping Price": ele?.shipping_cost,
  //           "Add Quantity": quantities[index], // Adjust this based on your logic
  //         })
  //       );
  //       console.log({ csvDataArray });
  //       setCsvData([...csvDataArray]);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  // const [formData, setFormData] = useState([]);

  // // const handleUpdate = async (index) => {
  // //   console.log(formData[index]);
  // //   console.log(quantities[index]);

  // //   formData[index].quantity = quantities[index] || 0;

  // //   let res = await UpdateSellerProduct(formData[index]?._id, formData[index]);

  // //   console.log({ res });

  // //   if (res.data.error == false) {
  // //     toast.success("Inventory update successfully...");
  // //     setQuantities([]);
  // //     setClearInput(true);
  // //     setTimeout(() => {
  // //       setClearInput(false);
  // //     }, 100);
  // //     getProductListFunc();
  // //   }
  // // };

  // const handleUpdate = async (key) => {
  //   const index = formData.findIndex((item) => item._id === key);
  //   if (index === -1) return;

  //   console.log(formData[index]);
  //   console.log(quantities[key]);

  //   formData[index].quantity = quantities[key] || 0;

  //   console.log(formData[index]?._id, formData[index],'lllllllll');

  //   let res = await UpdateSellerProduct(formData[index]?._id, formData[index]);

  //   console.log({ res });

  //   if (res.data.error == false) {
  //     toast.success("Inventory updated successfully...");
  //     setQuantities([]);
  //     setClearInput(true);
  //     setTimeout(() => {
  //       setClearInput(false);
  //     }, 100);
  //     getProductListFunc();
  //   }
  // };

  // // const handlePriceChange = (specIndex, quantity) => {
  // //   setFormData((prevData) => {
  // //     const newData = [...prevData];
  // //     newData[specIndex] = { ...newData[specIndex], price: quantity };
  // //     return newData;
  // //   });
  // // };

  // const handlePriceChange = (key, quantity) => {
  //   setFormData((prevData) => {
  //     const newData = [...prevData];
  //     const index = newData.findIndex((item) => item._id === key);
  //     if (index !== -1) {
  //       newData[index] = { ...newData[index], price: quantity };
  //     }
  //     return newData;
  //   });
  // };

  // const handleShippingChange = (specIndex, shipping) => {
  //   setFormData((prevData) => {
  //     const newData = [...prevData];
  //     newData[specIndex] = { ...newData[specIndex], shipping };
  //     return newData;
  //   });
  // };

  // const handleSaveAll = async () => {
  //   // Iterate through all rows and invoke handleUpdate for each
  //   setStartUploading(true);
  //   console.log({ formData });
  //   for (let index = 0; index < formData?.length; index++) {
  //     if (formData[index]?.quantity > 0) {
  //       await handleUpdate(index);
  //     }
  //   }

  //   // Optionally, perform any additional actions after saving all
  //   // For example, reset state, show a success message, fetch updated data, etc.
  //   setQuantities([]);
  //   setClearInput(true);
  //   setTimeout(() => {
  //     setClearInput(false);
  //   }, 100);
  //   // getProductListFunc();
  //   setTimeout(() => {
  //     toast.success(" 🚀 All inventory updated successfully...");
  //     setStartUploading(false);
  //   }, 2000);
  // };

  // const fileInputRef = useRef(null);

  // const handleChooseFile = () => {
  //   fileInputRef.current.click();
  // };

  // const closeListingProduct = async (data) => {
  //   let paylod = {
  //     status: !data?.status,
  //   };

  //   await UpdateSellerProductDataStatus(data?._id, paylod);

  //   getProductListFunc();
  // };

  // const getLowestPriceFunc = async (ele, index) => {
  //   console.log(ele);

  //   let res = await getLowestPriceProdut(ele?.productId?._id);

  //   const lowestPriceProduct = res?.data?.data.reduce((minProduct, product) => {
  //     return product.price < minProduct.price ? product : minProduct;
  //   }, res?.data?.data[0]);

  //   console.log("Lowest price:", lowestPriceProduct);

  //   setViewLowestPriceData(lowestPriceProduct);

  //   console.log(res?.data?.data);
  //   setLowIndex(index);

  //   // /setViewLowestPriceData
  // };

  // let filterData = [...data];

  // if (searchtext.length > 0) {
  //   filterData = data?.filter((ele) => {
  //     return (
  //       ele?.name?.toLowerCase()?.includes(searchtext?.toLowerCase()) ||
  //       ele?.specId?.skuId
  //         ?.toLowerCase()
  //         ?.includes(searchtext?.toLowerCase()) ||
  //       ele?.productId?.brandId?.title
  //         ?.toLowerCase()
  //         ?.includes(searchtext?.toLowerCase())
  //     );
  //   });
  // }

  // if (selectedOption.length > 0) {
  //   if (selectedOption == "Low Stocks") {
  //     filterData = filterData?.filter((ele) => {
  //       return ele?.available_qty < 10;
  //     });
  //   } else if (selectedOption == "InActive") {
  //     filterData = filterData?.filter((ele) => {
  //       return ele?.status !== true;
  //     });
  //   } else if (selectedOption == "Active") {
  //     filterData = filterData?.filter((ele) => {
  //       return ele?.status == true;
  //     });
  //   } else if (selectedOption == "listRemoved") {
  //     filterData = filterData?.filter((ele) => {
  //       return ele?.status !== true;
  //     });
  //   }
  // }

  // if (startDate.length > 0 && endDate.length > 0) {
  //   //  if end date is smaller than start date then show error toast
  //   if (new Date(startDate) > new Date(endDate)) {
  //     toast.error("End date should be greater than start date", {
  //       position: "bottom-right",
  //       style: {
  //         background: "red",
  //         color: "white",
  //       },
  //     });
  //     setStartDate("");
  //     setEndDate("");
  //   } else {
  //     filterData = filterData?.filter((ele) => {
  //       const updatedAtDate = new Date(ele?.updatedAt);
  //       return (
  //         updatedAtDate > new Date(startDate) &&
  //         updatedAtDate < new Date(endDate)
  //       );
  //     });
  //   }
  // }

  // const EstimateHandler = (ele) => {
  //   setSelectedProduct(ele);
  //   handleShow();
  // };

  // const ServiceHandler = (ele) => {
  //   setSelectedProduct(ele);
  //   handleOpenService();
  // };

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  // const handleOpenService = () => setShowServices(true);
  // const handleCloseService = () => setShowServices(false);

  // const updateEstimatedDelivey = async () => {
  //   let res = await UpdateSellerProduct(selectedProduct?._id, {
  //     ...selectedProduct,
  //     estimateDate: selectedTime,
  //   });
  //   console.log(res);
  //   if (res.data.error == false) {
  //     toast.success("Estimate date update Successfully");
  //     setTimeout(() => {
  //       handleClose();
  //     }, 1000);
  //     setSelectedProduct("");
  //     setSelectedTime("");
  //     getProductListFunc();
  //   }
  // };

  return (
    <div>
      {/* <Container className="mt-4">
        <Row className="mt-4">
          <Col className="dtext2">
            Manage Your Inventory :{" "}
            <span style={{ fontSize: "14px" }}>
              Your Selling Products {data?.length}
            </span>{" "}
          </Col>
        </Row>

        <div className="d-flex flex-row-reverse mt-4">
          <div className="p-2">
            {csvData?.length > 0 && (
              <CSVLink
                size="sm"
                data={csvData}
                filename={`product_data.csv`}
                className="downloadCSV"
              >
                <LuDownload /> Download CSV
              </CSVLink>
            )}
          </div>
          <div className="p-2">
            <Button
              size="sm"
              variant="outline-dark"
              className="uploadCSV"
              onClick={handleChooseFile}
            >
              <span className="m-1">
                <FaFileUpload />{" "}
              </span>
              Import CSV
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </div>
          <div className="p-2">
            {importedData?.length > 0 && (
              <Row>
                <Button
                  size="sm"
                  variant="dark"
                  className="uploadCSV"
                  onClick={handleSaveAll}
                >
                  Save All
                  <span className="m-2">
                    {stratuploading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      `(${
                        quantities?.filter((element) => element !== 0)?.length
                      } products changes)`
                    )}
                  </span>
                </Button>
              </Row>
            )}
          </div>
        </div>

        <Row className="mt-2 p-2 inventoryBg">
          <Col className="customRadiolabel mb-2">
            Products Found : {filterData?.length}{" "}
          </Col>
          <Col xs={12}>
            <Row>
              <Col className="d-flex justify-content-center align-items-center">
                <Form.Check
                  type="radio"
                  label="All"
                  name="options"
                  id="allRadio"
                  className="customRadio"
                  value="All"
                  checked={selectedOption === "All"}
                  onChange={handleOptionChange}
                />
              </Col>
              <Col className="d-flex justify-content-center align-items-center">
                <Form.Check
                  type="radio"
                  label="InActive"
                  name="options"
                  id="inactiveRadio"
                  className="customRadio"
                  value="InActive"
                  checked={selectedOption === "InActive"}
                  onChange={handleOptionChange}
                />
              </Col>
              <Col className="d-flex justify-content-center align-items-center">
                <Form.Check
                  type="radio"
                  label="Active"
                  name="options"
                  className="customRadio"
                  id="activeRadio"
                  value="Active"
                  checked={selectedOption === "Active"}
                  onChange={handleOptionChange}
                />
              </Col>
              <Col className="d-flex justify-content-center align-items-center">
                <Form.Check
                  type="radio"
                  label="Listing Removed"
                  name="options"
                  className="customRadio"
                  id="listRemovedRadio"
                  value="listRemoved"
                  checked={selectedOption === "listRemoved"}
                  onChange={handleOptionChange}
                />
              </Col>
              <Col className="d-flex justify-content-center align-items-center">
                <Form.Check
                  type="radio"
                  label="Low In Stocks"
                  name="options"
                  id="lowStocksRadio"
                  className="customRadio"
                  value="Low Stocks"
                  checked={selectedOption === "Low Stocks"}
                  onChange={handleOptionChange}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Form.Label className="customDatelable">
                  Search Product:
                </Form.Label>
                <InputGroup size="sm" className="mb-3">
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    Search
                  </InputGroup.Text>
                  <Form.Control
                    aria-label="Small"
                    aria-describedby="inputGroup-sizing-sm"
                    placeholder="Search by SKU, brand name or Product name"
                    name="searchtext"
                    required
                    value={searchtext}
                    className="tapG"
                    center
                    onChange={(e) => setSearchtext(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col xs={2}>
                <Form.Group controlId="date-to">
                  <Form.Label className="customDatelable">
                    Start Date:
                  </Form.Label>
                  <Form.Control
                    type="date"
                    className="tapG"
                    name="start"
                    size="sm"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={2}>
                <Form.Group controlId="date-form">
                  <Form.Label className="customDatelable">End Date:</Form.Label>
                  <Form.Control
                    type="date"
                    className="tapG"
                    name="end"
                    size="sm"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col className="d-flex justify-content-start align-items-center cursor gap-4">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    getProductListFunc();
                    setSearchtext("");
                    setSelectedOption("");
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  Reset All filter and search
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="mt-2 p-2"></Row>
        <Row className="mt-2 p-2">
          <div
            style={{
              maxHeight: "600px",
              overflowY: "scroll",
              border: "2px solid #ccc",
            }}
          >
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
                  <th>Estimated Delivery Time</th>
                  <th>Commission Price</th>
                  <th>Net Disbursement</th>
                  <th>Add Stock</th>
                  <th>Action</th>
                  <th>Other Action</th>
                </tr>
              </thead>
              <tbody>
                {filterData?.length > 0 &&
                  filterData?.map((ele) => (
                    <tr key={ele._id} style={{ background: "red" }}>
                      <td>
                        {ele?.status ? (
                          <span style={{ color: "green" }}>Active</span>
                        ) : (
                          <span style={{ color: "red" }}>Not Active</span>
                        )}
                        <br />
                      </td>
                      <td>
                        <Image
                          src={ele?.specId?.image?.[0]?.image_path}
                          fluid
                          width={60}
                          height={60}
                        />
                      </td>
                      <td
                        onClick={() =>
                          navigate(`/seller/product-deatils/${ele?._id}`)
                        }
                      >
                        {ele?.specId?.skuId}
                      </td>
                      <td
                        onClick={() =>
                          navigate(`/seller/product-deatils/${ele?._id}`)
                        }
                        className="pname"
                      >
                        {ele?.productId?.brandId?.title} {ele?.name}
                      </td>
                      <td className="datecolor">
                        {ChangeFormatDate2(ele?.updatedAt)}
                      </td>
                      <td className="avaible">{ele?.available_qty || 0}</td>
                      <td>₹ {ele?.specId?.price}</td>
                      <td className="priceTD">
                        <Form.Control
                          type="tel"
                          size="sm"
                          placeholder="Product Price"
                          name="price"
                          required
                          onChange={(e) =>
                            handlePriceChange(ele._id, e.target.value)
                          }
                          defaultValue={ele?.price}
                        />
                        <br />{" "}
                        <span onClick={() => getLowestPriceFunc(ele, ele._id)}>
                          <p className="viewLowestPrice" size="sm">
                            View Lowest Price
                          </p>
                        </span>
                        {lowIndex == ele._id && (
                          <span style={{ fontWeight: "500" }}>
                            Lowest Price :₹
                            {viewLowestPriceData?.price?.toFixed(2)} + ₹{" "}
                            {viewLowestPriceData?.shipping_cost}
                          </span>
                        )}
                      </td>
                      <td className="w-40">
                        <Form.Control
                          type="tel"
                          size="sm"
                          placeholder="Shipping Price"
                          name="shipping_cost"
                          required
                          onChange={(e) =>
                            handleShippingChange(ele._id, e.target.value)
                          }
                          defaultValue={ele?.shipping_cost}
                        />
                      </td>
                      <td>
                        {
                          estimatedDeliveryTimes[
                            parseInt(ele?.estimateDate) - 1
                          ]?.label
                        }
                      </td>
                      <td>{Math.round(ele?.price - ele?.comission_price)}</td>
                      <td>
                        {Math.round(ele?.comission_price)?.toLocaleString()}
                      </td>
                      <td className="priceTD">
                        <Form.Control
                          type="number"
                          size="sm"
                          placeholder="Add Stock"
                          name="quantity"
                          required
                          value={clearInput ? "" : quantities?.[ele._id]}
                          onChange={(e) =>
                            setQuantityAtIndex(
                              ele._id,
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </td>

                      <td>
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleUpdate(ele._id)}
                        >
                          Save
                        </Button>
                      </td>
                      <td className="priceTD">
                        <DropdownButton
                          className="w-100"
                          id="dropdown-basic-button"
                          title="Edit"
                          size="sm"
                          variant="secondary"
                        >
                          <Dropdown.Item
                            onClick={() =>
                              navigate(`/seller/product-deatils/${ele?._id}`)
                            }
                          >
                            View Details
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() =>
                              navigate(`/seller/add-ofers/${ele?._id}`)
                            }
                          >
                            Edit Product
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => EstimateHandler(ele)}>
                            Estimate Delivery Time
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => ServiceHandler(ele)}>
                            Add Services
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() =>
                              navigate(
                                `/seller/seller-product-edit/${ele?._id}/manage-images/${ele?._id}`
                              )
                            }
                          >
                            Manage Images
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() =>
                              navigate(
                                `/seller/seller-product-edit/${ele?._id}/new-mainVariants/${ele?._id}`
                              )
                            }
                          >
                            New Variations
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => closeListingProduct(ele)}
                          >
                            {ele?.status ? "Close Listing" : "Start Listing"}
                          </Dropdown.Item>
                        </DropdownButton>
                      </td>
                    </tr>
                  ))}

                {filterData?.length === 0 && (
                  <tr>
                    <td colSpan="14" className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          <div>
            <SellerStock />
          </div>
          <div>
            <Modal
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  Add Estimated Delivery time for {selectedProduct?.name}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleSelectEstimateChange}
                  value={selectedTime}
                >
                  <option value="select">Select Estimated Delivery time</option>
                  {estimatedDeliveryTimes.map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </Form.Select>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => updateEstimatedDelivey()}
                >
                  SAVE
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
          <div>
            <ServicesModal
              showService={showService}
              handleCloseService={handleCloseService}
              selectedProduct={selectedProduct}
              getProductListFunc={getProductListFunc}
            />
          </div>
        </Row>
        <Toaster position="top-right" />
      </Container> */}
      <Container>
        <SellerStock />
      </Container>
    </div>
  );
}

export const ServicesModal = ({
  showService,
  handleCloseService,
  selectedProduct,
  getProductListFunc,
}) => {
  const [services, setServices] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  console.log({ selectedProduct });

  useEffect(() => {
    async function getServices() {
      try {
        const res = await GetAllServices();
        setServices(res?.data?.data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    }

    getServices();
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedProduct?.services) {
      const initialSelectedIds = selectedProduct?.services.map(
        (service) => service?.product_service?._id
      );
      setSelectedIds(initialSelectedIds);
    }
  }, [selectedProduct]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedIds((prev) => [...prev, name]);
    } else {
      setSelectedIds((prev) => prev?.filter((id) => id !== name));
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        services: selectedIds.map((id) => ({ product_service: id })),
      };
      const res = await UpdateSellerProduct(selectedProduct?._id, payload);
      if (res?.status === 200) {
        toast.success("Services Added Successfully");
        getProductListFunc();
        setTimeout(handleCloseService, 1500);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to add services");
    }
  };

  return (
    <Modal
      show={showService}
      onHide={handleCloseService}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "16px" }}>
          Select Services for {selectedProduct?.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {services.map((service) => (
          <Form.Check
            inline
            key={service?._id}
            label={service?.name}
            name={service?._id}
            onChange={handleCheckboxChange}
            checked={selectedIds.includes(service?._id)}
          />
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseService}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          SAVE
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const SearchTermModal = ({ showModal, handleClose, data }) => {
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    setModalData(data);
  }, [data]);

  const handleSubmit = async () => {
    let payload = {
      ...modalData,
    };
    await UpdateSellerProduct(modalData?._id, payload);
    handleClose();
  };


  const getKeyword = async () => {
    try {
      // Assuming modalData?._id is being used to fetch data
      const response = await getSearcKeyword(modalData?._id);
  
      // Log the response to see the result (optional)
      console.log(response);
  
      // Update modalData with the new search_key, appending the fetched keyword
      setModalData(prevData => ({
        ...prevData,
        search_key: prevData?.search_key + response.data.data,
      }));
    } catch (error) {
      console.error("Error fetching search keyword:", error);
    }
  };
  

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ textAlign: "center", fontSize: "16px" }}
        >
          Add Search Keys
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>
              Search Keys <span> </span>{" "}
            </Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter Search Term"
              onChange={(e) =>
                setModalData({ ...modalData, search_key: e.target.value })
              }
              value={modalData?.search_key}
              rows={10}
            />
          </Form.Group>
        </Form>
        <div className="d-flex justify-content-center">
          <button className="glow-button" onClick={getKeyword}>
            <span className="icon">✨</span>
            Modify with AI
          </button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
