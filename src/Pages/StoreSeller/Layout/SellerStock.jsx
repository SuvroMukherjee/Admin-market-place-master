import axios from "axios"; // or your preferred HTTP client
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Container,
  DropdownButton,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import toast, { Toaster } from "react-hot-toast";
import { BiPlusCircle } from "react-icons/bi";
import { FaEye, FaFileUpload } from "react-icons/fa";
import {
  allBrandList,
  allCategoryList,
  allSubCategoryList,
  getLowestPriceProdut,
  MakePopularProduct,
  UpdateSellerProduct,
  UpdateSellerProductDataStatus,
} from "../../../API/api";
import { estimatedDeliveryTimes } from "../../../dummyData";
import "./sellerlayout.css";
import { useNavigate } from "react-router-dom";
import { ServicesModal } from "./SellerInventory";
import { CSVLink } from "react-csv";
import { LuDownload } from "react-icons/lu";
import { ChangeFormatDate } from "../../../common/DateFormat";
import Papa from "papaparse";

const baseURL = import.meta.env.VITE_API_BASE; // Replace with your actual base URL

const SellerStock = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState({
    name: "",
    categoryId: "",
    subcategoryId: "",
    brandId: "",
    isPopular: false,
  });

  const [importedData, setImportedData] = useState([]);

  const fileInputRef = useRef(null);

  const { userId: sellerID } = JSON.parse(localStorage.getItem("auth"));
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedTime, setSelectedTime] = useState("select");
  const [showService, setShowServices] = useState(false);
  const [stratuploading, setStartUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchBrands();
    fetchData();
  }, [filters, currentPage]);

  const fetchCategories = async () => {
    try {
      const res = await allCategoryList();
      setCategories(res.data?.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await allSubCategoryList();
      setSubcategories(res.data?.data);
    } catch (error) {
      console.error("Error fetching subcategories", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await allBrandList();
      setBrands(res.data?.data);
    } catch (error) {
      console.error("Error fetching brands", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { name, categoryId, subcategoryId, brandId, isPopular, is_bestSell,out_of_stock } = filters;
      const res = await axios.get(
        `${baseURL}/seller-product/list-by-seller-paginated/${sellerID}`,
        {
          params: {
            page: currentPage,
            limit: 50,
            name,
            categoryId,
            subcategoryId,
            brandId,
            is_popular: isPopular ? "true" : "false",
            is_bestSell: is_bestSell ? "true" : "false",
            out_of_stock: out_of_stock ? "true" : "false",
          },
        }
      );
      const dataWithUniqueIds = res?.data?.data?.SellerProductData?.map(
        (item, index) => ({
          ...item,
          id: index + 1,
        })
      );
      setFormData(dataWithUniqueIds);
      setFilteredData(res.data?.data?.SellerProductData);
      setTotalPages(res.data?.data?.pagination?.totalPages); // Assume the API provides totalPages
      setReviewData(res?.data?.data?.reviewData);
      setTotalProducts(res.data?.data?.pagination?.totalSellerProducts);
      setLoading(false);
      const csvDataArray = res?.data?.data?.SellerProductData?.map(
        (ele, index) => ({
          _id: ele?._id,
          Status: ele?.status ? "Active" : "Inactive",
          SKU: ele?.specId?.skuId,
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
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleReset = () => {
    setFilters({
      categoryId: "",
      subcategoryId: "",
      brandId: "",
    });
    handlePageChange(1);
    setFilteredData([]);
  };

  const handleSelectEstimateChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedTime(selectedValue);
    console.log(`Selected Delivery Time: ${selectedValue}`);
  };

  const HandleTopFunction = async (catData, value) => {
    let payload = {
      is_popular: value,
    };

    console.log(catData, "catData");

    await MakePopularProduct(payload, catData?._id)
      .then((res) => {
        console.log({ res });
        toast.success("product update successfully");
        fetchData();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!");
        fetchData();
      });
  };

  const handlePriceChange = (key, quantity) => {
    setFormData((prevData) => {
      const newData = [...prevData];
      const index = newData.findIndex((item) => item._id === key);
      if (index !== -1) {
        newData[index] = { ...newData[index], price: quantity };
      }
      return newData;
    });
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

  const [lowIndex, setLowIndex] = useState();
  const [viewLowestPriceData, setViewLowestPriceData] = useState();

  const handleShippingChange = (specIndex, shipping) => {
    setFormData((prevData) => {
      const newData = [...prevData];
      newData[specIndex] = { ...newData[specIndex], shipping };
      return newData;
    });
  };

  const setQuantityAtIndex = (index, value) => {
    // Create a copy of the quantities array
    const updatedQuantities = [...quantities];
    // Update the quantity at the specified index
    updatedQuantities[index] = value;
    // Update the state

    console.warn(updatedQuantities, "updatedQuantities");

    setQuantities(updatedQuantities);
  };

  const [formData, setFormData] = useState([]);

  const handleUpdate = async (key) => {
    const index = formData.findIndex((item) => item._id === key);
    if (index === -1) return;

    console.log(formData[index]);
    console.log(quantities[key]);

    formData[index].quantity = quantities[key] || 0;

    console.log(formData[index]?._id, formData[index], "lllllllll");

    let res = await UpdateSellerProduct(formData[index]?._id, formData[index]);

    console.log({ res });

    if (res.data.error == false) {
      toast.success("Inventory updated successfully...");
      setQuantities([]);
      setClearInput(true);
      setTimeout(() => {
        setClearInput(false);
      }, 100);
      fetchData();
    }
  };

  const EstimateHandler = (ele) => {
    setSelectedProduct(ele);
    handleShow();
  };

  const ServiceHandler = (ele) => {
    setSelectedProduct(ele);
    handleOpenService();
  };

  const closeListingProduct = async (data) => {
    let paylod = {
      status: !data?.status,
    };

    await UpdateSellerProductDataStatus(data?._id, paylod);

    fetchData();
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleOpenService = () => setShowServices(true);
  const handleCloseService = () => setShowServices(false);

  const updateEstimatedDelivey = async () => {
    let res = await UpdateSellerProduct(selectedProduct?._id, {
      ...selectedProduct,
      estimateDate: selectedTime,
    });
    console.log(res);
    if (res.data.error == false) {
      toast.success("Estimate date update Successfully");
      setTimeout(() => {
        handleClose();
      }, 1000);
      setSelectedProduct("");
      setSelectedTime("");
      fetchData();
    }
  };

  const [clearInput, setClearInput] = useState(false);
  const [quantities, setQuantities] = useState([]);

  const navigate = useNavigate();

  const [csvData, setCsvData] = useState([]);

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          // Access the parsed data in result.data
          console.log(result.data, "result.data");
          setImportedData(result.data);

          result?.data?.forEach((ele) => {
            if (ele?.["Add Quantity"]) {
              // Call the setQuantityAtIndex function to set the quantity for each _id
              setQuantityAtIndex(ele?._id, parseInt(ele?.["Add Quantity"]));
            }
          });
        },
        header: true, // Set this to true if your CSV file has headers
      });
    }
  };

  console.log({ importedData });

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

  return (
    <div>
      <Container className="mt-4">
        <Row className="mt-4 text-center">
          <h4>Manage Your Inventory</h4>
        </Row>
      </Container>
      <Container className="mt-4">
        <div className="d-flex justify-content-end mt-2 mb-4 gap-4">
          <div className="pagination d-flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <div key={index}>
                <Button
                  onClick={() => handlePageChange(index + 1)}
                  variant={currentPage === index + 1 ? "dark" : "secondary"}
                  size="sm"
                >
                  {index + 1}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <div className="d-flex justify-content-between mb-3 gap-4 p-4" style={{backgroundColor:"#EDE8DC"}}>
        <Form.Group controlId="categoryId" className="flex-grow-1">
          <Form.Label className="fw-bold">Filter by Category</Form.Label>
          <Form.Select
            name="categoryId"
            value={filters.categoryId}
            onChange={handleFilterChange}
            size="sm"
          >
            <option value="">Select Category</option>
            {categories?.length > 0 &&
              categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.title}
                </option>
              ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="subcategoryId" className="flex-grow-1">
          <Form.Label className="fw-bold"> Filter by Subcategory</Form.Label>
          <Form.Select
            name="subcategoryId"
            value={filters.subcategoryId}
            onChange={handleFilterChange}
            size="sm"
          >
            <option value="">Select Subcategory</option>
            {subcategories?.length > 0 &&
              subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.title}
                </option>
              ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="brandId" className="flex-grow-1">
          <Form.Label className="fw-bold"> Filter by Brand</Form.Label>
          <Form.Select
            name="brandId"
            value={filters.brandId}
            onChange={handleFilterChange}
            size="sm"
          >
            <option value="">Select Brand</option>
            {brands?.length > 0 &&
              brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.title}
                </option>
              ))}
          </Form.Select>
        </Form.Group>
      </div>

      <div className="d-flex justify-content-end mt-2 mb-4 gap-4 p-4" style={{backgroundColor:"#EDE8DC"}}>
        <Form.Group controlId="isPopular">
          <Form.Check
            type="checkbox"
            name="isPopular"
            label="Popular"
            checked={filters.isPopular}
            onChange={handleFilterChange}
            className="fw-bold"
          />
        </Form.Group>
        <Form.Group controlId="is_bestSell">
          <Form.Check
            type="checkbox"
            name="is_bestSell"
            label="Best Sell"
            checked={filters.is_bestSell}
            onChange={handleFilterChange}
            className="fw-bold"
          />
        </Form.Group>
        <Form.Group controlId="out_of_stock">
          <Form.Check
            type="checkbox"
            name="out_of_stock"
            label="Out of Stock"
            checked={filters.out_of_stock}
            onChange={handleFilterChange}
            className="fw-bold"
          />
        </Form.Group>
      </div>

      <div className="d-flex justify-content-center mt-2 mb-4 gap-2">
        <Button variant="dark" size="sm" onClick={handleReset}>
          Reset & Refresh
        </Button>
        {/* <Button variant="dark" size="sm" className="ml-2">
          {totalProducts} Total Products
        </Button> */}
        <Button variant="secondary" size="sm" className="ml-2">
          {filteredData?.length} Filtered Products
        </Button>
      </div>

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
              <FaFileUpload size={15}/>{" "}
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
                      //quantities?.filter((element) => element !== 0)?.length
                      quantities?.filter((element) =>
                        console.log(element, "element")
                      )
                    } products changes)`
                  )}
                </span>
              </Button>
            </Row>
          )}
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Product SKU</th>
            <th>Listing Status</th>
            <th>Product Image</th>
            <th>In Stock Quantity</th>
            <th>MRP</th>
            <th>Selling Price</th>
            <th>Shipping Price</th>
            <th>Expected Delivery Day</th>
            <th>Services</th>
            <th>Commission Price</th>
            <th>Net Disbursement</th>
            <th>Add Stock</th>
            <th>Action</th>
            <th>Other Action</th>
            <th>Zoofi</th>
            <th>Mark As</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="20" style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          ) : filteredData.length > 0 ? (
            filteredData.map((row) => (
              <tr key={row._id}>
                <td>{row?.name}</td>
                <td>{row?.specId?.skuId}</td>
                <td>
                  {row?.status ? (
                    <span style={{ color: "green" }}>Active</span>
                  ) : (
                    <span style={{ color: "red" }}>Not Active</span>
                  )}
                </td>
                <td>
                  <img
                    className="productListImg"
                    src={row?.specId?.image?.[0]?.image_path}
                    alt=""
                  />
                </td>
                <td>
                  <span
                    style={{
                      color: "#1A4870",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {row?.available_qty || 0}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      color: "#FF8343",
                      fontWeight: "500",
                    }}
                  >
                    ₹ {row?.specId?.price}
                  </span>
                </td>
                <td className="priceTD">
                  <Form.Control
                    type="tel"
                    size="sm"
                    placeholder="Product Price"
                    name="price"
                    required
                    onChange={(e) => handlePriceChange(row._id, e.target.value)}
                    defaultValue={row?.price}
                  />
                  <br />{" "}
                  <span onClick={() => getLowestPriceFunc(row, row._id)}>
                    <p className="viewLowestPrice" size="sm">
                      View Lowest Price
                    </p>
                  </span>
                  {lowIndex == row._id && (
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
                      handleShippingChange(row._id, e.target.value)
                    }
                    defaultValue={row?.shipping_cost}
                  />
                </td>
                <td>
                  {row?.estimateDate ? (
                    estimatedDeliveryTimes[parseInt(row?.estimateDate) - 1]
                      ?.label
                  ) : (
                    <span
                      onClick={() => EstimateHandler(row)}
                      style={{ cursor: "pointer" }}
                    >
                      <BiPlusCircle size={20} />{" "}
                      <span className="ml-2">Add </span>
                    </span>
                  )}
                </td>
                <td>
                  {row?.services?.length > 0 ? (
                    <span>
                      {row?.services?.map((service, index) => (
                        <span key={service?._id}>
                          {index + 1}. {service?.["product_service"]?.name}
                          <br />
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span
                      onClick={() => ServiceHandler(row)}
                      style={{ cursor: "pointer" }}
                    >
                      <BiPlusCircle size={20} />{" "}
                      <span className="ml-2">Add </span>
                    </span>
                  )}
                </td>
                <td>{Math.round(row?.price - row?.comission_price)}</td>
                <td>{Math.round(row?.comission_price)?.toLocaleString()}</td>
                <td className="priceTD">
                  <span>{quantities?.[row._id]}</span> <span>{row?._id}</span>
                  <Form.Control
                    type="number"
                    size="sm"
                    placeholder="Add Stock"
                    name="quantity"
                    required
                    value={clearInput ? "" : quantities?.[row._id]}
                    onChange={(e) =>
                      setQuantityAtIndex(row._id, parseInt(e.target.value))
                    }
                  />
                </td>

                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleUpdate(row._id)}
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
                        navigate(`/seller/product-deatils/${row?._id}`)
                      }
                    >
                      View Details
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => navigate(`/seller/add-ofers/${row?._id}`)}
                    >
                      Edit Product
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => EstimateHandler(row)}>
                      Estimate Delivery Time
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => ServiceHandler(row)}>
                      Add Services
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        navigate(
                          `/seller/seller-product-edit/${row?._id}/manage-images/${row?._id}`
                        )
                      }
                    >
                      Manage Images
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        navigate(
                          `/seller/seller-product-edit/${row?._id}/new-mainVariants/${row?._id}`
                        )
                      }
                    >
                      New Variations
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => closeListingProduct(row)}>
                      {row?.status ? "Close Listing" : "Start Listing"}
                    </Dropdown.Item>
                  </DropdownButton>
                </td>
                <td>
                  <a
                    href={`https://zoofi.in/product-details/${row?._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaEye size={20} />
                  </a>
                </td>

                <td>{row?.is_popular && "Popular"} 
                    {row?.is_bestSell && "Best Sell"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
        <Toaster position="top-right" />
      </Table>

      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, index) => (
          <Button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            variant={currentPage === index + 1 ? "primary" : "secondary"}
            size="sm"
          >
            {index + 1}
          </Button>
        ))}
      </div>
      <div>
        <ServicesModal
          showService={showService}
          handleCloseService={handleCloseService}
          selectedProduct={selectedProduct}
          getProductListFunc={fetchData}
        />
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
            <Button variant="primary" onClick={() => updateEstimatedDelivey()}>
              SAVE
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default SellerStock;
