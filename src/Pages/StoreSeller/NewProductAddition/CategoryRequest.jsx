import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import toast, { Toaster } from "react-hot-toast";
import { FaList } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { AddProductCategory, FileUpload } from "../../../API/api";
import { IoArrowBackCircle } from "react-icons/io5";

const CategoryRequest = () => {
  const [modalData, setModalData] = useState();
  const [loading, setLoading] = useState(false);
  const [subloading, setSubLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    console.log("Selected option:", event.target.value);
    setModalData({ ...modalData, ["seller_type"]: event.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log({ modalData });

    let res = await AddProductCategory(modalData);

    if (res?.response?.data?.error) {
      toast.error(res?.response?.data?.message);
    } else {
      toast.success("Category Request sent Successfully");

      setTimeout(() => {
        navigate("/seller/approval-request-list?tabtype=category");
      }, 2000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name == "email") {
      setModalData({
        ...modalData,
        ["seller_contc_info"]: {
          ...modalData?.seller_contc_info,
          [name]: value,
        },
      });
    } else if (name == "phone_no") {
      setModalData({
        ...modalData,
        ["seller_contc_info"]: {
          ...modalData?.seller_contc_info,
          [name]: value,
        },
      });
    } else {
      setModalData({ ...modalData, [name]: value });
    }
  };

  const handleFileChange = async (e, type) => {
    onFileUpload(e.target.files[0], type);
  };

  const onFileUpload = async (data, type) => {
    const formData = new FormData();
    formData.append("file", data);
    await FileUpload(formData)
      .then((res) => {
        console.log(res, "res");
        if (type == "1") {
          setLoading(false);
          setTimeout(() => {
            setModalData({
              ...modalData,
              ["image"]: { image_path: res?.data?.data?.fileurl },
            });
          }, 300);
        } else {
          setSubLoading(false);
          setTimeout(() => {
            setModalData({
              ...modalData,
              ["img"]: { image_path: res?.data?.data?.fileurl },
            });
          }, 300);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange2 = (e, type) => {
    setUploading(true);
    onFileUpload2(e.target.files[0], type);
  };

  const onFileUpload2 = async (data, type) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", data);
    await FileUpload(formData)
      .then((res) => {
        console.log(res, "res");
        if (type == "distributer") {
          setUploading(false);
          setTimeout(() => {
            setModalData({
              ...modalData,
              ["seller_doc"]: {
                ...modalData?.seller_doc,
                doc: type,
                doc_file: res?.data?.data?.fileurl,
              },
            });
          }, 300);
        } else {
          setUploading(false);
          setTimeout(() => {
            setModalData({
              ...modalData,
              ["seller_doc"]: {
                ...modalData?.seller_doc,
                doc: type,
                doc_file: res?.data?.data?.fileurl,
              },
            });
          }, 300);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  const handleOptionInput = (value, type) => {
    setModalData({
      ...modalData,
      ["seller_doc"]: { ...modalData?.seller_doc, comment: value },
    });
  };

  return (
    <div>
      <Container>
        <Row
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
          <Col style={{ flex: "1" }}>
            <Button
              size="sm"
              variant="outline-dark"
              onClick={() => navigate("/seller/seller-request")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <IoArrowBackCircle size={20} />
              <span>Back</span>
            </Button>
          </Col>
          <Col style={{ flex: "2", textAlign: "center" }}>
            <h4>Application for New Category Listing</h4>
          </Col>
          <Col style={{ flex: "1", textAlign: "right" }}>
            <Button
              size="sm"
              variant="outline-dark"
              onClick={() => navigate("/seller/approval-request-list")}
            >
              <span className="mx-1">
                <FaList />
              </span>
              View All Applications
            </Button>
          </Col>
        </Row>

        <Form onSubmit={handleSubmit}>
          <Row className="mt-2">
            <Col className="p-4">
              <Row className="stepContent">
                {/* <Form onSubmit={handleSubmit}> */}
                <Row className="mt-2">
                  <Col xs={12}>
                    <Form.Group controlId="title">
                      <Form.Label>
                        <span className="req">*</span> Category Title
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="tapG"
                        placeholder="Enter Category Title"
                        name="title"
                        size="sm"
                        value={modalData?.title}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Form.Group controlId="image">
                    <Col xs={12}>
                      <Form.Group controlId="title">
                        <Form.Label>
                          <span className="req">*</span> Category Image
                          {modalData?.image?.image_path ? (
                            <a
                              href={modalData?.image?.image_path}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <span className="mx-4">SHOW IMAGE</span>
                            </a>
                          ) : (
                            <>
                              {" "}
                              {loading && (
                                <Spinner
                                  className="ms-2"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                >
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </Spinner>
                              )}
                            </>
                          )}
                        </Form.Label>
                        <Form.Control
                          type="file"
                          className="tapG"
                          placeholder="Upload Category Image"
                          name="image"
                          size="sm"
                          required
                          // value={modalData?.image}
                          onChange={(e) => {
                            setLoading(true);
                            handleFileChange(e, "1");
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Form.Group>
                </Row>

                <Row className="mt-2">
                  <Col xs={12}>
                    <Form.Group controlId="title">
                      <Form.Label>
                        <span className="req">*</span> Subcategory Title
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="tapG"
                        placeholder="Enter Subcategory Title"
                        name="subtitle"
                        size="sm"
                        value={modalData?.subtitle}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Form.Group controlId="image">
                    <Col xs={12}>
                      <Form.Group controlId="title">
                        <Form.Label>
                          <span className="req">*</span> SubCategory Image
                          {modalData?.img?.image_path ? (
                            <a
                              href={modalData?.img?.image_path}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <span className="mx-4">SHOW IMAGE</span>
                            </a>
                          ) : (
                            <>
                              {" "}
                              {subloading && (
                                <Spinner
                                  className="ms-2"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                >
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </Spinner>
                              )}
                            </>
                          )}
                        </Form.Label>
                        <Form.Control
                          type="file"
                          className="tapG"
                          placeholder="Upload Category Image"
                          name="img"
                          size="sm"
                          // value={modalData?.image}
                          onChange={(e) => {
                            setSubLoading(true);
                            handleFileChange(e, "2");
                          }}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Form.Group>
                </Row>
              </Row>
            </Col>

            <Col className="mt-4 stepContent">
              <Row>
                <Col>
                  {" "}
                  <h5>Tell us about your products and business</h5>
                </Col>
              </Row>
              <Row>
                <Col xs={12} className="mt-2 infotext">
                  <span className="req">*</span> Are you a reseller/distributor
                  or a manufacturer of your products?
                </Col>
                <div className="mt-2">
                  <Col xs={6} className="infotext2">
                    <Form.Group>
                      <Form.Check
                        type="radio"
                        id="reseller"
                        name="sellertype"
                        label="Reseller/Distributor"
                        value="distributer"
                        checked={selectedOption === "distributer"}
                        onChange={handleOptionChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6} className="infotext2">
                    <Form.Group>
                      <Form.Check
                        type="radio"
                        id="manufacturer"
                        label="Manufacturer"
                        name="sellertype"
                        value="manufracturer"
                        checked={selectedOption === "manufracturer"}
                        onChange={handleOptionChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </div>
              </Row>

              {selectedOption == "distributer" && (
                <div className="mt-4">
                  <Row>
                    <Col>
                      <h5>Share Documents</h5>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="mt-2 infotext">
                      At least 1 purchase invoice for products from a
                      manufacturer or distributor
                    </Col>
                  </Row>
                  <Row className="mt-2 text-center p-4">
                    <Col>
                      {modalData?.seller_doc?.doc == "distributer" && (
                        <span>
                          {modalData?.seller_doc?.doc_file ? (
                            <a
                              href={modalData?.seller_doc?.doc_file}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <span className="mx-4 fw-bold">SHOW FILE</span>
                            </a>
                          ) : (
                            <>
                              {" "}
                              {uploading && (
                                <Spinner
                                  className="ms-2"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                >
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </Spinner>
                              )}
                            </>
                          )}
                        </span>
                      )}
                    </Col>
                    <Col xs={12}>
                      <div className="upback">
                        <input
                          type="file"
                          id="fileInput"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            handleFileChange2(e, "distributer");
                          }}
                          
                        />
                        <label htmlFor="fileInput">
                          <Button
                            variant="secondary"
                            className="w-100"
                            size="sm"
                            as="span"
                          >
                            Upload File
                          </Button>
                        </label>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12}>
                      <Form.Group controlId="title">
                        <Form.Label>Optional Comments</Form.Label>
                        <Form.Control
                          type="phone"
                          className="tapG"
                          placeholder="Add Comments..."
                          name="phone"
                          size="sm"
                          onChange={(e) =>
                            handleOptionInput(e?.target?.value, "distributer")
                          }
                          // value={modalData?.subtitle}
                          // onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              )}

              {selectedOption == "manufracturer" && (
                <div className="mt-4">
                  <Row>
                    <Col>
                      <h5>Share Documents</h5>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="mt-2 infotext">
                      Upload file for {modalData?.title} Manufacturing License
                    </Col>
                  </Row>
                  <Row className="mt-2 text-center p-4">
                    <Col>
                      {modalData?.seller_doc?.doc == "manufracturer" && (
                        <span>
                          {modalData?.seller_doc?.doc_file ? (
                            <a
                              href={modalData?.seller_doc?.doc_file}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <span className="mx-4 fw-bold">SHOW FILE</span>
                            </a>
                          ) : (
                            <>
                              {" "}
                              {uploading && (
                                <Spinner
                                  className="ms-2"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                >
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </Spinner>
                              )}
                            </>
                          )}
                        </span>
                      )}
                    </Col>
                    <Col xs={12}>
                      <div className="upback">
                        <input
                          type="file"
                          id="fileInput"
                          style={{ display: "none" }}
                          
                          onChange={(e) => {
                            setUploading(true);
                            handleFileChange2(e, "manufracturer");
                          }}
                        />
                        <label htmlFor="fileInput">
                          <Button
                            variant="secondary"
                            className="w-100"
                            size="sm"
                            as="span"
                          >
                            Upload File
                          </Button>
                        </label>
                        {selectedFile && (
                          <p>Selected file: {selectedFile.name}</p>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12}>
                      <Form.Group controlId="title">
                        <Form.Label>Optional Comments</Form.Label>
                        <Form.Control
                          type="phone"
                          className="tapG"
                          placeholder="Add Comments..."
                          name="phone"
                          size="sm"
                          // value={modalData?.subtitle}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              )}

              <Row className="mt-4">
                <Col>
                  {" "}
                  <h5>Provide your contact information</h5>
                </Col>
              </Row>

              <Row className="mt-2">
                <Col xs={12}>
                  <Form.Group controlId="title">
                    <Form.Label>
                      <span className="req">*</span> Alternate Email to contact
                      you for questions
                    </Form.Label>
                    <Form.Control
                      type="email"
                      className="tapG"
                      placeholder="Enter Email..."
                      name="email"
                      size="sm"
                      required
                      // value={modalData?.subtitle}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12}>
                  <Form.Group controlId="title">
                    <Form.Label>
                      <span className="req">*</span> Alternate Phone to call you
                      for query
                    </Form.Label>
                    <Form.Control
                      type="phone"
                      className="tapG"
                      placeholder="Enter Phone..."
                      name="phone_no"
                      size="sm"
                      required
                      // value={modalData?.subtitle}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-4 mb-4 bgColor stepContent">
            <Col xs={6} className="d-flex align-items-center aggree">
              By clicking on Agree and Submit, I agree to the conditions.
            </Col>
            <Col className="d-flex justify-content-center">
              <Button
                className="btn-block mr-1 mt-1 btn-lg"
                variant="warning"
                size="sm"
                type="submit"
                block
              >
                Agree & Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
      <Toaster position="top-right" />
    </div>
  );
};

export default CategoryRequest;
