import axios from "axios"; // or your preferred HTTP client
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FaEye, FaStar } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  allBrandList,
  allCategoryList,
  allSubCategoryList,
  MakePopularProduct,
  UpdateSellerProductDataStatus,
} from "../../API/api";
import { ratingCalculation } from "../../common/RatingAvg";
import { useDebounce } from "../../hooks/useDebounce";
import { BiSolidOffer } from "react-icons/bi";

const baseURL = import.meta.env.VITE_API_BASE;

const SellingProductOffer = () => {
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
  });

  const navigate = useNavigate()

  const { id: sellerID } = useParams();
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const { name, categoryId, subcategoryId, brandId, isPopular } = filters;
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
            is_popular: isPopular ? true : undefined,
          },
        }
      );
      setFilteredData(res.data?.data?.SellerProductData);
      setTotalPages(res.data?.data?.pagination?.totalPages);
      setReviewData(res?.data?.data?.reviewData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "isPopular") {
      setFilters((prev) => ({
        ...prev,
        [name]: filters[name] ? undefined : true,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

  const handleCloseListing = async (row) => {
    if (window.confirm("Are you sure you want to close this listing?")) {
      toast.promise(
        UpdateSellerProductDataStatus(row?._id, { status: !row?.status }),
        {
          loading: "Updating status...",
          success: "Updated the status successfully",
          error: "Unable to update status",
        }
      );
      debouncedFetchData();
    }
  };

  const debouncedFetchData = useDebounce(fetchData, 500);
  const debouncedFetchCategories = useDebounce(fetchCategories, 500);
  const debouncedFetchSubcategories = useDebounce(fetchSubcategories, 500);
  const debouncedFetchBrands = useDebounce(fetchBrands, 500);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    debouncedFetchData();
    debouncedFetchCategories();
    debouncedFetchSubcategories();
    debouncedFetchBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);

  return (
    <div className="productList mt-2 p-4">
      <Row>
        <Col>
          <Link to={"/product-offer-sellerchoose"}>
            <Button variant="dark" size="sm">
              <AiOutlineArrowLeft />
              <span className="mx-2">Back</span>
            </Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <h6 className="text-center">
            Select your Products to Apply Offers from {filteredData[0]?.sellerId?.user_name}
          </h6>
        </Col>
      </Row>

      <div className="d-flex justify-content-between mb-3 gap-2 mt-4">
        <Form.Control
          type="text"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          placeholder="Search by product name"
          size="sm"
        />

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
      </div>

      <div className="d-flex justify-content-end mt-2 mb-4 gap-2">
        <Form.Group controlId="isPopular">
          <Form.Check
            type="checkbox"
            name="isPopular"
            label="Show Only Popular Products"
            checked={filters.isPopular}
            onChange={handleFilterChange}
          />
        </Form.Group>
      </div>

      <div className="d-flex justify-content-center mt-2 mb-4 gap-2">
        <Button variant="dark" size="sm" onClick={handleReset}>
          Reset & Refresh
        </Button>
        <Button variant="secondary" size="sm" className="ml-2">
          {filteredData?.length} Filtered Products
        </Button>
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

      <Table bordered hover responsive>
        <thead>
          <tr>
            <td style={{ width: "300px", fontWeight: "bold" }}>Product Name</td>
            <td style={{ fontWeight: "bold" }}>Product Id</td>
            <td style={{ fontWeight: "bold" }}>Product Image</td>
            <td style={{ fontWeight: "bold" }}>View Product In Zoofi</td>
            <td style={{ fontWeight: "bold" }}>Action</td>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          ) : filteredData.length > 0 ? (
            filteredData.map((row) => (
              <tr key={row._id}>
                <td style={{ width: "300px" }}>{row?.name}</td>
                <td style={{ width: "300px" }}>{row?.productId?.productId}</td>
                <td>
                  <img
                    className="productListImg"
                    src={row?.specId?.image?.[0]?.image_path}
                    alt=""
                  />
                </td>
                <td>
                  <a
                    href={`https://zoofi.in/product-details/${row?._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" size="sm">
                      <FaEye />
                    </Button>
                  </a>
                </td>
                <td>
                 
                  <Button variant="warning" size="sm" onClick={() => navigate(`/Admin/offer/${row?._id}`)}><span className='mx-1'><BiSolidOffer size={20}/></span> APPLY OFFERS</Button>
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
    </div>
  );
};

export default SellingProductOffer;
