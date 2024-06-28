import { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { RxCrossCircled } from "react-icons/rx";
import {
  addProductService,
  deleteProductService,
  editProductService,
  fetchSingleProductService,
  fetchProductServiceList,
} from "../../../API/api";

export const ProductServices = () => {
  const [loading, setLoading] = useState(true);
  const [productServiceData, setProductServiceData] = useState([]);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [toEdit, setToEdit] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    status: true,
  });

  useEffect(() => {
    getProductServiceData();
  }, []);

  const getProductServiceData = async () => {
    setLoading(true);
    try {
      let res = await fetchProductServiceList();
      if (res?.status === 200) {
        setProductServiceData(res?.data?.data);
      } else {
        console.error(res?.data?.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this Product Service?"
    );
    if (!confirmation) {
      return;
    }
    try {
      const res = await deleteProductService(id);
      if (res?.status === 200) {
        toast.success("Product Service deleted successfully", {
          position: "bottom-right",
          theme: "colored",
        });
        getProductServiceData();
      } else {
        console.error(res?.data?.message);
        toast.error("Failed to delete Product Service", {
          position: "bottom-right",
          theme: "colored",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete Product Service", {
        position: "bottom-right",
        theme: "colored",
      });
    }
  };

  const handleEdit = (id) => async () => {
    setToEdit(id);
    setShowAddOptions(true);
    try {
      const res = await fetchSingleProductService(id);
      if (res?.status === 200) {
        const data = res?.data?.data;
        const { name, image, status } = data;
        setFormData({ name, image, status });
      } else {
        console.error(res?.data?.message);
        toast.error("Failed to fetch Product Service data", {
          position: "bottom-right",
          theme: "colored",
        });
        setToEdit(null);
        setShowAddOptions(false);
        return;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch Product Service data", {
        position: "bottom-right",
        theme: "colored",
      });
      setToEdit(null);
      setShowAddOptions(false);
      return;
    }
  };

  const handleEditComplete = async (e) => {
    e.preventDefault();

    if (formData?.name === "") {
      toast.error("Please fill all the fields", {
        position: "bottom-right",
        theme: "colored",
      });
      return;
    }

    try {
      const payload = {
        name: formData?.name,
        status: formData?.status,
        image: formData?.image,
      };

      const res = await editProductService(toEdit, payload);
      if (res?.status === 200) {
        toast.success("Product Service updated successfully", {
          position: "bottom-right",
          theme: "colored",
        });
        getProductServiceData();
        setToEdit(null);
        setShowAddOptions(false);
        setFormData({ name: "", image: "", status: true });
      } else {
        console.error(res?.data?.message);
        toast.error("Failed to update Product Service", {
          position: "bottom-right",
          theme: "colored",
        });
        setToEdit(null);
        setShowAddOptions(false);
        setFormData({ name: "", image: "", status: true });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update Product Service", {
        position: "bottom-right",
        theme: "colored",
      });
      setToEdit(null);
      setShowAddOptions(false);
      setFormData({ name: "", image: "", status: true });
    }
  };

  const handleAddProductService = async (e) => {
    e.preventDefault();

    if (formData?.name === "" || formData?.image === "") {
      toast.error("Please fill all the fields", {
        position: "bottom-right",
        theme: "colored",
      });
      return;
    }

    try {
      const payload = {
        name: formData?.name,
        status: formData?.status,
        image: formData?.image,
      };

      const res = await addProductService(payload);
      if (res?.status === 200) {
        toast.success("Product Service added successfully", {
          position: "bottom-right",
          theme: "colored",
        });
        getProductServiceData();
        setFormData({ name: "", image: "", status: true });
        setShowAddOptions(false);
      } else {
        console.error(res?.data?.message);
        toast.error("Failed to add Product Service", {
          position: "bottom-right",
          theme: "colored",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add Product Service", {
        position: "bottom-right",
        theme: "colored",
      });
    }
  };

  return (
    <>
      {loading && (
        <div className="productList p-4 contentLoader">
          <Row>
            <Col>
              <Spinner animation="border" size="lg" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </Col>
          </Row>
        </div>
      )}
      <div className="productList mt-2 p-4">
        <div className="ProductServicePageHeading">
          <h3>Product Services</h3>
        </div>
        <div
          className="productServiceAddBtn"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
            alignItems: "center",
          }}
        >
          <button
            className={`btn ${showAddOptions ? "btn-danger" : "btn-primary"}`}
            onClick={() => {
              if (toEdit) {
                setToEdit(null);
                setFormData({ name: "", image: "", status: true });
              }
              setShowAddOptions(!showAddOptions);
            }}
          >
            {showAddOptions ? "Cancel" : "Add Product Service"}
          </button>
        </div>
        {showAddOptions && (
          <div className="addProductService">
            <h5 className="text-center">
              {toEdit ? "Edit Product Service" : "Add Product Service"}
            </h5>
            <form>
              <div className="mb-2">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  value={formData?.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="form-control"
                  id="name"
                  placeholder="Enter Name"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  className="form-select"
                  id="status"
                  value={formData?.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
              <div className="mb-2">
                <label htmlFor="image" className="form-label">
                  Image URL
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="image"
                  value={formData?.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="Enter Image URL"
                />
              </div>
              {formData?.image.length > 0 && (
                <label
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <img
                    src={formData?.image}
                    alt="Selected file"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                  <span
                    onClick={() => {
                      setFormData({ ...formData, image: "" });
                    }}
                    style={{
                      cursor: "pointer",
                      fontSize: "1.5rem",
                      color: "red",
                    }}
                  >
                    <RxCrossCircled />
                  </span>
                </label>
              )}
              <div className="mb-2 d-flex justify-content-center">
                <button
                  type="submit"
                  onClick={
                    toEdit ? handleEditComplete : handleAddProductService
                  }
                  className="btn btn-primary"
                >
                  {toEdit ? "Edit Product Service" : "Add Product Service"}
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="productServiceList">
          <div className="row">
            {productServiceData?.map((item) => (
              <div
                key={item?._id}
                className="col-md-4 col-lg-3 col-sm-6 mb-4 productServiceCard"
              >
                <div className="card h-100">
                  <img
                    src={item?.image}
                    className="card-img-top"
                    alt="Product Service"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      margin: "auto",
                      paddingTop: "10px",
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{item?.name}</h5>
                    <p className="card-text">
                      Status: {item?.status ? "Active" : "Inactive"}
                    </p>
                    <div className="mt-auto">
                      <button
                        className="btn btn-primary me-2"
                        onClick={handleEdit(item?._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={handleDelete(item?._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
