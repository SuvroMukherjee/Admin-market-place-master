import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { SlCalender } from "react-icons/sl";
import { useNavigate, useParams } from "react-router-dom";
import {
  GetProductDetails,
  offerCreate,
  offerTypeCreate,
  offerTypeDelete,
  offerTypeList,
  sellerProductDeatils,
} from "../../../API/api";
import { ChangeFormatDate2 } from "../../../common/DateFormat";
import useAuth from "../../../hooks/useAuth";
import "../product.css";
import { FaRegTrashAlt } from "react-icons/fa";

const Offer = () => {
  const [formData, setFormData] = useState();

  const [type, setType] = useState();
  const [offerslists, setofferlists] = useState([]);

  const [offers, setOffers] = useState([]);

  const { id: productId } = useParams();

  const { auth } = useAuth();

  const navigate = useNavigate();

  const [productData, setProductData] = useState();

  useEffect(() => {
    getProductdata();
    getOfferTypeLists();
  }, []);

  async function getProductdata() {
    let res = await GetProductDetails(productId);
    console.log(res?.data?.data, "data");
    setProductData(res?.data?.data);
    //setProductData(res?.data?.data?.)
    // setFormData(res?.data?.data)
  }

  {
    /** */
  }

  // console.log({ productData });

  async function getOfferTypeLists() {
    let res = await offerTypeList();
    console.log(res?.data?.data);
    setofferlists(res?.data?.data);
    getProductdata();
  }

  const createOfferTypeHandler = async () => {
    // Trim whitespace and validate the input
    const trimmedType = type.trim();
    if (!trimmedType) {
      alert("Please fill offer type");
      return;
    }

    try {
      let res = await offerTypeCreate({ offer_type_name: trimmedType });
      if (!res?.data?.error) {
        toast.success(res?.data?.message);
      } else {
        toast.error(res?.data?.message);
      }
      setType(""); // Reset the input field
      getOfferTypeLists(); // Refresh the list
    } catch (error) {
      toast.error("An error occurred while creating the offer type.");
    }
  };

  const handleTypeChange = (event) => {
    console.log(event.target.value);
    setFormData((prevData) => ({
      ...prevData,
      ["offerId"]: event.target.value,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prevFormData) => ({
        ...prevFormData,
        [parent]: {
          ...prevFormData[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const submitForm = async () => {
    formData["productId"] = productId;
    console.log({ formData });

    let res = await offerCreate(formData);

    console.log(res?.data?.data, "data");
    getOfferTypeLists();
    getProductdata();
    setFormData({});
  };

  {
    /** */
  }

  // const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData((prevData) => ({
  //         ...prevData,
  //         [name]: value,
  //     }));
  // };

  function createMarkup(val) {
    return { __html: val };
  }

  const handleSubmit = async () => {
    formData["sellerId"] = auth?.userId;
    formData["productId"] = productId;

    console.log({ formData });

    const res = await offerCreate(formData);

    if (res?.response?.data?.error) {
      toast.error(res?.response?.data?.message);
    } else {
      toast.success(`${formData?.offerId?.length} Offers Added successfully`);
      // setTimeout(() => {
      //     navigate(`/seller/seller-ownproduct-status/new-variations/${res?.data?.data?._id}`)
      // }, 1500);
      getProductdata();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      console.log(event.target.value);

      // setFormData((prevData) => ({
      //     ...prevData,
      //     offerId: [...prevData.offerId, id],
      // }));

      setOffers([...offers, { offer_type_name: event.target.value }]);
    }
  };

  const getOfferId = (id) => {
    setFormData((prevData) => ({
      ...prevData,
      offerId: [...(prevData?.offerId || []), id],
    }));
  };

  const handleDelete = async (id) => {
    let res = await offerTypeDelete(id);

    if (res?.response?.data?.error) {
      toast.error(res?.response?.data?.message);
    } else {
      toast.success(`${id} Deleted successfully`);
      getOfferTypeLists();
    }
  };

  return (
    <div className="newProduct mt-4">
      <Container>
        <Row className="m-4 p-4 justify-content-md-center stepContent paddingConatiner">
          <Col xs={12}>Create Your Offer Type</Col>
          <Col className="mt-2">
            <Form.Control
              type="text"
              name="offer_type"
              className="tapG"
              placeholder="Enter Offer Type"
              size="sm"
              value={type}
              onChange={(e) => setType(e.target.value)}
              autoComplete="off"
            />
          </Col>
          <Col className="d-flex justify-content-start align-items-center">
            <Button
              variant="dark"
              size="sm"
              onClick={() => createOfferTypeHandler()}
            >
              Create
            </Button>
          </Col>
        </Row>
      </Container>
      <Container className="mt-4">
        <Row className="m-2 p-2 justify-content-md-center stepContent">
          <Col>
            {/* <Row className="mt-3">
              <Col xs={12}>
                <Form.Group controlId="user_name">
                  <Row>
                    <Col
                      xs={3}
                      className="d-flex align-items-center justify-content-end"
                    >
                      <Form.Label className="frmLable">HSN Code</Form.Label>
                    </Col>
                    <Col xs={8}>
                      <Form.Control
                        type="text"
                        name="hsn_code"
                        className="tapG"
                        placeholder="Enter Product HSN Code"
                        size="sm"
                        value={formData?.hsn_code}
                        onChange={handleChange}
                        autoComplete="off"
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row> */}

            <Row className="mt-3">
              <Col xs={12}>
                <Form.Group controlId="user_name">
                  <Row>
                    <Col
                      xs={3}
                      className="d-flex align-items-center justify-content-end"
                    >
                      <Form.Label className="frmLable">Product-ID</Form.Label>
                    </Col>
                    <Col xs={8}>
                      <Form.Control
                        type="text"
                        name="hsn_code"
                        className="tapG"
                        placeholder="Enter Product HSN Code"
                        size="sm"
                        value={productData?.ProductData?.productId}
                        disabled
                        autoComplete="off"
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12}>
                <Form.Group controlId="product_name">
                  <Row>
                    <Col
                      xs={3}
                      className="d-flex align-items-center justify-content-end"
                    >
                      <Form.Label className="frmLable">Product-Name</Form.Label>
                    </Col>
                    <Col xs={8}>
                      <Form.Control
                        type="text"
                        name="product"
                        className="tapG"
                        placeholder="Enter Product Name"
                        size="sm"
                        value={productData?.ProductData?.name}
                        disabled
                        autoComplete="off"
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={12}>
                <Form.Group controlId="user_name">
                  <Row>
                    <Col
                      xs={3}
                      className="d-flex align-items-center justify-content-end"
                    >
                      <Form.Label className="frmLable">
                        {" "}
                        <span className="req mx-1">*</span>Offer Type
                      </Form.Label>
                    </Col>
                    <Col xs={8}>
                      <Form.Control
                        as="select"
                        name="type"
                        className="tapG"
                        size="sm"
                        // value={selectedType}
                        onChange={handleTypeChange}
                      >
                        <option value="">Select Offer Type</option>
                        {offerslists?.length > 0 &&
                          offerslists?.map((ele) => (
                            <option key={ele?._id} value={ele?._id}>
                              {ele?.offer_type_name}
                            </option>
                          ))}
                      </Form.Control>
                      <Form.Text>
                        {offerslists?.length} offers available
                      </Form.Text>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>

            {formData?.offerId && (
              <>
                <Row className="mt-3">
                  <Col xs={12}>
                    <Form.Group controlId="user_name">
                      <Row>
                        <Col
                          xs={3}
                          className="d-flex align-items-center justify-content-end"
                        >
                          <Form.Label className="frmLable">
                            <span className="req mx-1">*</span>Discount
                          </Form.Label>
                        </Col>
                        <Col xs={8}>
                          <Form.Control
                            type="text"
                            name="discount_percentage"
                            className="tapG"
                            placeholder="Enter discount percentage in %"
                            size="sm"
                            value={formData?.discount_percentage}
                            onChange={handleChange}
                            autoComplete="off"
                            required
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col xs={12}>
                    <Form.Group controlId="user_name">
                      <Row>
                        <Col
                          xs={3}
                          className="d-flex align-items-center justify-content-end"
                        >
                          <Form.Label className="frmLable">
                            <span className="req mx-1">*</span>Bank
                          </Form.Label>
                        </Col>
                        <Col xs={8}>
                          <Form.Control
                            type="text"
                            name="offer_on.bank_name"
                            className="tapG"
                            placeholder="Enter Bank Name"
                            size="sm"
                            value={formData?.offer_on?.bank_name}
                            onChange={handleChange}
                            autoComplete="off"
                            required
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col xs={12}>
                    <Form.Group controlId="user_name">
                      <Row>
                        <Col
                          xs={3}
                          className="d-flex align-items-center justify-content-end"
                        >
                          <Form.Label className="frmLable">
                            <span className="req mx-1">*</span>Card Type
                          </Form.Label>
                        </Col>
                        <Col xs={8}>
                          <Form.Control
                            type="text"
                            name="offer_on.card_type"
                            className="tapG"
                            placeholder="Enter Card Name"
                            size="sm"
                            value={formData?.offer_on?.card_type}
                            onChange={handleChange}
                            autoComplete="off"
                            required
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col xs={12}>
                    <Form.Group controlId="user_name">
                      <Row>
                        <Col
                          xs={3}
                          className="d-flex align-items-center justify-content-end"
                        >
                          <Form.Label className="frmLable">
                            <span className="req mx-1">*</span>Max Amount
                          </Form.Label>
                        </Col>
                        <Col xs={8}>
                          <Form.Control
                            type="number"
                            className="tapG"
                            name="max_amount"
                            value={formData.max_amount}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col xs={12}>
                    <Form.Group controlId="user_name">
                      <Row>
                        <Col
                          xs={3}
                          className="d-flex align-items-center justify-content-end"
                        >
                          <Form.Label className="frmLable">
                            <span className="req mx-1">*</span>Min Amount
                          </Form.Label>
                        </Col>
                        <Col xs={8}>
                          <Form.Control
                            type="number"
                            className="tapG"
                            name="min_amount"
                            value={formData.min_amount}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col xs={12}>
                    <Form.Group controlId="user_name">
                      <Row>
                        <Col
                          xs={3}
                          className="d-flex align-items-center justify-content-end"
                        >
                          <Form.Label className="frmLable">
                            <span className="req mx-1">*</span>Offer Start Date
                          </Form.Label>
                        </Col>
                        <Col xs={8}>
                          <Form.Control
                            type="date"
                            className="tapG"
                            name="offer_start_date"
                            value={formData.offer_start_date}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col xs={12}>
                    <Form.Group controlId="user_name">
                      <Row>
                        <Col
                          xs={3}
                          className="d-flex align-items-center justify-content-end"
                        >
                          <Form.Label className="frmLable">
                            <span className="req mx-1">*</span>Offer End Date
                          </Form.Label>
                        </Col>
                        <Col xs={8}>
                          <Form.Control
                            type="date"
                            className="tapG"
                            name="offer_end_date"
                            value={formData.offer_end_date}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col xs={12}>
                    <Form.Group controlId="user_name">
                      <Row>
                        <Col
                          xs={3}
                          className="d-flex align-items-center justify-content-end"
                        >
                          <Form.Label className="frmLable">
                            <span className="req mx-1">*</span>Terms and
                            Conditions
                          </Form.Label>
                        </Col>
                        <Col xs={8}>
                          <Form.Control
                            as="textarea"
                            className="tapG"
                            name="terms_cond"
                            value={formData.terms_cond}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}
          </Col>

          <Col xs={4} className="">
            <Row>
              <Col className="text-center specHeader2">Current Offers</Col>
            </Row>

            <Row className="mt-2">
              {productData?.OfferData?.length === 0 && (
                <Col className="text-center">
                  <span className="specText2">No Offers Available</span>
                </Col>
              )}
            </Row>

            <Row>
              {productData?.OfferData?.map((ele, index) => (
                // <Col xs={10} key={index}>
                //   <div className="specText2Rest">
                //     <span className="specText2">
                //       {ele?.offerId?.offer_type_name}
                //     </span>{" "}
                //     offer {ele?.discount_percentage}% discount on{" "}
                //     {ele?.offer_on?.bank_name}-{ele?.offer_on?.card_type} Card
                //   </div>
                //   <div className="specTextsmall">
                //     <span className="mx-1">
                //       <SlCalender size={12} />
                //     </span>
                //     {ChangeFormatDate2(ele?.offer_start_date)} -{" "}
                //     <span className="mx-1">
                //       <SlCalender size={12} />
                //     </span>
                //     {ChangeFormatDate2(ele?.offer_end_date)}
                //   </div>
                // </Col>
                // <Col xs={2}>
                //   <FaRegTrashAlt size={20} />
                // </Col>

                // <hr />

                <Col xs={12} key={index} style={{ background: "#f5f5f5" }}>
                  <Row className="mt-2 d-flex justify-content-between items-center p-2">
                    <Col xs={10}>
                      <div className="specText2Rest">
                        <span className="specText2">
                          {ele?.offerId?.offer_type_name}
                        </span>{" "}
                        offer {ele?.discount_percentage}% discount on{" "}
                        {ele?.offer_on?.bank_name}-{ele?.offer_on?.card_type}{" "}
                        Card
                      </div>
                      <div className="specTextsmall">
                        <span className="mx-1">
                          <SlCalender size={12} />
                        </span>
                        {ChangeFormatDate2(ele?.offer_start_date)} -{" "}
                        <span className="mx-1">
                          <SlCalender size={12} />
                        </span>
                        {ChangeFormatDate2(ele?.offer_end_date)}
                      </div>
                    </Col>
                    <Col
                      xs={2}
                      className="d-flex justify-content-center align-items-center "
                    >
                      <FaRegTrashAlt
                        size={20}
                        color="red"
                        onClick={() => handleDelete(ele?._id)}
                        style={{ cursor: "pointer" }}
                      />
                    </Col>
                  </Row>
                </Col>
              ))}
            </Row>
          </Col>

          <Row className="mt-4">
            <Col xs={12} className="mt-4">
              <Row>
                <Col>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="cancelbtn"
                    onClick={() => navigate("/Admin/product-offer")}
                  >
                    CANCEL
                  </Button>
                </Col>
                <Col className="d-flex justify-content-end">
                  <Button
                    size="sm"
                    variant="success"
                    type="submit"
                    onClick={() => submitForm()}
                  >
                    DONE{" "}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Row>
        <Toaster position="top-right" />
      </Container>
    </div>
  );
};

export default Offer;
