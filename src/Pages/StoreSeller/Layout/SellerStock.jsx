import axios from "axios"; // or your preferred HTTP client
import Papa from "papaparse";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  DropdownButton,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { CSVLink } from "react-csv";
import toast, { Toaster } from "react-hot-toast";
import { FaFileUpload } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import {
  allBrandList,
  allCategoryList,
  allSubCategoryList,
  getLowestPriceProdut,
  UpdateSellerProduct,
  UpdateSellerProductDataStatus,
} from "../../../API/api";
import { ChangeFormatDate } from "../../../common/DateFormat";
import { estimatedDeliveryTimes } from "../../../dummyData";
import { useDebounce } from "../../../hooks/useDebounce";
import { SearchTermModal, ServicesModal } from "./SellerInventory";
import "./sellerlayout.css";

const baseURL = import.meta.env.VITE_API_BASE; // Replace with your actual base URL

const SellerStock = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    name: "",
    categoryId: "",
    subcategoryId: "",
    brandId: "",
    isPopular: false,
    is_bestSell: false,
    out_of_stock: false,
    sales_start: false,
  });

  const [importedData, setImportedData] = useState([]);

  const fileInputRef = useRef(null);

  const { userId: sellerID } = JSON.parse(localStorage.getItem("auth"));
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedTime, setSelectedTime] = useState("select");
  const [showService, setShowServices] = useState(false);
  const [stratuploading, setStartUploading] = useState(false);
  const [showSearchTerm, setShowSearchTerm] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await allCategoryList();
      let data = res.data?.data?.filter((item) => item.status === true);
      data = data.sort((a, b) => a.title.localeCompare(b.title));
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await allSubCategoryList();
      let data = res.data?.data?.filter((item) => item.status === true);
      data = data.sort((a, b) => a.title.localeCompare(b.title));
      setSubcategories(data);
    } catch (error) {
      console.error("Error fetching subcategories", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await allBrandList();
      let data = res.data?.data?.filter((item) => item.status === true);
      data = data.sort((a, b) => a.title.localeCompare(b.title));
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const {
        name,
        categoryId,
        subcategoryId,
        brandId,
        isPopular,
        is_bestSell,
        out_of_stock,
        sales_start,
      } = filters;
      const res = await axios.get(
        `${baseURL}/seller-product/list-by-seller-paginated/${sellerID}`,
        {
          params: {
            page: currentPage,
            limit: 20,
            name,
            categoryId,
            subcategoryId,
            brandId,
            is_popular: isPopular !== "" ? isPopular : undefined,
            is_bestSell: is_bestSell !== "" ? is_bestSell : undefined,
            out_of_stock: out_of_stock !== "" ? out_of_stock : undefined,
            sales_start: sales_start !== "" ? sales_start : undefined,
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
      setTotalPages(res.data?.data?.pagination?.totalPages);
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

  const handleFilterChangeCheckbox = (e) => {
    const { name } = e.target;
    setFilters((prev) => ({ ...prev, [name]: !filters[name] }));
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
    let res = await getLowestPriceProdut(ele?.productId?._id);

    const lowestPriceProduct = res?.data?.data.reduce((minProduct, product) => {
      return product.price < minProduct.price ? product : minProduct;
    }, res?.data?.data[0]);

    setViewLowestPriceData(lowestPriceProduct);

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

    formData[index].quantity = quantities[key] || 0;

    let res = await UpdateSellerProduct(formData[index]?._id, formData[index]);

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

  const SearchTermHandler = (ele) => {
    setSelectedProduct(ele);
    handleOpenSearchTerm();
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

  const handleOpenSearchTerm = () => setShowSearchTerm(true);
  const handleCloseSearchTerm = () => setShowSearchTerm(false);

  const updateEstimatedDelivey = async () => {
    let res = await UpdateSellerProduct(selectedProduct?._id, {
      ...selectedProduct,
      estimateDate: selectedTime,
    });
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

  const handleSaveAll = async () => {
    // Iterate through all rows and invoke handleUpdate for each
    setStartUploading(true);

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

  const debouncedFetchData = useDebounce(fetchData, 500);

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    debouncedFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div>
      <div className="d-flex justify-content-center mt-2 mb-4 gap-4">
        <h4>Manage Your Inventory</h4>
      </div>

      <div style={{ backgroundColor: "#EDE8DC" }} className="p-4 mb-3">
        <div className="d-flex justify-content-between gap-4">
          <Form.Group controlId="searchtext" className="flex-grow-1">
            <Form.Label className="fw-bold">Search by Product name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              size="sm"
              placeholder="Search by Product name"
            />
          </Form.Group>

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

        <div className="d-flex justify-content-end mb-3 gap-4 mt-3">
          <Form.Group controlId="isPopular">
            <Form.Check
              name="isPopular"
              label="Popular"
              checked={filters.isPopular}
              onClick={handleFilterChangeCheckbox}
              className="fw-bold"
            />
          </Form.Group>
          <Form.Group controlId="is_bestSell">
            <Form.Check
              name="is_bestSell"
              label="Best Sell"
              checked={filters.is_bestSell}
              onClick={handleFilterChangeCheckbox}
              className="fw-bold"
            />
          </Form.Group>
          <Form.Group controlId="out_of_stock">
            <Form.Check
              name="out_of_stock"
              label="Out of Stock"
              checked={filters.out_of_stock}
              onClick={handleFilterChangeCheckbox}
              className="fw-bold"
            />
          </Form.Group>
          <Form.Group controlId="sales_start">
            <Form.Check
              name="sales_start"
              label="Top Sales"
              checked={filters.sales_start}
              onClick={handleFilterChangeCheckbox}
              className="fw-bold"
            />
          </Form.Group>
        </div>

        <div className="d-flex justify-content-center mt-3 gap-2">
          <Button variant="dark" size="sm" onClick={handleReset}>
            Reset & Refresh
          </Button>
          <Button variant="secondary" size="sm">
            {filteredData?.length} Filtered Products
          </Button>

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

          <Button size="sm" variant="outline-dark" onClick={handleChooseFile}>
            <span className="m-1">
              <FaFileUpload size={15} />{" "}
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

      {totalPages > 1 && (
        <div className="d-flex justify-content-end mt-2 mb-4 gap-4">
          <nav aria-label="Pagination">
            <ul className="pagination">
              {/* Previous Button */}
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  variant="secondary"
                  size="sm"
                >
                  Previous
                </Button>
              </li>

              {/* Page Numbers */}
              {Array.from({ length: totalPages })
                .map((_, index) => index + 1)
                .filter(
                  (page) =>
                    page === currentPage || // Current page
                    (page >= currentPage - 2 && page <= currentPage + 2) // Range: prev 2 to next 2
                )
                .map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    <Button
                      onClick={() => handlePageChange(page)}
                      variant={currentPage === page ? "dark" : "secondary"}
                      size="sm"
                    >
                      {page}
                    </Button>
                  </li>
                ))}

              {/* Next Button */}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  variant="secondary"
                  size="sm"
                >
                  Next
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ fontWeight: "bold", borderBottom: "1px solid gray" }}>
              Product Name
            </th>
            <th style={{ fontWeight: "bold", borderBottom: "1px solid gray" }}>
              Product SKU
            </th>
            <th style={{ fontWeight: "bold", borderBottom: "1px solid gray" }}>
              Listing Status
            </th>
            <th style={{ fontWeight: "bold", borderBottom: "1px solid gray" }}>
              Product Image
            </th>
            <th style={{ fontWeight: "bold", borderBottom: "1px solid gray" }}>
              Zoofi Sells
            </th>
            <th style={{ fontWeight: "bold", borderBottom: "1px solid gray" }}>
              In Stock Quantity
            </th>
            <th style={{ fontWeight: "bold", borderBottom: "1px solid gray" }}>
              MRP
            </th>
            <th style={{ fontWeight: "bold", borderBottom: "1px solid gray" }}>
              Selling Price
            </th>
            <th style={{ fontWeight: "bold", borderBottom: "1px solid gray" }}>
              Shipping Price
            </th>
            <th style={{ fontWeight: "bold", borderBottom: "1px solid gray" }}>
              Commission Price
            </th>
            <th style={{ fontWeight: "bold", borderBottom: "1px solid gray" }}>
              Net Disbursement
            </th>
            <th style={{ fontWeight: "bold", borderBottom: "1px solid gray" }}>
              Add Stock
            </th>

            <th style={{ fontWeight: "bold", borderBottom: "1px solid gray" }}>
              Save
            </th>
            <th style={{ fontWeight: "bold", borderBottom: "1px solid gray" }}>
              Actions
            </th>

            {/* <th style={{ fontWeight: "bold", borderBottom: "1px solid gray" }}>
              Mark As
            </th> */}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={"100%"} style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          ) : filteredData.length > 0 ? (
            filteredData.map((row) => (
              <tr key={row._id}>
                <td>{row?.name?.slice(0, 20)}</td>
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
                    {row?.salesCount ?? 0}
                  </span>
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
                {/* <td>
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
                </td> */}
                {/* <td>
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
                </td> */}
                <td>{Math.round(row?.price - row?.comission_price)}</td>
                <td>{Math.round(row?.comission_price)?.toLocaleString()}</td>
                <td className="priceTD">
                  {/* <span>{quantities?.[row._id]}</span> <span>{row?._id}</span> */}
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
                <td className="priceTD" style={{ width: "20px" }}>
                  <DropdownButton
                    className="w-100"
                    id="dropdown-basic-button"
                    title="Actions"
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
                    {/* <Dropdown.Item
                      onClick={() => navigate(`/seller/add-ofers/${row?._id}`)}
                    >
                      Add Offer
                    </Dropdown.Item> */}
                    <Dropdown.Item onClick={() => EstimateHandler(row)}>
                      Estimate Delivery Time
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => ServiceHandler(row)}>
                      Add Services
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => SearchTermHandler(row)}>
                      Add Search Keys
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
                    <Dropdown.Item>
                      <span
                        onClick={() =>
                          window.open(
                            `https://zoofi.in/product-details/${row?._id}`,
                            "_blank"
                          )
                        }
                      >
                        Preview Product In Zoofi
                      </span>
                    </Dropdown.Item>
                  </DropdownButton>
                </td>

                {/* <td>
                  {row?.is_popular && "Popular"}
                  {row?.is_bestSell && "Best Sell"}
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={"100%"} style={{ textAlign: "center" }}>
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
        <Toaster position="top-right" />
      </Table>

      <div>
        <ServicesModal
          showService={showService}
          handleCloseService={handleCloseService}
          selectedProduct={selectedProduct}
          getProductListFunc={fetchData}
        />
      </div>
      <div>
        <SearchTermModal
          showModal={showSearchTerm}
          handleClose={handleCloseSearchTerm}
          data={selectedProduct}
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
            <div>
              <p className="dtext">
                Current Estimated Delivery time:{" "}
                {selectedProduct?.estimateDate
                  ? estimatedDeliveryTimes[
                      parseInt(selectedProduct?.estimateDate) - 1
                    ]?.label
                  : "Not Set"}
              </p>
            </div>

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
