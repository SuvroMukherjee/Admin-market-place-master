import { useEffect, useRef, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import {
  addTestimonial,
  deleteTestimonial,
  editTestimonial,
  fetchSingleTestimonial,
  fetchTestimonialList,
  FileUpload,
} from "../../API/api";
import { toast } from "react-toastify";
import { RxCrossCircled } from "react-icons/rx";

export const Testimonial = () => {
  const [loading, setLoading] = useState(true);
  const [testimonialData, setTestimonialData] = useState([]);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [toEdit, setToEdit] = useState(null);

  const fileInputRef = useRef(null);

  const [fromData, setFormData] = useState({
    name: "",
    productName: "",
    title: "",
    rating: "",
    img: "",
    description: "",
  });

  useEffect(() => {
    getTestimonialData();
  }, []);

  const getTestimonialData = async () => {
    setLoading(true);
    try {
      let res = await fetchTestimonialList();

      if (res?.status === 200) {
        setTestimonialData(res?.data?.data);
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
      "Are you sure you want to Delete This Testimonial?"
    );
    // Proceed only if the user confirms
    if (!confirmation) {
      return;
    }
    try {
      // Call API to delete the testimonial
      const res = await deleteTestimonial(id);
      if (res?.status === 200) {
        toast.success("Testimonial deleted successfully", {
          position: "bottom-right",
          theme: "colored",
        });
        getTestimonialData();
      } else {
        console.error(res?.data?.message);
        toast.error("Failed to delete testimonial", {
          position: "bottom-right",
          theme: "colored",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete testimonial", {
        position: "bottom-right",
        theme: "colored",
      });
    }
  };

  const handleEdit = (id) => async () => {
    setToEdit(id);
    setShowAddOptions(true);

    // Fetch the testimonial data to edit
    try {
      const res = await fetchSingleTestimonial(id);
      if (res?.status === 200) {
        // eslint-disable-next-line no-unsafe-optional-chaining
        const { name, productName, title, review, description } = res?.data?.data;
        setFormData({
          ...fromData,
          name,
          productName,
          title,
          rating: review,
          description,
        });
      } else {
        console.error(res?.data?.message);
        toast.error("Failed to fetch testimonial data", {
          position: "bottom-right",
          theme: "colored",
        });
        setToEdit(null);
        setShowAddOptions(false);
        return;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch testimonial data", {
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

    if (
      fromData?.name === "" ||
      fromData?.productName === "" ||
      fromData?.title === "" ||
      fromData?.rating === "" ||
      fromData?.description === ""
    ) {
      toast.error("Please fill all the fields", {
        position: "bottom-right",
        theme: "colored",
      });
      return;
    }

    try {
      // Call API to update the testimonial
      const payload = {
        name: fromData?.name,
        productName: fromData?.productName,
        title: fromData?.title,
        review: fromData?.rating,
        description: fromData?.description,
      };
      if (fromData?.img.length > 0) {
        payload.img = fromData?.img;
      }

      const res = await editTestimonial(toEdit, payload);
      if (res?.status === 200) {
        toast.success("Testimonial updated successfully", {
          position: "bottom-right",
          theme: "colored",
        });
        getTestimonialData();
        setToEdit(null);
        setShowAddOptions(false);
        setFormData({
          name: "",
          productName: "",
          title: "",
          rating: "",
          img: "",
        });
      } else {
        console.error(res?.data?.message);
        toast.error("Failed to update testimonial", {
          position: "bottom-right",
          theme: "colored",
        });
        setToEdit(null);
        setShowAddOptions(false);
        setFormData({
          name: "",
          productName: "",
          title: "",
          rating: "",
          img: "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update testimonial", {
        position: "bottom-right",
        theme: "colored",
      });
      setToEdit(null);
      setShowAddOptions(false);
      setFormData({
        name: "",
        productName: "",
        title: "",
        rating: "",
        img: "",
      });
    }
  };

  const handleAddTestimonial = async (e) => {
    e.preventDefault();

    if (
      fromData?.name === "" ||
      fromData?.productName === "" ||
      fromData?.title === "" ||
      fromData?.rating === "" ||
      fromData?.description === "" ||
      fromData?.img === ""
    ) {
      toast.error("Please fill all the fields", {
        position: "bottom-right",
        theme: "colored",
      });
      return;
    }

    try {
      const payload = {
        name: fromData?.name,
        productName: fromData?.productName,
        title: fromData?.title,
        review: fromData?.rating,
        description: fromData?.description,
        img: fromData?.img,
      };

      const res = await addTestimonial(payload);
      if (res?.status === 200) {
        toast.success("Testimonial added successfully", {
          position: "bottom-right",
          theme: "colored",
        });
        getTestimonialData();
        setFormData({
          name: "",
          productName: "",
          title: "",
          rating: "",
          img: "",
        });
        setShowAddOptions(false);
      } else {
        console.error(res?.data?.message);
        toast.error("Failed to add testimonial", {
          position: "bottom-right",
          theme: "colored",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add testimonial", {
        position: "bottom-right",
        theme: "colored",
      });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const onFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await FileUpload(formData);

      setTimeout(() => {
        setFormData({ ...fromData, img: res?.data?.data?.fileurl });
      }, 500);
    } catch (err) {
      console.error(err, "err");
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
        <div className="TestimonialPageHeading">
          <h3>Testimonials</h3>
        </div>
        <div
          className="testimonialAddBtn"
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
                setFormData({
                  name: "",
                  productName: "",
                  title: "",
                  rating: "",
                  img: "",
                });
              }
              setShowAddOptions(!showAddOptions);
            }}
          >
            {showAddOptions ? "Cancel" : "Add Testimonial"}
          </button>
        </div>
        {showAddOptions && (
          <div className="addTestimonial">
            <h5 className="text-center">
              {toEdit ? "Edit Testimonial" : "Add Testimonial"}
            </h5>
            <form>
              <div className="mb-2">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  value={fromData?.name}
                  onChange={(e) =>
                    setFormData({ ...fromData, name: e.target.value })
                  }
                  className="form-control"
                  id="name"
                  placeholder="Enter Name"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="name" className="form-label">
                  Product Name
                </label>
                <input
                  type="text"
                  value={fromData?.productName}
                  onChange={(e) =>
                    setFormData({ ...fromData, productName: e.target.value })
                  }
                  className="form-control"
                  id="productName"
                  placeholder="Enter Product Name"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="name" className="form-label">
                  Testimonial Title
                </label>
                <input
                  type="text"
                  value={fromData?.title}
                  onChange={(e) =>
                    setFormData({ ...fromData, title: e.target.value })
                  }
                  className="form-control"
                  id="title"
                  placeholder="Enter Title"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="name" className="form-label">
                  Rating
                </label>
                {/* select  */}
                <select
                  className="form-select"
                  id="rating"
                  value={fromData?.rating}
                  onChange={(e) =>
                    setFormData({ ...fromData, rating: e.target.value })
                  }
                >
                  <option disabled>Choose Rating...</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
              <div className="mb-2">
                <label htmlFor="name" className="form-label">
                  Image
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
              {fromData?.img.length > 0 && (
                <label
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span>1 image Selected</span>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setFormData({ ...fromData, img: "" });
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    <RxCrossCircled color="red" />
                  </span>
                </label>
              )}
              <div className="mb-2">
                <label htmlFor="testimonial" className="form-label">
                  Testimonial Description
                </label>
                <textarea
                  value={fromData?.description}
                  onChange={(e) =>
                    setFormData({ ...fromData, description: e.target.value })
                  }
                  className="form-control"
                  id="description"
                  rows="3"
                  placeholder="Enter Testimonial"
                ></textarea>
              </div>
              {toEdit ? (
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleEditComplete}
                >
                  Update Testimonial
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleAddTestimonial}
                >
                  Add Testimonial
                </button>
              )}
            </form>
          </div>
        )}
        <div className="testimonialList">
          <h5 className="text-center">Testimonial List</h5>
          {/* table */}
          <table
            className="table table-striped"
            style={{
              border: "1px solid #dee2e6",
              margin: "20px 0",
              maxHeight: "400px",
              overflowY: "scroll",
            }}
          >
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Product</th>
                <th scope="col">Title</th>
                <th scope="col">Rating</th>
                <th scope="col">Image</th>
                <th scope="col">Description</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {testimonialData.length > 0 &&
                testimonialData.map((item, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{item?.name}</td>
                    <td>{item?.productName}</td>
                    <td>{item?.title}</td>
                    <td>{item?.review}</td>
                    <td>
                      <img
                        src={item?.img}
                        alt={item?.name}
                        style={{
                          borderRadius: "50%",
                        }}
                        width="50"
                      />
                    </td>
                    <td>{item?.description}</td>
                    <td>
                      {toEdit === item?._id ? (
                        <button
                          className="btn btn-danger btn-sm m-1"
                          onClick={() => {
                            setToEdit(null);
                            setShowAddOptions(false);
                            setFormData({
                              name: "",
                              productName: "",
                              title: "",
                              rating: "",
                              img: "",
                            });
                          }}
                        >
                          Cancel
                        </button>
                      ) : (
                        <>
                          <button
                            className="btn btn-primary btn-sm m-1"
                            onClick={handleEdit(item?._id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm m-1"
                            onClick={handleDelete(item?._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              {!testimonialData.length && (
                <tr>
                  <td colSpan="7" className="text-center">
                    No Testimonials Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
