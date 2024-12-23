import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import {
  AdminOfferDelete,
  allBrandList,
  allCategoryList,
  allOfferList,
  newOfferCreate,
} from "../../../API/api";

const OfferManagment = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [offerData, setOfferData] = useState({
    offerName: "",
    brand: "",
    category: "",
    discountType: "percentage", // Default to percentage
    discountValue: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [offerLoading, setOfferLoading] = useState(true);

  async function getCategoryList() {
    await allCategoryList()
      .then((res) => {
        const dataWithUniqueIds = res?.data?.data
          ?.map((item, index) => ({
            ...item,
            id: index + 1,
          }))
          ?.filter((item) => item.status)
          ?.sort((a, b) => a.title.localeCompare(b.title)); // Adjust `name` to the appropriate key

        setCategories(dataWithUniqueIds);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function getAllBrandLists() {
    await allBrandList()
      .then((res) => {
        const dataWithUniqueIds = res?.data?.data
          ?.map((item, index) => ({
            ...item,
            id: index + 1,
          }))
          ?.sort((a, b) => a.title.localeCompare(b.title)); // Replace `name` with the key to sort by

        setBrands(dataWithUniqueIds); // Update the state with sorted data
        setLoading(false); // Set loading to false after processing
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function getAllOfferList() {
    try {
      const res = await allOfferList();
      if (!res?.data?.error) {
        setOffers(res?.data?.data);
      }
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Error! fetching offers");
    } finally {
      setOfferLoading(false);
    }
  }

  useEffect(() => {
    getCategoryList();
    getAllBrandLists();
    getAllOfferList();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOfferData({ ...offerData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await newOfferCreate(offerData); // Replace with your API endpoint
      if (!response?.data?.error) {
        alert("Offer created successfully!");
      }
    } catch (error) {
      console.error("Error creating offer:", error);
      alert("Failed to create offer. Please try again.");
    } finally {
      setLoading(false);
      setOfferData({
        offerName: "",
        brand: "",
        category: "",
        discountType: "percentage",
        discountValue: "",
        minAmount: "",
        maxAmount: "",
        startDate: "",
        endDate: "",
      });
      getAllOfferList();
    }
  };

  // Handle delete offer
  const handleDelete = async (offerId) => {
    try {
      const response = await AdminOfferDelete(offerId); // Replace with your API endpoint
      if (!response?.data?.error) {
        alert("Offer deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
      alert("Failed to delete offer. Please try again.");
    } finally {
      getAllOfferList();
    }
  };

  return (
    <Container className="my-5 productList">
      <h2 className="text-center mb-4">Create Offer</h2>
      <Form onSubmit={handleSubmit} className="mb-5">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Offer Name</Form.Label>
              <Form.Control
                type="text"
                name="offerName"
                value={offerData.offerName}
                onChange={handleInputChange}
                placeholder="Enter offer name"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={offerData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Select
                name="brand"
                value={offerData.brand}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand._id}>
                    {brand?.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="mx-4">Discount Type</Form.Label>
              <Form.Check
                inline
                label="Percentage"
                name="discountType"
                type="radio"
                value="percentage"
                checked={offerData.discountType === "percentage"}
                onChange={handleInputChange}
              />
              <Form.Check
                inline
                label="Flat"
                name="discountType"
                type="radio"
                value="flat"
                checked={offerData.discountType === "flat"}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                {offerData.discountType === "percentage"
                  ? "Discount (%)"
                  : "Flat Discount (Amount)"}
              </Form.Label>
              <Form.Control
                type="number"
                name="discountValue"
                value={offerData.discountValue}
                onChange={handleInputChange}
                placeholder={
                  offerData.discountType === "percentage"
                    ? "Enter discount percentage"
                    : "Enter flat discount amount"
                }
                required
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Minimum Amount</Form.Label>
              <Form.Control
                type="number"
                name="minAmount"
                value={offerData.minAmount}
                onChange={handleInputChange}
                placeholder="Enter minimum amount"
                required
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Maximum Amount</Form.Label>
              <Form.Control
                type="number"
                name="maxAmount"
                value={offerData.maxAmount}
                onChange={handleInputChange}
                placeholder="Enter maximum amount"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={offerData.startDate}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={offerData.endDate}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit">
          Create Offer
        </Button>
      </Form>

      <h3 className="text-center mb-4">Offer List</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Offer Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Discount</th>
            <th>Min Amount</th>
            <th>Max Amount</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer, index) => (
            <tr key={offer.id}>
              <td>{index + 1}</td>
              <td>{offer.offerName}</td>
              <td>{brands.find((b) => b.id === offer.brand)?.name || "N/A"}</td>
              <td>
                {categories.find((c) => c.id === offer.category)?.name || "N/A"}
              </td>
              <td>
                {offer.discountType === "percentage"
                  ? `${offer.discountValue}%`
                  : `₹${offer.discountValue}`}
              </td>
              <td>₹{offer.minAmount}</td>
              <td>₹{offer.maxAmount}</td>
              <td>{offer.startDate}</td>
              <td>{offer.endDate}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(offer.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default OfferManagment;
