import axios from "axios"; // or your preferred HTTP client
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Table
} from "react-bootstrap";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FaEye, FaStar } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import {
  allBrandList,
  allCategoryList,
  allSubCategoryList,
  MakePopularProduct,
} from "../../API/api";
import { ratingCalculation } from "../../common/RatingAvg";

const baseURL = import.meta.env.VITE_API_BASE; // Replace with your actual base URL

const SPList = () => {
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

  const { id: sellerID } = useParams();
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const { name, categoryId, subcategoryId, brandId, isPopular } = filters;
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
            isPopular: isPopular ? "true" : "false",
          },
        }
      );
      setFilteredData(res.data?.data?.SellerProductData);
      setTotalPages(res.data?.data?.pagination?.totalPages); // Assume the API provides totalPages
      setReviewData(res?.data?.data?.reviewData);
      setTotalProducts(res.data?.data?.pagination?.totalSellerProducts);
      setLoading(false);
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


  return (
    <div className="productList mt-2 p-4">
      <Container>
        <Row>
          <Col>
            <Link to={"/SellerReport"}>
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
              Product List By{" "}
              <span
                style={{
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: ".5px",
                  background: "lightgray",
                  padding: "11px 20px",
                  borderRadius: "10px",
                  margin: "5px",
                }}
              >
                {filteredData[0]?.sellerId?.user_name}{" "}
                <span>
                  <img
                    src={
                      filteredData[0]?.sellerId?.Shop_Details_Info
                        ?.pic_of_shope[0]
                    }
                    width={100}
                  />
                </span>
              </span>
            </h6>
          </Col>
        </Row>
      </Container>
      <Container>
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

      <div className="d-flex justify-content-between mb-3 gap-2">
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
        {/* <Form.Group controlId="isPopular">
          <Form.Check
            type="checkbox"
            name="isPopular"
            label="Show Only Popular Products"
            checked={filters.isPopular}
            onChange={handleFilterChange}
          />
        </Form.Group> */}
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
        {/* <Button variant="dark" size="sm" className="ml-2">
          {totalProducts} Total Products
        </Button> */}
        <Button variant="secondary" size="sm" className="ml-2">
          {filteredData?.length} Filtered Products
        </Button>
      </div>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <td style={{ width: "300px" }}>Product Name</td>
            <td>Product Id</td>
            <td>Product Image</td>
            <td>View Product In Zoofi</td>
            <td>Review Data</td>
            <td>Add as Popular Product</td>
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
                  <div>
                    <FaStar color="gold" size={25} />
                    <span className="mx-4">
                      {ratingCalculation(row?._id, reviewData)}
                    </span>
                  </div>
                </td>
                <td>
                  {row?.is_popular ? (
                    <Button
                      variant="outline-dark"
                      onClick={() => HandleTopFunction(row, false)}
                      size="sm"
                    >
                      Already Mark
                    </Button>
                  ) : (
                    <Button
                      variant="dark"
                      onClick={() => HandleTopFunction(row, true)}
                      size="sm"
                    >
                      Mark As Popular
                    </Button>
                  )}
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
    </div>
  );
};

export default SPList;