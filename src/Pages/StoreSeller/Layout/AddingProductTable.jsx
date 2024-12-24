import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  ListGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BsClipboard2CheckFill } from "react-icons/bs";
import { FaArrowDown, FaArrowUp, FaSearch } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";
import { LuClipboardSignature } from "react-icons/lu";
import { MdCancel } from "react-icons/md";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import {
  BulkProductUpload,
  DeleteProductSpecification,
  FileUpload,
  ProductSpecificationCreate,
  SellerProductAdd,
  SpecBulkProductUpload,
  StatusUpdateProduct,
  UpdateProductSpecification,
  allBrandList,
  allCategoryList,
  allCommissionList,
  allSubCategoryList,
  deleteProduct,
  getAllBrandsBycat,
  getAllCategoryBybrand,
} from "../../../API/api";
import useAuth from "../../../hooks/useAuth";
import { use } from "react";

const apiUrl = import.meta.env.VITE_API_BASE;

const AddingProductTable = () => {
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    categoryId: "",
    subcategoryId: "",
    brandId: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedproductid, setSeledtedProductId] = useState();
  const [variantsArray, setVariantsArray] = useState([]);

  const [showModal2, setShowModal2] = useState(false);

  const handleCloseModal2 = () => setShowModal2(false);
  const handleShowModal2 = () => setShowModal2(true);

  const [allComission, setAllComission] = useState([]);

  async function getAllComission() {
    try {
      const res = await allCommissionList();

      setAllComission(res.data?.data);
    } catch (error) {
      console.error("Error fetching brands", error);
    }
  }

  useEffect(() => {
    getAllComission();
  }, []);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    fetchData();
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm]);

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchBrands();
  }, []);

  const { userId } = JSON.parse(localStorage.getItem("auth"));

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/product/all-list?page=${currentPage}&limit=10&categoryId=${filters.categoryId}&subcategoryId=${filters.subcategoryId}&brandId=${filters.brandId}&productId=${searchTerm}`
      );
      setFilterData(res?.data?.data);
      setTotalPages(res?.data?.pagination?.pages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    if (filters?.brandId == "") {
      try {
        const res = await allCategoryList();
        let filter = res.data?.data
          ?.filter((ele) => ele?.status == true)
          .sort((a, b) => a?.title?.localeCompare(b?.title));
        setCategories(filter);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    } else {
      try {
        const res = await getAllCategoryBybrand(filters?.brandId);
        let filter = res.data?.data?.sort((a, b) =>
          a?.title?.localeCompare(b?.title)
        );
        setCategories(filter);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await allSubCategoryList();
      let filter = res.data?.data
        ?.filter((ele) => ele?.status == true)
        .sort((a, b) => a?.title?.localeCompare(b?.title));
      setSubcategories(filter);
    } catch (error) {
      console.error("Error fetching subcategories", error);
    }
  };

  const fetchBrands = async () => {
    if (filters.categoryId == "") {
      try {
        const res = await allBrandList();
        let filter = res.data?.data
          ?.filter((ele) => ele?.status == true)
          .sort((a, b) => a?.title?.localeCompare(b?.title));
        setBrands(filter);
      } catch (error) {
        console.error("Error fetching brands", error);
      }
    } else {
      try {
        const res = await getAllBrandsBycat(filters.categoryId);
        let filter = res.data?.data?.sort((a, b) =>
          a?.title?.localeCompare(b?.title)
        );

        setBrands(filter);
      } catch (error) {
        console.error("Error fetching brands by category", error);
      }
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [filters?.categoryId]);

  useEffect(() => {
    fetchCategories();
  }, [filters?.brandId]);

  const handleSearch = () => {
    fetchData();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const copyTextToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopied(false);
      setCopiedIndex(null);
    }, 2000);
  };

  const handleReset = () => {
    setSearchTerm("");
    setCurrentPage(1);
    setTotalPages(1);
    setFilterData([]);
    handlePageChange(1);
    setFilters({
      categoryId: "",
      subcategoryId: "",
      brandId: "",
    });
  };

  const handleStatus = async (dataset) => {
    let payload = {
      status: !dataset?.status,
    };

    await StatusUpdateProduct(dataset?._id, payload)
      .then((res) => {
        console.log(res);
        fetchData();
        toast.success("Product status updated successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handledeleteProduct = async (id) => {
    await deleteProduct(id)
      .then((res) => {
        console.log(res);
        fetchData();
        toast.success("Product deleted successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const csvData = filterData.flatMap((product, index) => {
    const htmlToPlainText = (html) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      return tempDiv.textContent || tempDiv.innerText || "";
    };
    return {
      "SL NO": index + 1,
      "Product Name": product?.name,
      "Product ID": product?.productId,
      "Product Type": product?.type,
      "Product Category": product?.categoryId?.title,
      "Product Sub-Category": product?.subcategoryId?.title,
      "Product Brand": product?.brandId?.title,
      "Product Tax status": product?.tax_status,
      "Product Visibility": "Visible",
      "Product Identification Images": product?.image
        ?.map((ele) => ele?.image_path)
        .join(","),
      "Product Features": product?.features?.map((ele) => ele).join(" "),
      "Product Uploaded Date": moment(product?.updatedAt).format(
        "DD-MM-YYYY, hh:mm:ss A"
      ),
      "Product Specifications": product?.specId
        ?.flatMap((spec) =>
          spec?.spec_det?.map((det) => `${det.title}: ${det.value}`)
        )
        .join(", "),
      "Specification Images": product?.specId
        ?.flatMap((spec) => spec?.image?.map((image) => image?.image_path))
        .join(", "),
      "Specification Prices": product?.specId
        ?.map((spec) => spec?.price)
        .join(", "),
      "Specification SkuId": product?.specId
        ?.map((spec) => spec?.skuId)
        .join(", "),
      "Product Description": product?.desc,
      // "Product Full Description": htmlToPlainText(product?.full_desc),
    };
  });

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

      const payload = { file: fileName };
      const Bulkres =
        type == "spec"
          ? await SpecBulkProductUpload(payload)
          : await BulkProductUpload(payload);

      if (Bulkres?.data?.error === false) {
        toast.success(`Upload successful: ${file.name}`);
        fetchData();
      } else {
        throw new Error(`Could not upload file: ${file.name}`);
      }
    } catch (error) {
      console.error("Error in file upload:", error.message);
      toast.error(`Error in file upload: ${error.message}`);
    } finally {
      setUploading(false);
      fetchData();
    }
  };

  const showVariants = (data) => {
    console.log(data);
    setVariantsArray(data);
    handleShowModal2();
  };

  const variationRequestCount = (data) => {
    let filterData = data?.filter((ele) => {
      return ele?.is_approved == false;
    });

    return filterData?.length;
  };

  const [showSellerProduct, setShowSellerProduct] = useState(false);
  const [seletedProducrt, setSelectedProduct] = useState();

  const [formData, setFormData] = useState([]);

  const handleAddProduct = (product) => {
    console.log(product, "product");
    setSelectedProduct(product);
    handleShow();
  };

  const handleShow = () => {
    setShowSellerProduct(true);
  };

  const handleClose = () => {
    setShowSellerProduct(false);
    setSelectedProduct(null);
    setFormData([]);
  };

  const handlePriceChange = (specIndex, price) => {
    setFormData((prevData) => {
      const newData = [...prevData];
      newData[specIndex] = { ...newData[specIndex], price };
      return newData;
    });
  };

  const handleQuansChange = (specIndex, quantity) => {
    setFormData((prevData) => {
      const newData = [...prevData];
      newData[specIndex] = { ...newData[specIndex], quantity };
      return newData;
    });
  };

  const handleShippingChange = (specIndex, shipping_cost) => {
    setFormData((prevData) => {
      const newData = [...prevData];
      newData[specIndex] = { ...newData[specIndex], shipping_cost };
      return newData;
    });
  };

  const AddSellerProduct = async (
    Pid,
    SpecId,
    price,
    quantity,
    shipping_cost
  ) => {
    if (price) {
      let payload = {
        sellerId: userId,
        productId: Pid,
        specId: SpecId,
        price: price,
        quantity: quantity,
        shipping_cost: shipping_cost,
        // "discount_price": inputValue?.discount_price
      };

      console.log(payload);

      await SellerProductAdd(payload)
        .then((res) => {
          if (res?.response?.data?.error == true) {
            toast.error(res?.response?.data?.message);

            // handleClose();
          } else {
            toast.success("product added successfully");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const checkAlreadySellingHandler = (productData) => {
    const specId = productData?.specId;
    const sellerId = userId;

    const totalSpecs = specId?.length;
    let totalSelling = 0;

    specId.forEach((spec) => {
      const mapping = spec?.variantSellerMappingId?.sellerId || [];

      if (mapping?.includes(sellerId)) {
        totalSelling += 1;
      }
    });

    if (totalSelling == totalSpecs) {
      return false;
    } else {
      return true;
    }
  };

  const checkSecSellingHandler = (spec) => {
    const mapping = spec?.variantSellerMappingId?.sellerId || [];
    const sellerId = userId;

    if (mapping?.includes(sellerId)) {
      return false;
    } else {
      return true;
    }
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
    console.log("Checkbox Value:", event.target.checked);
  };

  return (
    <div className="mt-3">
      <Row>
        <ProductSpecificationForm
          selectedproductid={selectedproductid}
          showModal={showModal}
          handleCloseModal={handleCloseModal}
          fetchData={fetchData}
        />
      </Row>
      <Container>
        <Modal show={showModal2} size="xl" onHide={handleCloseModal2}>
          <Modal.Header closeButton>
            <Modal.Title>Product Variants</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="d-flex justify-content-md-center gap-4">
              {variantsArray?.length > 0 &&
                variantsArray?.map((ele, index) => (
                  <Col key={index} className="d-flex justify-content-md-center">
                    <Card style={{ width: "18rem" }}>
                      {!ele?.is_approved && ele?.created_type != "admins" && (
                        <p className="newrq">
                          <span>
                            <AiOutlineInfoCircle size={20} />
                            {`New Request from - ${ele?.createdby?.shope_name}`}
                          </span>
                        </p>
                      )}

                      <Card.Img
                        className="p-2"
                        variant="top"
                        src={ele?.image?.[0]?.image_path}
                        style={{ height: "auto", objectFit: "cover" }}
                      />

                      <Card.Body>
                        <Row>
                          {ele?.spec_det?.length > 0 &&
                            ele?.spec_det?.slice(0, 5).map((ele, index) => (
                              <div key={index} className="p-desc">
                                <strong>{ele?.title} :</strong> {ele?.value}
                              </div>
                            ))}
                        </Row>
                        <Row className="mt-2">
                          <Col
                            style={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              background: "lightgrey",
                              textAlign: "center",
                              padding: "2%",
                            }}
                          >
                            M.R.P-{" "}
                            <span style={{ color: "green" }}>
                              {ele?.price?.toLocaleString()}
                            </span>
                          </Col>
                        </Row>
                        {!checkSecSellingHandler(ele) && (
                          <Row className="mt-2">
                            <Col
                              style={{
                                fontSize: "12px",
                                fontWeight: "bold",
                                background: "lightgrey",
                                textAlign: "center",
                                padding: "2%",
                              }}
                            >
                              <span style={{ color: "red" }}>
                                Already Selling
                              </span>
                            </Col>
                          </Row>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
            </Row>
          </Modal.Body>
        </Modal>
      </Container>

      <div>
        {/* Search Input and Button */}

        {/* Filter Selects */}
        <div style={{ backgroundColor: "#9de367" }} className="p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
            <div className="flex-grow-1">
              <div>
                <Form.Group controlId="categoryFilter" className="mb-2">
                  <Form.Label className="fw-bold small">
                    Search By Product
                  </Form.Label>
                  <Form.Control
                    placeholder="Search By Product"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                    }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="flex-grow-1">
              <Form.Group controlId="categoryFilter" className="mb-2">
                <Form.Label className="fw-bold small">Category</Form.Label>
                <Form.Select
                  name="categoryId"
                  value={filters.categoryId}
                  onChange={handleFilterChange}
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
            </div>

            <div className="flex-grow-1">
              <Form.Group controlId="subcategoryFilter" className="mb-2">
                <Form.Label className="fw-bold small">Subcategory</Form.Label>
                <Form.Select
                  name="subcategoryId"
                  value={filters.subcategoryId}
                  onChange={handleFilterChange}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories?.length > 0 && filters.categoryId !== ""
                    ? subcategories
                        ?.filter(
                          (sub) => sub?.category?._id === filters.categoryId
                        )
                        .map((sub) => (
                          <option key={sub._id} value={sub._id}>
                            {sub.title}
                          </option>
                        ))
                    : subcategories?.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.title}
                        </option>
                      ))}
                </Form.Select>
              </Form.Group>
            </div>

            <div className="flex-grow-1">
              <Form.Group controlId="brandFilter" className="mb-2">
                <Form.Label className="fw-bold small">Brand</Form.Label>
                <Form.Select
                  name="brandId"
                  value={filters.brandId}
                  onChange={handleFilterChange}
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
          </div>

          <div className="mt-3 float-end">
            <Form>
              <Form.Check
                type="checkbox"
                id="exampleCheckbox"
                label={`Hide Already Selling Products from Page : ${currentPage}`}
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
            </Form>
            {/* // <p>Checkbox is {isChecked ? "Checked" : "Unchecked"}</p> */}
          </div>

          <div className="d-flex justify-content-center mt-2 gap-2">
            <Button variant="dark" size="sm" onClick={handleReset}>
              Reset & Refresh Filters
            </Button>
          </div>
        </div>

        {/* <div className="d-flex justify-content-end mt-2 mb-2 gap-2">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={(data) => handlePageChange(data.selected + 1)}
            containerClassName={"pagination d-flex gap-2"}
            activeClassName={"active"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakLinkClassName={"page-link"}
          />
        </div> */}

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

        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Id</th>
              <th>Type</th>
              <th>Name</th>
              <th>Image</th>
              <th>Variants</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th>Brand</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center fw-bold">
                  Loading...
                </td>
              </tr>
            ) : filterData.length > 0 ? (
              filterData.map((row, index) => (
                <tr
                  key={index}
                  className={
                    !checkAlreadySellingHandler(row)
                      ? !isChecked
                        ? "opacity-50"
                        : "d-none"
                      : ""
                  }
                >
                  <td>{index + 1}</td>
                  <td>
                    {row?.productId?.substring(0, 15)}
                    <span className="mx-2">
                      {copied && copiedIndex === index ? (
                        <>
                          <BsClipboard2CheckFill size={20} color="green" />
                          <br />
                          <span style={{ fontSize: "10px", color: "green" }}>
                            Copied
                          </span>
                        </>
                      ) : (
                        <LuClipboardSignature
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            copyTextToClipboard(row?.productId, index)
                          }
                          size={18}
                        />
                      )}
                    </span>
                  </td>
                  <td>{row?.type}</td>
                  <td>{row?.name?.substring(0, 30) + "..."}</td>
                  <td>
                    <div className="productListItem">
                      <img
                        className="productListImg img-thumbnail"
                        width={20}
                        src={row.image?.[0]?.image_path}
                        alt=""
                      />
                    </div>
                  </td>
                  <td style={{ width: "150px" }}>
                    {row?.specId?.length}
                    <p
                      className="variCss"
                      onClick={() => showVariants(row?.specId)}
                    >
                      VIEW
                    </p>
                    {variationRequestCount(row?.specId) > 0 && (
                      <p className="newrqNo">
                        <AiOutlineInfoCircle size={22} />{" "}
                        {variationRequestCount(row?.specId)} Requested
                      </p>
                    )}
                  </td>
                  <td>
                    {row?.categoryId?.title}
                    {/* <TaxTable
                      data={row?.categoryId}
                      allComission={allComission}
                    /> */}
                  </td>
                  <td>{row?.subcategoryId?.title}</td>
                  <td>{row?.brandId?.title}</td>
                  {row?.status && row?.specId?.length >= 0 && (
                    <td>
                      <Button
                        onClick={() => {
                          if (checkAlreadySellingHandler(row)) {
                            handleAddProduct(row); // Only add if not already selling
                          }
                        }}
                        variant={
                          checkAlreadySellingHandler(row)
                            ? "success"
                            : "warning"
                        }
                        size="sm"
                        disabled={!row?.status || row?.specId?.length <= 0}
                      >
                        {checkAlreadySellingHandler(row)
                          ? "Add to Inventory"
                          : "Already Selling"}
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No data found</td>
              </tr>
            )}
          </tbody>
        </Table>

        <Container>
          <Row>
            <Modal size="xl" show={showSellerProduct} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title className="p-catname">
                  {seletedProducrt?.name}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Row>
                    <Col>
                      <ListGroup
                        style={{
                          maxHeight: "400px",
                          overflowY: "auto",
                          overflowX: "auto",
                          border: "1px solid #ccc",
                          borderRadius: "0px",
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          gap: "10px",
                          flexDirection: "column",
                          padding: "10px",
                        }}
                      >
                        {seletedProducrt?.specId?.map((ele, index) => (
                          <>
                            {checkSecSellingHandler(ele) && (
                              <ListGroup.Item
                                key={ele?._id}
                                style={{
                                  border: "1px solid #ccc",
                                  width: "100%",
                                }}
                              >
                                <Row>
                                  <Col>
                                    <span style={{ fontSize: "16px" }}>
                                      <strong>Variant Title:</strong>
                                      {" ( "}
                                      {ele?.spec_det?.length > 0 &&
                                        ele?.spec_det
                                          ?.slice(0, 3)
                                          .map((ele, index) => (
                                            <span
                                              key={index}
                                              className="p-desc"
                                            >
                                              {ele?.title} : {ele?.value}
                                              {index !== 2 && ", "}
                                            </span>
                                          ))}
                                      {" )"}
                                    </span>
                                  </Col>
                                </Row>

                                <Row>
                                  <Col xs={10}>
                                    <strong style={{ fontSize: "16px" }}>
                                      Variant Specification Details: {index + 1}
                                    </strong>
                                  </Col>
                                  <Col xs={2}>
                                    <Button
                                      variant="outline-success"
                                      size="sm"
                                      onClick={() =>
                                        AddSellerProduct(
                                          seletedProducrt?._id,
                                          ele?._id,
                                          formData[index]?.price,
                                          formData[index]?.quantity,
                                          formData[index]?.shipping_cost
                                        )
                                      }
                                      style={{
                                        whiteSpace: "nowrap",
                                      }}
                                      disabled={!ele?.is_approved}
                                    >
                                      Add To Inventory
                                    </Button>
                                  </Col>
                                </Row>

                                <Row className="locationTagHeader mt-2">
                                  <Col xs={1}>MRP (₹)</Col>
                                  <Col xs={1}>SKUID</Col>
                                  {ele?.spec_det
                                    ?.slice(1, 3)
                                    .map((e, index) => (
                                      <Col key={index} xs={2}>
                                        {e?.title}
                                      </Col>
                                    ))}
                                  <Col>Enter product price (₹)</Col>
                                  <Col>Add Stock</Col>
                                  <Col>Add Shipping Cost(₹)</Col>
                                </Row>
                                <Row className="locationTagvalue mt-2">
                                  <Col xs={1}>{ele?.price}</Col>
                                  <Col xs={1}>{ele?.skuId}</Col>
                                  {ele?.spec_det
                                    ?.slice(1, 3)
                                    .map((e, index) => (
                                      <Col key={index} xs={2}>
                                        {e?.value}
                                      </Col>
                                    ))}
                                  <Col>
                                    <Form.Group
                                      className="mb-3"
                                      controlId={`priceInput${index}`}
                                    >
                                      <Form.Control
                                        type="tel"
                                        size="sm"
                                        placeholder="Product Price"
                                        name="price"
                                        required
                                        max={ele?.price} // Add max attribute
                                        value={formData[index]?.price}
                                        onChange={(e) => {
                                          if (
                                            parseFloat(e.target.value) >
                                            ele?.price
                                          ) {
                                            document.getElementById(
                                              `error-${index}`
                                            ).innerText =
                                              "Price cannot exceed MRP!";
                                          } else {
                                            document.getElementById(
                                              `error-${index}`
                                            ).innerText = "";
                                            handlePriceChange(
                                              index,
                                              e.target.value
                                            );
                                          }
                                        }}
                                      />
                                      <div
                                        id={`error-${index}`}
                                        style={{
                                          color: "red",
                                          fontSize: "12px",
                                          marginTop: "4px",
                                        }}
                                      ></div>
                                    </Form.Group>
                                  </Col>
                                  <Col>
                                    <Form.Group
                                      className="mb-3"
                                      controlId="exampleForm.ControlInput1"
                                    >
                                      <Form.Control
                                        type="tel"
                                        size="sm"
                                        placeholder="Product Quatity"
                                        name="quantity"
                                        required
                                        value={formData[index]?.quantity}
                                        onChange={(e) =>
                                          handleQuansChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col>
                                    <Form.Group
                                      className="mb-3"
                                      controlId="exampleForm.ControlInput1"
                                    >
                                      <Form.Control
                                        type="tel"
                                        size="sm"
                                        placeholder="Shipping cost"
                                        name="shipping_cost"
                                        required
                                        value={formData[index]?.shipping_cost}
                                        onChange={(e) =>
                                          handleShippingChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            )}
                          </>
                        ))}
                      </ListGroup>
                    </Col>
                  </Row>
                </Form>
              </Modal.Body>
            </Modal>
          </Row>
        </Container>
        <Toaster position="top-right" />

        {/* Pagination Controls */}
      </div>
    </div>
  );
};

const ProductSpecificationForm = ({
  selectedproductid,
  showModal,
  handleCloseModal,
  fetchData,
}) => {
  // console.log({ selectedproductid })

  const [specifications, setSpecifications] = useState([
    {
      title: "",
      value: "",
      //user_choice: false,
    },
  ]);

  const [productPrice, setproductPrice] = useState(0);

  const [isEdit, setIsEdit] = useState(false);

  const [productImges, setProductImages] = useState([]);

  const [selectedSpecId, setSelectedSpecId] = useState();
  const [copyFrom, setCopyFrom] = useState(0);

  const handleChange = (index, title, value) => {
    setSpecifications((prevSpecifications) => {
      const newSpecifications = [...prevSpecifications];
      newSpecifications[index] = { title, value };
      return newSpecifications;
    });
  };

  const { auth } = useAuth();

  const addSpecification = () => {
    setSpecifications((prevSpecifications) => [
      ...prevSpecifications,
      { title: "", value: "" }, // Set user_choice to a default value
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
    console.log("Submitted Data:", specifications);
    let payload = {
      productId: selectedproductid?._id,
      spec_det: specifications,
      price: productPrice,
      image: productImges,
      skuId: generateRandomKey(),
      // user_choice:false,
    };

    payload["product_type"] = "products";

    payload["createdby"] = auth?.userId;

    payload["created_type"] = "admins";

    payload["is_approved"] = true;

    console.log(payload);

    let res = await ProductSpecificationCreate(payload);

    if (res?.data?.error) {
      toast.error("Something went wrong..");
    } else {
      console.log({ payload });
      fetchData();
      setSpecifications([
        {
          title: "",
          value: "",
          //user_choice: false,
        },
      ]);
      setproductPrice("");
      setProductImages([]);
      setCopyFrom(0);
      handleCloseModal(); // Close the modal after submitting
    }
  };

  const EdithandleSubmit = async () => {
    console.log("Submitted Data:", specifications);
    let payload = {
      productId: selectedproductid?._id,
      spec_det: specifications,
      price: productPrice,
      image: productImges,
      skuId: generateRandomKey(),
      // user_choice:false,
    };

    console.log(payload);

    let res = await UpdateProductSpecification(selectedSpecId, payload);

    if (res?.data?.error) {
      toast.error("Something went wrong..");
    } else {
      console.log(res);
      fetchData();
      setSpecifications([
        {
          title: "",
          value: "",
        },
      ]);
      setproductPrice("");
      setProductImages([]);
      setCopyFrom(0);
      handleCloseModal(); // Close the modal after submitting
    }
  };

  function generateRandomKey() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      key += characters.charAt(randomIndex);
    }

    return key;
  }

  const handleFileImageChange = async (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const selectedFiles = Array.from(files);
      console.log("Selected Files:", selectedFiles);
      selectedFiles.forEach((file, index) => {
        console.log(`File ${index + 1}:`, file);
      });

      for (const file of selectedFiles) {
        await onFileUpload(file);
      }
    }
  };

  const onFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await FileUpload(formData);
      console.log(res?.data?.data);

      setTimeout(() => {
        setProductImages((prevData) => [
          { image_path: res?.data?.data?.fileurl },
          ...prevData,
        ]);
      }, 3000);
    } catch (err) {
      console.error(err, "err");
    }
  };

  const deleteImage = (id) => {
    console.log("clc");
    let filterData = productImges?.filter((ele, i) => {
      return i != id;
    });
    console.log({ filterData });
    setProductImages(filterData);
  };

  const EditHandler = (id) => {
    handleReset();
    setSelectedSpecId(id);
    setIsEdit(true);
    let filterSpecData = selectedproductid?.specId?.find((ele) => {
      return ele?._id == id;
    });
    setSpecifications(filterSpecData?.spec_det);
    setProductImages(filterSpecData?.image);
    setproductPrice(filterSpecData?.price);
    console.log(filterSpecData);
  };

  const handleEditCancel = () => {
    setCopyFrom(0);
    setIsEdit(false);
    setSpecifications([
      {
        title: "",
        value: "",
      },
    ]);
    setproductPrice("");
    setProductImages([]);
  };

  const deleteSpec = async (id) => {
    let res = await DeleteProductSpecification(id);
    console.log(res);
    if (res?.data?.error) {
      toast.error("Something went wrong..");
    } else {
      toast.success("Spec delete successfully");
      setCopyFrom(0);
      handleReset();
      handleCloseModal();
    }
  };

  const ApprovalVariant = async (data) => {
    data["is_approved"] = true;

    console.log(data);

    let res = await UpdateProductSpecification(data?._id, data);

    if (res?.data?.error) {
      toast.error("Something went wrong..");
    } else {
      console.log(res);
      fetchData();
      setSpecifications([
        {
          title: "",
          value: "",
          //user_choice: false,
        },
      ]);
      setproductPrice("");
      setProductImages([]);
      handleCloseModal(); // Close the modal after submitting
    }
  };

  const handleCopySpecification = (e) => {
    let filterData = selectedproductid?.specId?.find((ele) => {
      return ele?._id == e.target.value;
    });

    console.log(filterData);

    setSpecifications(filterData?.spec_det);
    setproductPrice(filterData?.price);
    setProductImages(filterData?.image);
  };

  const handleReset = () => {
    setCopyFrom(0);
    setIsEdit(false);
    setSpecifications([
      {
        title: "",
        value: "",
      },
    ]);
    setproductPrice("");
    setProductImages([]);
  };

  const handleSpecificationsArrayUp = (index) => {
    console.log(index, "Up");

    const SpecificationsArray = [...specifications];

    let temp = SpecificationsArray[index];
    SpecificationsArray[index] = SpecificationsArray[index - 1];
    SpecificationsArray[index - 1] = temp;

    setSpecifications([...SpecificationsArray]);
  };

  const handleSpecificationsArrayDown = (index) => {
    console.log(index, "Down");

    const SpecificationsArray = [...specifications];

    let temp = SpecificationsArray[index];
    SpecificationsArray[index] = SpecificationsArray[index + 1];
    SpecificationsArray[index + 1] = temp;

    setSpecifications([...SpecificationsArray]);
  };

  return (
    <Modal
      show={showModal}
      onHide={() => {
        handleCloseModal();
        handleReset();
      }}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>Product Specification Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col>
              <ListGroup
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  overflowX: "auto",
                  border: "1px solid #ccc",
                  borderRadius: "0px",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "10px",
                  flexDirection: "column",
                }}
                className="p-2"
              >
                {selectedproductid?.specId?.map((ele, index) => (
                  <ListGroup.Item
                    key={ele?._id}
                    style={{
                      border: "1px solid #ccc",
                      width: "100%",
                    }}
                  >
                    <Row>
                      <Col>
                        <span style={{ fontSize: "16px" }}>
                          <strong>Variant Title:</strong>
                          {" ( "}
                          {ele?.spec_det?.length > 0 &&
                            ele?.spec_det?.slice(0, 3).map((ele, index) => (
                              <span key={index} className="p-desc">
                                {ele?.title} : {ele?.value}
                                {index !== 2 && ", "}
                              </span>
                            ))}
                          {" )"}
                        </span>
                      </Col>
                    </Row>

                    <Row className="mt-2">
                      <Col xs={3}>
                        <strong style={{ fontSize: "16px" }}>
                          Specification Details: {index + 1}
                        </strong>
                      </Col>
                      <Col>
                        {!ele?.is_approved && (
                          <Button
                            size="sm"
                            variant="outline-dark"
                            onClick={() => ApprovalVariant(ele)}
                          >
                            Make Approve {ele?.skuId} variation
                          </Button>
                        )}
                      </Col>
                      <Col xs={2}>
                        <Button
                          variant="success btn-sm"
                          size="sm"
                          onClick={() => EditHandler(ele?._id)}
                        >
                          Edit
                        </Button>
                      </Col>
                      <Col xs={1}>
                        <Button
                          variant="danger btn-sm"
                          size="sm"
                          onClick={() => deleteSpec(ele?._id)}
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>

                    <Row className="locationTagHeader mt-2">
                      <Col>Price</Col>
                      <Col>SKU ID</Col>
                      {ele?.spec_det?.map((e, index) => (
                        <Col key={index}>{e?.title}</Col>
                      ))}
                      <Col>Images</Col>
                    </Row>
                    <Row className="locationTagvalue">
                      <Col>{ele?.price}</Col>
                      <Col>{ele?.skuId}</Col>
                      {ele?.spec_det?.map((e, index) => (
                        <Col key={index}>{e?.value}</Col>
                      ))}
                      <Col size={2}>{ele?.image?.length}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
          <Row className="mt-2">
            <Row>
              <Col>
                <h5>Add Specifications of the variant</h5>
              </Col>
              <Col
                style={{
                  textAlign: "justify",
                }}
              >
                <span>
                  <FaCircleInfo />
                </span>
                <span>
                  {" "}
                  You should add at least 3 specifications for the product and
                  the first 3 specification should be the main differentiator of
                  the variant as it will show as the specification title.
                </span>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <h6>Copy Specification from existing variants</h6>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(e) => {
                    handleCopySpecification(e);
                    setCopyFrom(e.target.value);
                  }}
                  value={copyFrom}
                >
                  <option disabled value={0}>
                    open select
                  </option>
                  {selectedproductid?.specId?.map((ele, index) => (
                    <option key={index} value={ele?._id}>
                      Specification : {index + 1} (SKU ID : {ele?.skuId})
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col
                xs={3}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                }}
              >
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    handleReset();
                  }}
                >
                  Reset
                </Button>
              </Col>
            </Row>

            {specifications.map((specification, index) => (
              <Row key={index}>
                <Col>
                  <Form.Group controlId={`key-${index}`}>
                    <Form.Label>Specification Title:</Form.Label>
                    <Form.Control
                      type="text"
                      value={specification.title}
                      onChange={(e) =>
                        handleChange(index, e.target.value, specification.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId={`value-${index}`}>
                    <Form.Label>Specification Value :</Form.Label>
                    <Form.Control
                      type="text"
                      value={specification.value}
                      onChange={(e) =>
                        handleChange(index, specification.title, e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col className="d-flex align-items-end justify-content-start gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeSpecification(index)}
                  >
                    Delete
                  </Button>
                  {specifications.length > 1 && (
                    <>
                      {index !== specifications.length - 1 && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            handleSpecificationsArrayDown(index);
                          }}
                        >
                          <FaArrowDown />
                        </Button>
                      )}
                      {index !== 0 && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            handleSpecificationsArrayUp(index);
                          }}
                        >
                          <FaArrowUp />
                        </Button>
                      )}
                    </>
                  )}
                </Col>
              </Row>
            ))}
          </Row>
          <Row className="mt-2">
            <Col xs={3}>
              <Button variant="dark" size="sm" onClick={addSpecification}>
                <IoIosAdd /> Add Specification
              </Button>
            </Col>
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
                  <Form.Control
                    type="file"
                    multiple
                    onChange={handleFileImageChange}
                  />
                </Form.Group>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Row>
                {productImges?.length > 0 &&
                  productImges?.map((ele, index) => (
                    <Col key={index} xs={2}>
                      <span>{index + 1}</span>
                      <span>
                        <MdCancel
                          style={{
                            color: "red",
                            fontSize: "20px",
                            cursor: "pointer",
                          }}
                          onClick={() => deleteImage(index)}
                        />
                      </span>
                      <Image src={ele?.image_path} thumbnail />
                    </Col>
                  ))}
              </Row>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              {isEdit ? (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <Button variant="dark" size="sm" onClick={EdithandleSubmit}>
                    Update Specification
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      handleEditCancel();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="dark" size="sm" onClick={handleSubmit}>
                  Submit Specification
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

const TaxTable = ({ data, allComission }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="mt-2">
      <p className="shwTx" onClick={() => setShow(!show)}>
        {show ? "Hide" : "Show"} Commssion & Tax
      </p>
      {show && (
        <table className="border-collapse border border-gray-300 w-full text-left">
          <tbody>
            <tr>
              <td className="border border-black-500 p-1">Commission</td>
              <td className="border border-black-500 p-1">
                {allComission?.find(
                  (item) => item?.categoryId?._id == data?._id
                )?.commission_rate || 0}
                %
              </td>
            </tr>
            <tr>
              <td className="border border-black-500 p-1">IGST</td>
              <td className="border border-black-500 p-1">
                {data?.igst || 0}%
              </td>
            </tr>
            <tr>
              <td className="border border-black-500 p-1">CGST</td>
              <td className="border border-black-500 p-1">
                {data?.cgst || 0}%
              </td>
            </tr>
            <tr>
              <td className="border border-black-500 p-1">SGST</td>
              <td className="border border-black-500 p-1">
                {data?.sgst || 0}%
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AddingProductTable;
