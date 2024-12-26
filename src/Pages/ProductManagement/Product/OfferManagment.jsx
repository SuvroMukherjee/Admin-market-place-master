import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import {
  AdminOfferDelete,
  AdminOfferUpdate,
  allBrandList,
  allCategoryList,
  allOfferList,
  getAllBrandsBycat,
  getAllCategoryBybrand,
  newOfferCreate,
} from "../../../API/api";
import { MdDelete, MdEdit } from "react-icons/md";
import moment from "moment";

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
  const [editingOfferId, setEditingOfferId] = useState(null);

  async function getCategoryList() {
    if (offerData?.brand !== "") {
      try {
        const res = await getAllCategoryBybrand(offerData?.brand);
        const dataWithUniqueIds = res?.data?.data
          ?.map((item, index) => ({
            ...item,
            id: index + 1,
          }))
          ?.sort((a, b) => a.title.localeCompare(b.title)); // Adjust `name` to the appropriate key
        setCategories(dataWithUniqueIds);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await allCategoryList();
        const dataWithUniqueIds = res?.data?.data
          ?.map((item, index) => ({
            ...item,
            id: index + 1,
          }))
          ?.filter((item) => item.status)
          ?.sort((a, b) => a.title.localeCompare(b.title)); // Adjust `name` to the appropriate key
        setCategories(dataWithUniqueIds);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  }

  async function getAllBrandLists() {
    if (offerData?.category !== "") {
      try {
        const res = await getAllBrandsBycat(offerData?.category);
        const dataWithUniqueIds = res?.data?.data
          ?.map((item, index) => ({
            ...item,
            id: index + 1,
          }))
          ?.sort((a, b) => a.title.localeCompare(b.title)); // Adjust `name` to the appropriate key
        setBrands(dataWithUniqueIds);
        setLoading(false);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await allBrandList();
        const dataWithUniqueIds = res?.data?.data
          ?.map((item, index) => ({
            ...item,
            id: index + 1,
          }))
          ?.filter((item) => item.status)
          ?.sort((a, b) => a.title.localeCompare(b.title)); // Adjust `name` to the appropriate key
        setBrands(dataWithUniqueIds);
        setLoading(false);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
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

  useEffect(() => {
    getAllBrandLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offerData?.category]);

  useEffect(() => {
    getCategoryList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offerData?.brand]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOfferData({ ...offerData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (editingOfferId) {
      // If editing, update the offer
      await handleUpdate();
    } else {
      // If creating a new offer
      try {
        const response = await newOfferCreate(offerData); // Replace with your API endpoint
        if (!response?.data?.error) {
          alert("Offer created successfully!");
          getAllOfferList();
        }
      } catch (error) {
        console.error("Error creating offer:", error);
        alert("Failed to create offer. Please try again.");
      } finally {
        setLoading(false);
        resetForm();
      }
    }
  };
  // Handle updating an offer
  const handleUpdate = async () => {
    try {
      const response = await AdminOfferUpdate(editingOfferId, offerData); // Replace with your API endpoint
      if (!response?.data?.error) {
        alert("Offer updated successfully!");
        getAllOfferList();
      }
    } catch (error) {
      console.error("Error updating offer:", error);
      alert("Failed to update offer. Please try again.");
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  // Prefill the form for editing
  const handleEdit = (offer) => {
    setEditingOfferId(offer._id); // Set the ID of the offer being edited
    setOfferData({
      offerName: offer.offerName || "",
      brand: offer.brand?._id || "",
      category: offer.category?._id || "",
      discountType: offer.discountType || "percentage",
      discountValue: offer.discountValue || "",
      minAmount: offer.minAmount || "",
      maxAmount: offer.maxAmount || "",
      startDate: offer.startDate?.slice(0, 10) || "",
      endDate: offer.endDate?.slice(0, 10) || "",
    });
  };

  // Reset the form to its initial state
  const resetForm = () => {
    setEditingOfferId(null);
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
  };

  // Handle delete offer
  const handleDelete = async (offerId) => {
    const isConfirmed = confirm("Are you sure you want to delete this offer?");
    if (!isConfirmed) {
      return;
    }
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

  const handleStatus = async (data) => {
    try {
      let payload = {
        status: !data?.status,
      };
      const res = await AdminOfferUpdate(data?._id, payload);
      if (!res?.data?.error) {
        getAllOfferList();
        alert("Offer updated successfully!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container className="my-5 productList">
      <h2 className="text-center mb-4">
        {editingOfferId ? "Update Offer" : "Create Offer"}
      </h2>
      <Form onSubmit={handleSubmit} className="">
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
                  <option key={category._id} value={category._id}>
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
                disabled={!offerData.category}
                required
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
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
              <Form.Label>Minimum Amount(Optional)</Form.Label>
              <Form.Control
                type="number"
                name="minAmount"
                value={offerData.minAmount}
                onChange={handleInputChange}
                placeholder="Enter minimum amount"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Maximum Amount(Optional)</Form.Label>
              <Form.Control
                type="number"
                name="maxAmount"
                value={offerData.maxAmount}
                onChange={handleInputChange}
                placeholder="Enter maximum amount"
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
          {editingOfferId ? "Update Offer" : "Create Offer"}
        </Button>
        {editingOfferId && (
          <Button variant="secondary" className="ms-3" onClick={resetForm}>
            Cancel
          </Button>
        )}
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
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {offerLoading ? (
            <tr>
              <td colSpan="11" className="text-center">
                <Spinner animation="border" size="lg" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </td>
            </tr>
          ) : offers?.length === 0 ? (
            <tr>
              <td colSpan="11" className="text-center">
                No offers found
              </td>
            </tr>
          ) : (
            offers?.map((offer, index) => {
              return (
                <tr key={offer?._id}>
                  <td>{index + 1}</td>
                  <td>{offer?.offerName}</td>
                  <td>{offer?.brand?.title || "N/A"}</td>
                  <td>{offer?.category?.title || "N/A"}</td>
                  <td>
                    {offer?.discountType === "percentage"
                      ? `${offer.discountValue}%`
                      : `₹${offer.discountValue}`}
                  </td>
                  <td>{offer?.minAmount ? `₹${offer.minAmount}` : "N/A"}</td>
                  <td>{offer?.maxAmount ? `₹${offer.maxAmount}` : "N/A"}</td>
                  <td>{moment(offer?.startDate).format("LLL")}</td>
                  <td>{moment(offer?.endDate).format("LLL")}</td>
                  <td
                    className={`fw-bold ${
                      offer?.status ? "text-success" : "text-danger"
                    }`}
                  >
                    {offer?.status ? "Active" : "Inactive"}
                  </td>
                  <td>
                    <div className="d-flex gap-3 justify-content-center">
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleEdit(offer)}
                      >
                        <MdEdit />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(offer?._id)}
                      >
                        <MdDelete />
                      </Button>
                      <Button
                        variant={offer?.status ? "secondary" : "success"}
                        size="sm"
                        onClick={() => handleStatus(offer)}
                      >
                        {offer?.status ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default OfferManagment;
