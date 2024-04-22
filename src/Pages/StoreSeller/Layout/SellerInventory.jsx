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
import { FaFileUpload } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import {
  SellerProductList,
  UpdateSellerProduct,
  UpdateSellerProductDataStatus,
  getLowestPriceProdut,
} from "../../../API/api";
import {
  ChangeFormatDate,
  ChangeFormatDate2,
} from "../../../common/DateFormat";
import "./sellerlayout.css";

export default function SellerInventory() {
  const [data, setData] = useState([]);
  const [searchtext, setSearchtext] = useState("");
  const [clearInput, setClearInput] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [importedData, setImportedData] = useState([]);
  const [stratuploading, setStartUploading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [viewLowestPriceData, setViewLowestPriceData] = useState();
  const [lowIndex, setLowIndex] = useState();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    console.log("Selected option:", e.target.value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          // Access the parsed data in result.dat
          setImportedData(result.data);
          let Qarray = [];
          result?.data?.map((ele) => {
            if (ele?.["Add Quantity"]) {
              Qarray.push(ele?.["Add Quantity"]);
            }
          });
          console.log({ Qarray });
          setQuantities(Qarray);
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

    console.warn(updatedQuantities, "updatedQuantities");

    setQuantities(updatedQuantities);
  };

  const { userId } = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    getProductListFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();

  async function getProductListFunc() {
    await SellerProductList(userId)
      .then((res) => {
        console.log(res?.data?.data, "data");
        const dataWithUniqueIds = res?.data?.data?.SellerProductData?.map(
          (item, index) => ({
            ...item,
            id: index + 1,
          })
        );
        setData(dataWithUniqueIds);
        setFormData(dataWithUniqueIds);
        const csvDataArray = res?.data?.data?.SellerProductData?.map(
          (ele, index) => ({
            Status: ele.status ? "Active" : "Inactive",
            SKU: ele.specId.skuId,
            "Product Name": `${ele?.productId?.brandId?.title} ${ele?.name}`,
            "Date Created": ChangeFormatDate(ele?.updatedAt),
            "Available Quantity": ele?.available_qty || 0,
            "MRP price": ele?.specId?.price,
            "Selling Price": ele?.price,
            "Shipping Price": ele?.shipping_cost,
            "Add Quantity": quantities[index], // Adjust this based on your logic
          })
        );
        console.log({ csvDataArray });
        setCsvData([...csvDataArray]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const [formData, setFormData] = useState([]);

  const handleUpdate = async (index) => {
    console.log(formData[index]);
    console.log(quantities[index]);

    formData[index].quantity = quantities[index] || 0;

    let res = await UpdateSellerProduct(formData[index]?._id, formData[index]);

    console.log({ res });

    if (res.data.error == false) {
      toast.success("Inventory update successfully...");
      setQuantities([]);
      setClearInput(true);
      setTimeout(() => {
        setClearInput(false);
      }, 100);
      getProductListFunc();
    }
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

  const handleSaveAll = async () => {
    // Iterate through all rows and invoke handleUpdate for each
    setStartUploading(true);
    console.log({ formData });
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
      toast.success(" 🚀 All inventory updated successfully...");
      setStartUploading(false);
    }, 2000);
  };

  const fileInputRef = useRef(null);

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const closeListingProduct = async (data) => {
    let paylod = {
      status: !data?.status,
    };

    await UpdateSellerProductDataStatus(data?._id, paylod);

    getProductListFunc();
  };

  const getLowestPriceFunc = async (ele, index) => {
    console.log(ele);

    let res = await getLowestPriceProdut(ele?.productId?._id);

    const lowestPriceProduct = res?.data?.data.reduce((minProduct, product) => {
      return product.price < minProduct.price ? product : minProduct;
    }, res?.data?.data[0]);

    console.log("Lowest price:", lowestPriceProduct);

    setViewLowestPriceData(lowestPriceProduct);

    console.log(res?.data?.data);
    setLowIndex(index);

    // /setViewLowestPriceData
  };

  let filterData = [...data];
  console.log({ filterData });
  if (searchtext.length > 0) {
    filterData = data?.filter((ele) => {
      return (
        ele?.name?.toLowerCase()?.includes(searchtext?.toLowerCase()) ||
        ele?.specId?.skuId
          ?.toLowerCase()
          ?.includes(searchtext?.toLowerCase()) ||
        ele?.productId?.brandId?.title
          ?.toLowerCase()
          ?.includes(searchtext?.toLowerCase())
      );
    });
  }

  if (selectedOption.length > 0) {
    if (selectedOption == "Low Stocks") {
      filterData = filterData?.filter((ele) => {
        return ele?.available_qty < 10;
      });
    } else if (selectedOption == "InActive") {
      filterData = filterData?.filter((ele) => {
        return ele?.status !== true;
      });
    } else if (selectedOption == "Active") {
      filterData = filterData?.filter((ele) => {
        return ele?.status == true;
      });
    } else if (selectedOption == "listRemoved") {
      filterData = filterData?.filter((ele) => {
        return ele?.status !== true;
      });
    }
  }

  if (startDate.length > 0 && endDate.length > 0) {
    //  if end date is smaller than start date then show error toast
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("End date should be greater than start date", {
        position: "bottom-right",
        style: {
          background: "red",
          color: "white",
        },
      });
      setStartDate("");
      setEndDate("");
    } else {
      filterData = filterData?.filter((ele) => {
        const updatedAtDate = new Date(ele?.updatedAt);
        return (
          updatedAtDate > new Date(startDate) &&
          updatedAtDate < new Date(endDate)
        );
      });
    }
  }

  return (
    <div>
      <Container className="mt-4">
        <Row className="mt-4">
          <Col className="dtext2">
            Manage Your Inventory :{" "}
            <span style={{ fontSize: "12px" }}>
              Total Products {data?.length}
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
                  <th>Commission Price</th>
                  <th>Net Disbursement</th>
                  <th>Add Stock</th>
                  <th>Action</th>
                  <th>Other Action</th>
                </tr>
              </thead>
              <tbody>
                {filterData?.length > 0 &&
                  filterData?.map((ele, index) => (
                    <tr key={index} style={{ background: "red" }}>
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
                          // value={formData[index]?.price}
                          onChange={(e) =>
                            handlePriceChange(index, e.target.value)
                          }
                          defaultValue={ele?.price}
                        />
                        <br />{" "}
                        <span onClick={() => getLowestPriceFunc(ele, index)}>
                          <p className="viewLowestPrice" size="sm">
                            {" "}
                            View Lowest Price
                          </p>
                        </span>
                        {lowIndex == index && (
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
                          // value={formData[index]?.price}
                          onChange={(e) =>
                            handleShippingChange(index, e.target.value)
                          }
                          defaultValue={ele?.shipping_cost}
                        />
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
                          value={clearInput ? "" : quantities?.[index]}
                          // value={formData[index]?.price}
                          onChange={(e) =>
                            setQuantityAtIndex(index, parseInt(e.target.value))
                          }
                        />
                      </td>

                      <td>
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleUpdate(index)}
                        >
                          Save
                        </Button>
                      </td>
                      <td className="priceTD">
                        {/* <Button size="sm">Offer</Button> */}
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
                          {/* <Dropdown.Item onClick={() => navigate(`/seller/seller-product-edit/${ele?._id}/new-offers/${ele?._id}`)}>Apply Offers</Dropdown.Item> */}
                          <Dropdown.Item
                            onClick={() =>
                              navigate(`/seller/add-ofers/${ele?._id}`)
                            }
                          >
                            Edit Product
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
        </Row>
        <Toaster position="top-right" />
      </Container>
    </div>
  );
}
