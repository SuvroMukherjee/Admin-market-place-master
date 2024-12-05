import React, { useEffect, useState } from "react";

import { Form, Button, Container, Row, Col, Image } from "react-bootstrap";
import {
  FileUpload,
  UpdatesellerOwnRegistrationForm,
  allIndiaCities,
} from "../../API/api";
import { MdCancel, MdOutlineFileUpload } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { RiShareForwardFill } from "react-icons/ri";
import { distanceCategories } from "../../common/DistanceDelivery";

const Step2 = ({ nextStep, prevStep, reg_userdata, getUserdata }) => {
  const [shopInfo, setShopInfo] = useState({
    shope_name: "",
    shop_address1: "",
    shop_address2: "",
    picup_location: "",
    pin_code: "",
    disict: "",
    state: "",
    pic_of_shope: [],
    old_shope_desc: "",
    total_no_of_unit: "",
    distance_category: 100,
  });
  const [allstates, setAllStates] = useState([]);

  useEffect(() => {
    getallStates();
  }, []);

  const getallStates = async () => {
    let res = await allIndiaCities();
    setAllStates(res?.data?.data?.states);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShopInfo({ ...shopInfo, [name]: value });
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const selectedFiles = Array.from(files).filter((file) =>
      allowedTypes.includes(file.type)
    );

    selectedFiles.forEach((file) => {
      onFileUpload(file);
    });

    // setShopInfo({ ...shopInfo, pic_of_shope: files });
  };

  const onFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    console.log(formData);

    try {
      const res = await FileUpload(formData);
      setTimeout(() => {
        setShopInfo((prevData) => ({
          ...prevData,
          pic_of_shope: [...prevData?.pic_of_shope, res?.data?.data?.fileurl],
        }));
      }, 3000);
      // setBtnEnable(false)
    } catch (err) {
      console.error(err, "err");
    }
  };

  const handleCancelImage = (url) => {
    let filterData = shopInfo?.pic_of_shope?.filter((e, index) => {
      return e !== url;
    });

    console.log(filterData);

    setShopInfo((prevData) => ({
      ...prevData,
      pic_of_shope: filterData,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can perform validation here before proceeding to the next step
    console.log({ shopInfo });

    let payload = { Shop_Details_Info: shopInfo };
    let response = await UpdatesellerOwnRegistrationForm(
      payload,
      reg_userdata?._id
    );

    if (response?.response?.data?.error) {
      toast.error(response?.response?.data?.data);
    } else {
      getUserdata(response?.data?.data);
      localStorage.setItem(
        "seller-registration",
        JSON.stringify(response?.data?.data)
      );
      toast.success(response?.data?.message);
      nextStep();
    }
    //nextStep();
  };

  console.log({ shopInfo });

  return (
    <Container>
      <Row>
        <Col>
          <Row>
            <Col className="t1">Tell us about your busniess</Col>
          </Row>
          <Form onSubmit={handleSubmit}>
            <Row className="mt-3">
              <Col xs={6}>
                <Form.Group controlId="shopName">
                  <Form.Label className="frmLable">
                    Shop Name <span className="req">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="shope_name"
                    className="tapG"
                    placeholder="Enter shop name"
                    size="sm"
                    value={shopInfo?.shope_name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group controlId="shopAddress1">
                  <Form.Label className="frmLable">
                    Shop Address 1 <span className="req">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="shop_address1"
                    className="tapG"
                    placeholder="Enter shop address 1"
                    size="sm"
                    value={shopInfo.shop_address1}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={6}>
                <Form.Group controlId="shopAddress2">
                  <Form.Label className="frmLable">Shop Address 2</Form.Label>
                  <Form.Control
                    type="text"
                    name="shop_address2"
                    className="tapG"
                    placeholder="Enter shop address 2"
                    size="sm"
                    value={shopInfo.shop_address2}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group controlId="pickupLocation">
                  <Form.Label className="frmLable">
                    Pickup Location <span className="req">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="picup_location"
                    className="tapG"
                    placeholder="Enter pickup location"
                    size="sm"
                    value={shopInfo.picup_location}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={6}>
                <Form.Group controlId="pin_code">
                  <Form.Label className="frmLable">
                    Pincode <span className="req">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="pin_code"
                    className="tapG"
                    placeholder="Enter pincode"
                    size="sm"
                    value={shopInfo.pin_code}
                    onChange={handleChange}
                    pattern="[0-9]{6}"
                    title="Pincode must be a 6-digit number"
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group controlId="district">
                  <Form.Label className="frmLable">
                    District <span className="req">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="disict"
                    className="tapG"
                    placeholder="Enter district"
                    size="sm"
                    value={shopInfo.disict}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={6}>
                <Form.Group controlId="state">
                  <Form.Label className="frmLable">
                    State <span className="req">*</span>
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="state"
                    className="tapG"
                    size="sm"
                    value={shopInfo.state}
                    onChange={handleChange}
                    required
                  >
                    <option disabled selected>
                      Select State
                    </option>
                    {allstates?.length > 0 &&
                      allstates?.map((ele, index) => (
                        <option key={index} value={ele?.name}>
                          {ele?.name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group controlId="shopImages">
                  <Form.Label className="frmLable">
                    Shop Image <span className="req">*</span>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="shop_image"
                    className="tapG"
                    onChange={handleFileChange}
                    size="sm"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={6}>
                <Form.Group controlId="totalYearOfBusinessExperience">
                  <Form.Label className="frmLable">
                    Total Year of Business Experience{" "}
                    <span className="req">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    size="sm"
                    className="tapG"
                    name="old_shope_desc"
                    placeholder="Total Year (Enter Numbers Only)"
                    value={shopInfo.old_shope_desc}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col xs={6}>
                <Form.Group controlId="totalNumberOfUnits">
                  <Form.Label className="frmLable">
                    Total Number of Units Sold Each Year{" "}
                    <span className="req">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    size="sm"
                    className="tapG"
                    name="total_no_of_unit"
                    placeholder="Total Number (Enter Numbers Only)"
                    value={shopInfo.total_no_of_unit}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col xs={6}>
                <Form.Group controlId="distanceCategory">
                  <Form.Label className="frmLable">
                    Please Select Potential Delivery Distance{" "}
                    <span className="req">*</span>
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="distance_category"
                    size="sm"
                    value={shopInfo?.distance_category}
                    onChange={handleChange}
                    required
                  >
                    {distanceCategories.map((category, index) => (
                      <option key={index} value={category?.distance}>
                        {category?.text} -{" "}
                        <span style={{ color: "red" }}>{category?.range}</span>
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-5">
              <Col className="text-center">
                <Button size="sm" className="frmLable grnbg" type="submit">
                  Next Step{" "}
                  <span className="mx-2">
                    <RiShareForwardFill />
                  </span>
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Toaster position="top-right" />
    </Container>
  );
};

export default Step2;
