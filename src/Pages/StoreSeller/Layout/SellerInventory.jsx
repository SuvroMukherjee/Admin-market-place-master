import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  GetAllServices,
  UpdateSellerProduct,
  getSearcKeyword,
} from "../../../API/api";
import "./sellerlayout.css";
import SellerStock from "./SellerStock";

export default function SellerInventory() {
  return (
    <div>
      <div
        className="px-4 py-4"
        style={{ backgroundColor: "#e5faca", minHeight: "100vh" }}
      >
        <SellerStock />
      </div>
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
  const [loading, setLoading] = useState(false); // Track loading state

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
    setLoading(true); // Set loading to true when API call starts
    try {
      const response = await getSearcKeyword(modalData?._id);

      console.log(response);

      setModalData((prevData) => ({
        ...prevData,
        search_key: prevData?.search_key + response?.data?.data,
      }));
    } catch (error) {
      console.error("Error fetching search keyword:", error);
    } finally {
      setLoading(false); // Set loading to false when API call finishes
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
            <Form.Label>Search Keys</Form.Label>
            {loading ? (
              // Show Skeleton loader while the API is fetching
              <div>
                <Skeleton count={5} height={40} baseColor="#e0e0e0" />
              </div>
            ) : (
              <Form.Control
                as="textarea"
                placeholder="Enter Search Term"
                onChange={(e) =>
                  setModalData({ ...modalData, search_key: e.target.value })
                }
                value={modalData?.search_key}
                rows={10}
              />
            )}
          </Form.Group>
        </Form>
        <div className="d-flex justify-content-center">
          {!loading && (
            <button className="glow-button" onClick={getKeyword}>
              <span className="icon">✨</span>
              Modify with AI
            </button>
          )}
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
