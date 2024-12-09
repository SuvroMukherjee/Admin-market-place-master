import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Table, Spinner, Alert } from "react-bootstrap";
import {
  createHelpDesk,
  getAllHelpDeskList,
  getHelpDeskById,
  updateHelpDeskById,
  deleteHelpDeskById,
} from "../../API/api";
import axios from "axios";

const HelpDesk = () => {
  const [helpDeskList, setHelpDeskList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "video",
    module: "all",
    url: "",
  });
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch the HelpDesk list
  const fetchHelpDeskList = async () => {
    try {
      const response = await getAllHelpDeskList();
      console.log(response?.data);
      setHelpDeskList(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch HelpDesk list:", error);
    }
  };

  useEffect(() => {
    fetchHelpDeskList();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
          "https://zoofi-e74e830479a2.herokuapp.com/api/file/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setFormData((prevData) => ({
          ...prevData,
          url: response.data.data.fileurl,
        }));
      } catch (error) {
        console.error("File upload failed:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.url) newErrors.url = "File is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (isEdit) {
        await updateHelpDeskById(currentId, formData);
        setSuccessMessage("HelpDesk entry updated successfully!");
      } else {
        await createHelpDesk(formData);
        setSuccessMessage("HelpDesk entry created successfully!");
      }
      setShowModal(false);
      fetchHelpDeskList();
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  // Open modal for editing
  const handleEdit = async (id) => {
    try {
      const response = await getHelpDeskById(id);
      setFormData(response.data);
      setCurrentId(id);
      setIsEdit(true);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to fetch HelpDesk details:", error);
    }
  };

  // Handle deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteHelpDeskById(id);
        setSuccessMessage("HelpDesk entry deleted successfully!");
        fetchHelpDeskList();
      } catch (error) {
        console.error("Deletion failed:", error);
      }
    }
  };

  return (
    <div className="productList p-4 mt-4">
      <div className="container mt-4">
        <h4>HelpDesk Management</h4>
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Create HelpDesk Entry
        </Button>

        {/* Table to display HelpDesk entries */}
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Type</th>
              <th>File</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {helpDeskList.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.type}</td>
                <td style={{ width: "200px" }}>
                  {item.type === "video" ? (
                    <video width="200" controls>
                      <source src={item?.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <>
                      <img src={item?.url} alt={item?.title} width="100" />
                    </>
                  )}
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(item?._id)}
                    className="mb-2"
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(item?._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal for Create/Update */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {isEdit ? "Edit HelpDesk" : "Create HelpDesk"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData?.title}
                  onChange={handleChange}
                  isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData?.description}
                  onChange={handleChange}
                  isInvalid={!!errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  name="type"
                  value={formData?.type}
                  onChange={handleChange}
                  isInvalid={!!errors?.type}
                >
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors?.type}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Upload File</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileUpload}
                  isInvalid={!!errors?.url}
                />
                {uploading && <Spinner animation="border" size="sm" />}
                {formData?.url && (
                  <div>
                    <a
                      href={formData?.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover-underline"
                    >
                      View Uploaded File
                    </a>
                  </div>
                )}
                <Form.Control.Feedback type="invalid">
                  {errors.url}
                </Form.Control.Feedback>
              </Form.Group>

              <Button variant="primary" type="submit" disabled={uploading}>
                {isEdit ? "Update" : "Create"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default HelpDesk;
