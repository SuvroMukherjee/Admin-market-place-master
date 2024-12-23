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
  ListGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineInfoCircle, AiOutlinePlus } from "react-icons/ai";
import { BsClipboard2CheckFill } from "react-icons/bs";
import { CiCircleInfo } from "react-icons/ci";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { FaCircleInfo, FaCirclePlus } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";
import { LiaMailBulkSolid } from "react-icons/lia";
import { LuClipboardSignature } from "react-icons/lu";
import { MdCancel } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import {
  DeleteProductSpecification,
  FileUpload,
  ProductSpecificationCreate,
  StatusUpdateProduct,
  UpdateProductSpecification,
  allBrandList,
  allCategoryList,
  allSubCategoryList,
} from "../../../API/api";
import useAuth from "../../../hooks/useAuth";
import { useDebounce } from "../../../hooks/useDebounce";
import "../product.css";

const apiUrl = import.meta.env.VITE_API_BASE;

const PList = () => {
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

  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState(null);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    fetchData();
  };

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Ensure searchTerm is a string before applying replace
      // const updatedSearchTerm = searchTerm
      //   ? searchTerm.replace(/\([^)]+\)$/, "(Updated Content)")
      //   : searchTerm;

      const res = await axios.get(
        `${apiUrl}/product/all-list?page=${currentPage}&limit=50&categoryId=${
          filters.categoryId
        }&subcategoryId=${filters.subcategoryId}&brandId=${
          filters.brandId
        }&productId=${searchTerm?.trim()}`
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
    try {
      const res = await allCategoryList();
      let data = res.data?.data
        ?.filter((item) => item?.status == true)
        ?.sort((a, b) => a?.title?.localeCompare(b?.title));
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await allSubCategoryList();
      let data = res.data?.data
        ?.filter((item) => item?.status == true)
        ?.sort((a, b) => a?.title?.localeCompare(b?.title));
      setSubcategories(data);
    } catch (error) {
      console.error("Error fetching subcategories", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await allBrandList();
      let data = res.data?.data
        ?.filter((item) => item?.status == true)
        ?.sort((a, b) => a?.title?.localeCompare(b?.title));
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands", error);
    }
  };

  // const handleSearch = () => {
  //   fetchData(); // Trigger search when the search button is clicked
  // };

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

  // const handledeleteProduct = async (id) => {
  //   await deleteProduct(id)
  //     .then((res) => {
  //       console.log(res);
  //       fetchData();
  //       toast.success("Product deleted successfully!");
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // const csvData = filterData.flatMap((product, index) => {
  //   const htmlToPlainText = (html) => {
  //     const tempDiv = document.createElement("div");
  //     tempDiv.innerHTML = html;
  //     return tempDiv.textContent || tempDiv.innerText || "";
  //   };

  //   return {
  //     "SL NO": index + 1,
  //     "Product Name": product?.name,
  //     "Product ID": product?.productId,
  //     "Product Type": product?.type,
  //     "Product Category": product?.categoryId?.title,
  //     "Product Sub-Category": product?.subcategoryId?.title,
  //     "Product Brand": product?.brandId?.title,
  //     "Product Tax status": product?.tax_status,
  //     "Product Visibility": "Visible",
  //     "Product Identification Images": product?.image
  //       ?.map((ele) => ele?.image_path)
  //       .join(","),
  //     "Product Features": product?.features?.map((ele) => ele).join(" "),
  //     "Product Uploaded Date": moment(product?.updatedAt).format(
  //       "DD-MM-YYYY, hh:mm:ss A"
  //     ),
  //     "Product Specifications": product?.specId
  //       ?.flatMap((spec) =>
  //         spec?.spec_det?.map((det) => `${det.title}: ${det.value}`)
  //       )
  //       .join(", "),
  //     "Specification Images": product?.specId
  //       ?.flatMap((spec) => spec?.image?.map((image) => image?.image_path))
  //       .join(", "),
  //     "Specification Prices": product?.specId
  //       ?.map((spec) => spec?.price)
  //       .join(", "),
  //     "Specification SkuId": product?.specId
  //       ?.map((spec) => spec?.skuId)
  //       .join(", "),
  //     "Product Description": product?.desc,
  //     // "Product Full Description": htmlToPlainText(product?.full_desc),
  //   };
  // });

  // const onFileUpload = async (file, type) => {
  //   try {
  //     setUploading(true);

  //     const formData = new FormData();
  //     formData.append("file", file);

  //     const uploadResponse = await FileUpload(formData);
  //     const fileName = uploadResponse?.data?.data?.fileName;

  //     if (!fileName) {
  //       throw new Error("File upload failed");
  //     }

  //     const payload = { file: fileName };
  //     const Bulkres =
  //       type == "spec"
  //         ? await SpecBulkProductUpload(payload)
  //         : await BulkProductUpload(payload);

  //     if (Bulkres?.data?.error === false) {
  //       toast.success(`Upload successful: ${file.name}`);
  //       fetchData();
  //     } else {
  //       throw new Error(`Could not upload file: ${file.name}`);
  //     }
  //   } catch (error) {
  //     console.error("Error in file upload:", error.message);
  //     toast.error(`Error in file upload: ${error.message}`);
  //   } finally {
  //     setUploading(false);
  //     fetchData();
  //   }
  // };

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

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchAllData = async () => {
    let currentPage = 1;
    const pageSize = 50; // Based on your API
    let allData = [];
    let isFetching = true;

    try {
      setDownloadLoading(true);

      while (isFetching) {
        // Wait for 100 ms before making the API call
        setDownloadMessage("Processing page " + currentPage);
        await sleep(300);

        const response = await axios.get(
          `${apiUrl}/product/all-list?page=${currentPage}&limit=${pageSize}`
        );

        const fetchedData = response.data?.data || []; // Assuming 'items' contains the data
        allData = [...allData, ...fetchedData];

        // If less than page size is returned, we know we're at the last page
        if (fetchedData.length < pageSize) {
          isFetching = false;
        } else {
          currentPage++; // Move to the next page
        }
      }

      return allData;
    } catch (error) {
      console.error("Error fetching all data:", error);
      toast.error("Error fetching all data");
      return [];
    } finally {
      setDownloadLoading(false);
      setDownloadMessage(null);
    }
  };

  const downloadCSV = async () => {
    try {
      const allData = await fetchAllData();

      if (allData.length === 0) {
        toast.error("No data to download!");
        return;
      }

      const csvData = allData.flatMap((product, index) => {
        const htmlToPlainText = (html) => {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = html;
          return tempDiv.textContent || tempDiv.innerText || "";
        };

        return {
          "SL NO": index + 1,
          "Product DB ID": product?._id,
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
          "Product Full Description": htmlToPlainText(product?.full_desc),
        };
      });

      let csvData2 = [];

      allData.forEach((product, productIndex) => {
        const specId = product?.specId || [];

        if (specId.length > 0) {
          specId.forEach((spec) => {
            const images = spec?.image || [];
            const imageUrls = images.map((item) => item.image_path).join(", ");
            const price = spec?.price || "";
            const spec_det = spec?.spec_det || [];
            const spec_det_values = spec_det
              .map((item) => item?.value || "")
              .join(", ");
            const spec_det_titles = spec_det
              .map((item) => item?.title || "")
              .join(", ");
            const skuId = spec?.skuId || "";

            csvData2.push({
              "SL NO": productIndex + 1,
              "Product DB ID": product?._id,
              "Product ID": product?.productId,
              "Sku Id": skuId,
              "Spec Det Titles": spec_det_titles,
              "Spec Det Values": spec_det_values,
              "Image Urls": imageUrls,
              Price: price,
            });
          });
        }
      });

      const csvContent = convertToCSV(csvData);
      const csvContent2 = convertToCSV(csvData2);

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "products.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const blob2 = new Blob([csvContent2], {
        type: "text/csv;charset=utf-8;",
      });
      const link2 = document.createElement("a");
      link2.href = URL.createObjectURL(blob2);
      link2.setAttribute("download", "product_variant.csv");
      document.body.appendChild(link2);
      link2.click();
      document.body.removeChild(link2);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  const replacer = (key, value) => (value === null ? "" : value);

  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((header) => JSON.stringify(row[header], replacer)).join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  };

  const debouncedFetchData = useDebounce(fetchData, 300);

  useEffect(() => {
    debouncedFetchData();
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

  return (
    <div className="productList mt-2 p-4">
      <Container className="mt-2 mb-4">
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h3>Product List</h3>
          </Col>
        </Row>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "20px",
            marginTop: "16px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn btn-dark btn-sm"
            onClick={() => navigate("/Admin/uploadbulk")}
          >
            <span className="me-2">
              <LiaMailBulkSolid />
            </span>
            Upload Products in Bulk
          </button>
          <button
            className="btn btn-dark btn-sm"
            onClick={() => navigate("/Admin/Addproduct")}
          >
            <AiOutlinePlus /> Add New Product
          </button>
          <button
            className="btn btn-dark btn-sm"
            onClick={downloadCSV}
            disabled={downloadLoading}
          >
            {downloadLoading ? downloadMessage : "Download Products CSV"}
          </button>
        </div>

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
            <Modal.Body>
              <Row className="d-flex justify-content-md-center gap-4">
                {variantsArray?.length > 0 &&
                  variantsArray?.map((ele, index) => (
                    <Col
                      key={index}
                      className="d-flex justify-content-md-center"
                    >
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
                              M.R.P -{" "}
                              <span style={{ color: "green" }}>
                                {ele?.price?.toLocaleString()}
                              </span>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </Modal.Body>
          </Modal>
        </Container>
      </Container>

      <Toaster position="top-right" />
      <div>
        {/* Search Input and Button */}
        {/* <div>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Search</InputGroup.Text>
            <Form.Control
              placeholder="search product by productId id or product name without product specifications"
              aria-label="Search-Product"
              aria-describedby="basic-addon1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="d-flex justify-content-end ml-4">
              <Button size="sm" variant="dark" onClick={handleSearch}>
                <FaSearch />
                <span className="mx-2">Search</span>
              </Button>
            </div>
          </InputGroup>
        </div> */}

        {/* Filter Selects */}
        <div className="d-flex justify-content-between mb-3 gap-4">
          <Form.Control
            placeholder="Search Product"
            aria-label="Search-Product"
            aria-describedby="basic-addon1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
          <Form.Select
            name="subcategoryId"
            value={filters.subcategoryId}
            onChange={handleFilterChange}
          >
            <option value="">Select Subcategory</option>
            {subcategories?.length > 0 &&
              subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.title}
                </option>
              ))}
          </Form.Select>
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

          <div className="d-flex justify-content-center gap-2">
            <Button
              style={{
                whiteSpace: "nowrap",
              }}
              variant="dark"
              size="sm"
              onClick={handleReset}
            >
              Reset & Refresh
            </Button>
          </div>
        </div>

        {/* <div className="d-flex justify-content-end mt-2 mb-4">
          <Pagination>
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
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

        <div
          style={{
            maxHeight: 500,
            overflowY: "auto",
            border: "1px solid #ccc",
          }}
        >
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Product Id
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Image
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Variants
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Category
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Sub Category
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Uploaded
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Live Preview
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="100%">Loading...</td>
                </tr>
              ) : filterData?.length > 0 ? (
                filterData.map((row, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * 50 + (index + 1)}</td>
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
                          <>
                            <LuClipboardSignature
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                copyTextToClipboard(row?.productId, index)
                              }
                              size={18}
                            />
                          </>
                        )}
                      </span>
                    </td>
                    <td>{row?.name?.substring(0, 20) + "..."}</td>
                    <td>
                      <div className="productListItem">
                        <img
                          className="productListImg"
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
                          {variationRequestCount(row?.specId)} Requested{" "}
                        </p>
                      )}
                    </td>
                    <td>{row?.categoryId?.title}</td>
                    <td>{row?.subcategoryId?.title}</td>
                    <td>{moment(row?.updatedAt).format("LLL")}</td>
                    <td className="d-flex justify-content-center">
                      {row?.specId?.length > 0 ? (
                        <a
                          href={`http://zoofi.in/livepreview/${row?._id}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <Image
                            src="https://w7.pngwing.com/pngs/1001/808/png-transparent-google-chrome-app-web-browser-icon-google-chrome-logo-text-orange-logo.png"
                            width={50}
                            height={50}
                            thumbnail
                          />
                        </a>
                      ) : (
                        <p
                          style={{
                            color: "rgb(122 119 119)",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          <CiCircleInfo size={15} /> Add At least 1 variant
                        </p>
                      )}{" "}
                    </td>
                    <td style={{ width: "275px" }}>
                      <div className="buttonWrapper">
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => {
                            handleShowModal();
                            setSeledtedProductId(row);
                          }}
                        >
                          <FaCirclePlus /> Variants
                        </Button>
                        <Link
                          to={`/Admin/Editproduct/${row?._id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <Button variant="success" size="sm">
                            Edit
                          </Button>
                        </Link>

                        {row?.status ? (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleStatus(row)}
                          >
                            Deactivate
                          </Button>
                        ) : (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleStatus(row)}
                          >
                            Activate
                          </Button>
                        )}
                        {/* <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handledeleteProduct(row?._id)}
                      >
                        Delete
                      </Button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">No data found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
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
    if (specifications.length === 0) {
      toast.error("Please add at least one specification");
      return;
    }

    if (productPrice === 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (productImges.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    let payload = {
      productId: selectedproductid?._id,
      spec_det: specifications,
      price: productPrice,
      image: productImges,
      skuId: generateRandomKey(),
      user_choice: false,
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
          user_choice: false,
        },
      ]);
      setproductPrice("");
      setProductImages([]);
      setCopyFrom(0);
      handleCloseModal();
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

export default PList;
