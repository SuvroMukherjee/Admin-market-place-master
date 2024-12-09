import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import {
  EditVerification,
  FileUpload,
  UpdatesellerOwnRegistrationForm,
  VerifyEditOtp,
  allIndiaCities,
  allcatList,
  sellerDetails,
} from "../../../API/api";
import {
  Button,
  Col,
  Container,
  Row,
  Form,
  ButtonGroup,
  Card,
  Image,
  Table,
  Modal,
} from "react-bootstrap";
import { RiEdit2Fill, RiShareForwardFill } from "react-icons/ri";
import toast, { Toaster } from "react-hot-toast";
import { GrUpdate } from "react-icons/gr";
import { MdCancel, MdOutlineFileUpload } from "react-icons/md";
import { IoIosAddCircle, IoIosCloseCircle } from "react-icons/io";
import { IoSaveSharp } from "react-icons/io5";
import "./sellerlayout.css";
import { ImProfile } from "react-icons/im";
import { GiShop } from "react-icons/gi";
import { TiDocumentText } from "react-icons/ti";
import { BsBank } from "react-icons/bs";
import { TbCategoryPlus } from "react-icons/tb";
import { BsShop } from "react-icons/bs";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { distanceCategories } from "../../../common/DistanceDelivery";
import OtpInput from "react-otp-input";

const ProfilePage = () => {
  const { auth } = useAuth();

  const { id: userId } = useParams();

  const [loading, setloading] = useState(true);

  const [isEdit, setIsEdit] = useState({
    email: false,
    phone_no: false,
  });

  const [userInfo, setUserInfo] = useState({
    user_name: "",
    email: "",
    phone_no: "",
    password: "",
  });

  const [oldEmail, setOldEmail] = useState("");
  const [oldPhone,setOldphone] = useState("")

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  useEffect(() => {
    if (auth) {
      getProfileData();
    }
  }, []);

  async function getProfileData() {
    let res = await sellerDetails(userId);
    const { ...filteredData } = res?.data?.data || {};
    console.log(res?.data?.data);
    setOldEmail(res?.data?.data?.email);
    setOldphone(res?.data?.data?.phone_no)
    setUserInfo(filteredData);
    setloading(false);
  }

  console.log({ userInfo });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ userInfo });
    // You can perform validation here before proceeding to the next step

    let payload = { 
     
      user_name : userInfo?.user_name,
    }

    let response = await UpdatesellerOwnRegistrationForm(
      payload,
      auth?.userId
    );

    console.log({ response });

    console.log(response?.data?.data);

    if (response?.response?.data?.error) {
      toast.error(response?.response?.data?.data);
      getProfileData();
    } else {
      toast.success("Personal information Updated");
      getProfileData();
    }
  };

  const resendEmailVerification = async () => {
    let payload = { newUser: userInfo?.email, user: oldEmail };

    if (userInfo?.email == oldEmail) {
      toast.error("Please update your email first");
      return;
    }
    let response = await EditVerification(payload);

    if (response?.response?.data?.error) {
      toast.error(response?.response?.data?.message);
    } else {
      // toast.success("Email Verification Resent");
      // updateEmailHandler();
      toast.success("Email Verification Code Resent");
      setShowModal(true);
    }
  };


  const resendPhoneVerification = async () => {
    let payload = { newUser: userInfo?.phone_no, user: oldPhone };

    if (userInfo?.phone_no == oldPhone) {
      toast.error("Please update your email first");
      return;
    }
    let response = await EditVerification(payload);

    if (response?.response?.data?.error) {
      toast.error(response?.response?.data?.message);
    } else {
      // toast.success("Email Verification Resent");
      // updateEmailHandler();
      toast.success("Email Verification Code Resent");
      setShowModal(true);
    }
  };

  return (
    <Container className="mb-4 mt-4">
      {loading ? (
        <Container className="mt-4">
          <Row>
            <Col className="d-flex justify-content-center align-items-center">
              <Spinner animation="border" size="lg" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </Col>
          </Row>
        </Container>
      ) : (
        <>
          <div className="mt-4">
            <Container>
              <Row>
                <Col className="hd">
                  {" "}
                  <span className="mx-2">
                    <ImProfile size={25} />
                  </span>{" "}
                  Personal Information
                </Col>
              </Row>
              <Row>
                <Form onSubmit={handleSubmit}>
                  <Row className="mt-2">
                    <Col xs={6}>
                      <Form.Group controlId="user_name">
                        <Form.Label className="frmLable">
                          User Name <span className="req">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="user_name"
                          placeholder="Enter Your Username"
                          size="sm"
                          value={userInfo?.user_name}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group controlId="email">
                        <Form.Label className="frmLable">
                          Email <span className="req">*</span>{" "}
                          <span>
                            {isEdit?.email ? (
                              <IoIosCloseCircle
                                size={25}
                                color="black"
                                className="cursor"
                                onClick={() =>
                                  setIsEdit({ ...isEdit, email: false })
                                }
                              />
                            ) : (
                              <RiEdit2Fill
                                size={25}
                                color="black"
                                className="cursor"
                                onClick={() =>
                                  setIsEdit({ ...isEdit, email: true })
                                }
                              />
                            )}
                          </span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          size="sm"
                          placeholder="Enter Your Email"
                          value={oldEmail}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                      {isEdit.email && (
                        <>
                          <Form.Group controlId="email">
                            <Form.Label className="frmLable mt-4">
                              Enter Your New Email{" "}
                              <span className="req">*</span>{" "}
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              size="sm"
                              placeholder="Enter Your Email"
                              value={userInfo?.email}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                          <Button
                            variant="dark"
                            size="sm"
                            className="frmLable w-30 mt-2"
                            onClick={() => resendEmailVerification()}
                          >
                            Update Email
                          </Button>
                        </>
                      )}
                    </Col>
                  </Row>

                  {showModal && (
                    <EmailEditModal
                      showModal={showModal}
                      handleClose={handleClose}
                      getProfileData={getProfileData}
                      isEdit={isEdit}
                      userInfo={userInfo}
                      oldEmail={oldEmail}
                      oldPhone={oldPhone}
                      setIsEdit={setIsEdit}
                    />
                  )}

                  <Row className="mt-2">
                    <Col xs={6}>
                      <Form.Group controlId="phone_no">
                        <Form.Label className="frmLable">
                          Phone Number <span className="req">*</span>{" "}
                          <span className="mx-2">
                            {" "}
                            {isEdit?.phone_no ? (
                              <IoIosCloseCircle
                                size={25}
                                color="black"
                                className="cursor"
                                onClick={() =>
                                  setIsEdit({ ...isEdit, phone_no: false })
                                }
                              />
                            ) : (
                              <RiEdit2Fill
                                size={25}
                                color="black"
                                className="cursor"
                                onClick={() =>
                                  setIsEdit({ ...isEdit, phone_no: true })
                                }
                              />
                            )}
                          </span>
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone_no"
                          size="sm"
                          placeholder="Enter Your Phone No."
                          value={oldPhone}
                          onChange={handleChange}
                          required
                          pattern="[0-9]{10}"
                          title="Phone number must be a 10-digit number"
                        />
                      </Form.Group>
                      {isEdit.phone_no && (
                        <>
                          <Form.Group controlId="phone_no">
                            <Form.Label className="frmLable mt-2">
                             Enter Your New Phone Numer <span className="req">*</span>{" "}
                              
                            </Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone_no"
                              size="sm"
                              placeholder="Enter Your Phone No."
                              value={userInfo?.phone_no}
                              onChange={handleChange}
                              required
                              pattern="[0-9]{10}"
                              title="Phone number must be a 10-digit number"
                            />
                          </Form.Group>

                          <Button
                            variant="dark"
                            size="sm"
                            className="frmLable w-30 mt-2"
                            onClick={()=>resendPhoneVerification()}
                          >
                            Update Phone Number
                          </Button>
                        </>
                      )}
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col className="d-flex justify-content-start">
                      <Button
                        variant="dark"
                        size="sm"
                        className="frmLable w-30"
                        type="submit"
                      >
                        {" "}
                        Update{" "}
                        <span className="mx-2">
                          <GrUpdate />
                        </span>{" "}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Row>
            </Container>
          </div>

          <div className="mt-4">
            <ShopInfo userInfo={userInfo} getProfileData={getProfileData} />
          </div>

          <div className="mt-4">
            <Documentation
              userInfo={userInfo}
              getProfileData={getProfileData}
            />
          </div>

          <div className="mt-4">
            <Bankdata userInfo={userInfo} getProfileData={getProfileData} />
          </div>

          <div className="mt-4">
            <CategoryAndCommission
              userInfo={userInfo}
              getProfileData={getProfileData}
            />
          </div>
        </>
      )}
      <Toaster position="top-right" />
    </Container>
  );
};

const EmailEditModal = ({
  showModal,
  handleClose,
  getProfileData,
  isEdit,
  userInfo,
  oldEmail,
  oldPhone,
  setIsEdit,
}) => {
  const [loading, setloading] = useState(false);

  const { setAuth } = useAuth();

  const updateEmailHandler = async () => {
    try {
      setloading(true);
      let payload = {};

      if (isEdit.email) {
        payload = { user: oldEmail, newUser: userInfo?.email, otp: otp };
      }

      if (isEdit.phone_no) {
        payload = { user: oldPhone, newUser: userInfo?.phone_no, otp: otp };
      }

      const res = await VerifyEditOtp(payload, userInfo?._id);

      if (res?.response?.data?.error) {
        toast.error(res?.response?.data?.message);
      } else {
        const accessToken = res?.data?.data[1]?.accessToken;
        const role = {
          _id: "seller",
          name: "Seller",
        };

        console.log(res?.data?.data[0]?.name, "api name");

        setAuth((prevAuth) => ({
          ...prevAuth,
          username: res?.data?.data[0]?.name,
          password: res?.data?.data[0]?.password,
          email: res?.data?.data[0]?.email,
          accessToken,
          role,
          userId: res?.data?.data[0]?._id,
        }));

        const authData = {
          username: res?.data?.data[0]?.name,
          password: res?.data?.data[0]?.password,
          email: res?.data?.data[0]?.email,
          accessToken,
          role,
          userId: res?.data?.data[0]?._id,
        };

        localStorage.clear();
        localStorage.setItem("ACCESS_TOKEN", JSON.stringify(accessToken));
        localStorage.setItem("auth", JSON.stringify(authData));
        getProfileData();
        setIsEdit({ ...isEdit, email: false, phone_no: false });
        handleClose();
      }
    } catch (error) {
      console.error("Error updating email/phone:", error);
      toast.error("An error occurred while updating the information.");
    } finally {
      setloading(false);
    }
  };

  const [otp, setOtp] = useState("");

  return (
    <Modal show={showModal} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "14px" }}>
          {isEdit.email &&
            `We have sent a verification code to your new Email - ${userInfo?.email}`}
          {isEdit.phone_no &&
            `We have sent a verficaton code to your new Phone - ${userInfo?.phone_no}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={4}
          renderSeparator={<span>-</span>}
          renderInput={(props) => <input {...props} />}
          inputStyle="otp-input"
          containerStyle="otp-input-container-Seller"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="dark"
          size="sm"
          className="frmLable w-30"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="dark"
          size="sm"
          className="frmLable w-30"
          type="submit"
          onClick={updateEmailHandler}
        >
          {loading && <Spinner animation="border" size="sm" />}
          {!loading && isEdit.email && "Update Email"}
          {!loading && isEdit.phone_no && "Update Phone Number"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ShopInfo = ({ userInfo, getProfileData }) => {
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
    setShopInfo(userInfo?.Shop_Details_Info);
  }, [userInfo]);

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

  // const onFileUpload = async (file) => {
  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     const res = await FileUpload(formData);
  //     setTimeout(() => {
  //       setShopInfo((prevData) => ({
  //         ...prevData,
  //         pic_of_shope: [...prevData?.pic_of_shope, res?.data?.data?.fileurl],
  //       }));
  //     }, 3000);
  //     // setBtnEnable(false)
  //   } catch (err) {
  //     console.error(err, "err");
  //   }
  // };

  const onFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await FileUpload(formData);
      setTimeout(() => {
        setShopInfo((prevData) => ({
          ...prevData,
          pic_of_shope: [
            res?.data?.data?.fileurl,
            ...(prevData?.pic_of_shope || []), // Fallback to an empty array if undefined
          ],
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

    let payload = { Shop_Details_Info: shopInfo };
    let response = await UpdatesellerOwnRegistrationForm(
      payload,
      userInfo?._id
    );

    if (response?.response?.data?.error) {
      toast.error(response?.response?.data?.data);
      getProfileData();
    } else {
      toast.success(response?.data?.message);
      getProfileData();
    }
    //nextStep();
  };

  // const distanceCategories = [
  //     "Within City",
  //     "Nearby Cities or Districts",
  //     "Within State",
  //     "Inter-State (Nearby States)",
  //     "Long-Distance (Across States)"
  // ];

  return (
    <Container>
      <Row>
        <Col className="hd">
          <span className="mx-2">
            <BsShop size={25} />
          </span>{" "}
          Update Shop Deatils
        </Col>
      </Row>
      <Row>
        <Form onSubmit={handleSubmit}>
          <Row className="mt-2">
            <Col xs={6}>
              <Form.Group controlId="shopName">
                <Form.Label className="frmLable">
                  Shop Name <span className="req">*</span>{" "}
                </Form.Label>
                <Form.Control
                  type="text"
                  name="shope_name"
                  placeholder="Enter shop name"
                  size="sm"
                  value={shopInfo?.shope_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col xs={6}>
              <Form.Group controlId="shopAddress1">
                <Form.Label className="frmLable">
                  Shop Address 1 <span className="req">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="shop_address1"
                  placeholder="Enter shop address 1"
                  size="sm"
                  value={shopInfo?.shop_address1}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col xs={6}>
              <Form.Group controlId="shopAddress2">
                <Form.Label className="frmLable">Shop Address 2</Form.Label>
                <Form.Control
                  type="text"
                  name="shop_address2"
                  placeholder="Enter shop address 2"
                  size="sm"
                  value={shopInfo?.shop_address2}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col xs={6}>
              <Form.Group controlId="pickupLocation">
                <Form.Label className="frmLable">
                  Pickup Location <span className="req">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="picup_location"
                  placeholder="Enter pickup location"
                  size="sm"
                  value={shopInfo?.picup_location}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col xs={6}>
              <Form.Group controlId="pincode">
                <Form.Label className="frmLable">
                  Pincode <span className="req">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="pin_code"
                  placeholder="Enter pincode"
                  size="sm"
                  value={shopInfo?.pin_code}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col xs={6}>
              <Form.Group controlId="district">
                <Form.Label className="frmLable">
                  District <span className="req">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="disict"
                  placeholder="Enter district"
                  size="sm"
                  value={shopInfo?.disict}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col xs={6}>
              <Form.Group controlId="state">
                <Form.Label className="frmLable">
                  State <span className="req">*</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  name="state"
                  size="sm"
                  value={shopInfo?.state}
                  onChange={handleChange}
                  required
                >
                  <option disabled selected>
                    Select State
                  </option>
                  {allstates?.length > 0 &&
                    allstates?.map((ele) => (
                      <option value={ele?.name}>{ele?.name}</option>
                    ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col xs={6}>
              <Form.Group controlId="shopImages">
                <Form.Label className="frmLable">
                  Shop Images <span className="req">*</span>
                </Form.Label>
                <Form.Control
                  type="file"
                  name="pic_of_shope"
                  onChange={handleFileChange}
                  size="sm"
                  multiple
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col>
              {shopInfo?.pic_of_shope?.length > 0 && (
                <Container>
                  <Row>
                    {shopInfo?.pic_of_shope.map((fileUrl, index) => (
                      <Col key={index} xs={4} md={2}>
                        {/* <span>{index + 1}</span> */}
                        <span>
                          {/* <MdCancel
                                                        style={{
                                                            color: 'red',
                                                            fontSize: '20px',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => handleCancelImage(fileUrl)}
                                                    /> */}
                        </span>
                        <Image src={fileUrl} thumbnail fluid />
                        {/* Use fluid prop for responsive images */}
                      </Col>
                    ))}
                  </Row>
                </Container>
              )}
            </Col>
          </Row>

          <Row className="mt-2">
            <Col xs={6}>
              <Form.Group controlId="old_shope_desc">
                <Form.Label className="frmLable">
                  Total Year of Busniess Experience{" "}
                  <span className="req">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  size="sm"
                  name="old_shope_desc"
                  placeholder="Total Year (Enter Numbers Only)"
                  value={shopInfo?.old_shope_desc}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={6}>
              <Form.Group controlId="total_no_of_unit">
                <Form.Label className="frmLable">
                  {" "}
                  Total of Units Sold Each Year <span className="req">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  size="sm"
                  name="total_no_of_unit"
                  placeholder="Total Units (Enter Numbers Only)"
                  value={shopInfo?.total_no_of_unit}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Existing Form Fields */}
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
          {/* Existing Submit Button */}

          {/* <Button variant="secondary" onClick={prevStep}>Previous</Button>{' '} */}
          <Row className="mt-4">
            <Col>
              <Button
                variant="dark"
                size="sm"
                className="frmLable"
                type="submit"
              >
                {" "}
                Update{" "}
                <span className="mx-2">
                  <GrUpdate />
                </span>
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
    </Container>
  );
};

const Documentation = ({ userInfo, getProfileData }) => {
  const [documentation, setDocumentation] = useState({
    gst_no: "",
    pan_no: "",
    adhar_card: "",
    gst_file: null,
    cancelled_cheque: null,
    msme_certificate: null,
  });

  useEffect(() => {
    setDocumentation(userInfo?.doc_details);
  }, [userInfo]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocumentation({ ...documentation, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const name = event.target.name;
    //console.log({name})
    if (file.type === "application/pdf") {
      if (file.size <= 5 * 1024 * 1024) {
        ongstFileUpload(file, name);
      } else {
        toast.error("File size exceeds 5 MB limit.");
      }
    } else {
      toast.error("Please upload a PDF file..");
    }
    //setDocumentation({ ...documentation, [name]: files[0] });
  };

  const ongstFileUpload = async (file, name) => {
    const formData = new FormData();
    formData.append("file", file);

    console.log(formData);

    try {
      const res = await FileUpload(formData);
      setTimeout(() => {
        setDocumentation((prevData) => ({
          ...prevData,
          [name]: res?.data?.data?.fileurl,
        }));
      }, 3000);
      // setBtnEnable(false)
    } catch (err) {
      console.error(err, "err");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can perform validation here before proceeding to the next step

    let payload = { doc_details: documentation };

    let response = await UpdatesellerOwnRegistrationForm(
      payload,
      userInfo?._id
    );

    if (response?.response?.data?.error) {
      toast.error(response?.response?.data?.data);
      getProfileData();
    } else {
      toast.success(response?.data?.message);
      getProfileData();
    }
  };

  return (
    <Container>
      <Row>
        <Col className="hd">
          {" "}
          <span className="mx-2">
            <TiDocumentText size={25} />
          </span>{" "}
          Update Document
        </Col>
      </Row>
      <Row>
        <Form onSubmit={handleSubmit}>
          <Row className="mt-2">
            <Col xs={6}>
              <Form.Group controlId="gst_no">
                <Form.Label className="frmLable">
                  GST Number <span className="req">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="gst_no"
                  size="sm"
                  placeholder="Enter GST number"
                  value={documentation?.gst_no}
                  onChange={handleChange}
                  pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                  title="GST number must be in the format: 06BZAHM6385P6Z2"
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group controlId="pan_no">
                <Form.Label className="frmLable">
                  PAN Card <span className="req">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="pan_no"
                  size="sm"
                  placeholder="Enter PAN card number"
                  value={documentation?.pan_no}
                  onChange={handleChange}
                  pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                  title="PAN card number must be in the format ABCDE1234F"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col xs={6}>
              <Form.Group controlId="adhar_card">
                <Form.Label className="frmLable">
                  Aadhar Card <span className="req">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="adhar_card"
                  size="sm"
                  placeholder="Enter Aadhar card number"
                  value={documentation?.adhar_card}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group controlId="gst_file">
                <Form.Label className="frmLable">
                  GST File <span className="req">*</span>
                  {documentation?.gst_file && (
                    <a
                      href={documentation?.gst_file}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="mx-4">SHOW FILE</span>
                    </a>
                  )}
                </Form.Label>
                <Form.Control
                  type="file"
                  name="gst_file"
                  size="sm"
                  onChange={handleFileChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col xs={6}>
              <Form.Group controlId="cancelled_cheque">
                <Form.Label className="frmLable">
                  Cancelled Cheque <span className="req">*</span>
                  {documentation?.cancelled_cheque && (
                    <a
                      href={documentation?.cancelled_cheque}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="mx-4">SHOW FILE</span>
                    </a>
                  )}
                </Form.Label>
                <Form.Control
                  type="file"
                  name="cancelled_cheque"
                  size="sm"
                  onChange={handleFileChange}
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group controlId="msme_certificate">
                <Form.Label className="frmLable">
                  MSME Certificate <span className="req">*</span>
                  {documentation?.msme_certificate && (
                    <a
                      href={documentation?.msme_certificate}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="mx-4">SHOW FILE</span>
                    </a>
                  )}
                </Form.Label>
                <Form.Control
                  type="file"
                  name="msme_certificate"
                  size="sm"
                  onChange={handleFileChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* <Button variant="secondary" onClick={prevStep}>Previous</Button>{' '} */}
          <Row className="mt-4">
            <Col>
              <Button
                variant="dark"
                size="sm"
                className="frmLable"
                type="submit"
              >
                Update{" "}
                <span className="mx-2">
                  <GrUpdate />
                </span>
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
    </Container>
  );
};

const Bankdata = ({ userInfo, getProfileData }) => {
  const [bankingDetails, setBankingDetails] = useState({
    bank_name: "",
    beneficiary_name: "",
    account_number: "",
    ifsc_code: "",
    bank_branch: "",
    micr_code: "",
  });

  useEffect(() => {
    setBankingDetails(userInfo?.bank_details);
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankingDetails({ ...bankingDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can perform validation here before proceeding to the next step
    let payload = { bank_details: bankingDetails };

    let response = await UpdatesellerOwnRegistrationForm(
      payload,
      userInfo?._id
    );

    if (response?.response?.data?.error) {
      toast.error(response?.response?.data?.data);
      getProfileData();
    } else {
      toast.success(response?.data?.message);
      getProfileData();
    }
  };
  return (
    <Container>
      <Row>
        <Col className="hd">
          {" "}
          <span className="mx-2">
            <BsBank size={25} />
          </span>{" "}
          Bank Details
        </Col>
      </Row>
      <Row>
        <Form onSubmit={handleSubmit}>
          <Row className="mt-2">
            <Col xs={6}>
              <Form.Group controlId="bankName">
                <Form.Label className="frmLable">
                  Bank Name <span className="req">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="bank_name"
                  placeholder="Enter bank name"
                  size="sm"
                  value={bankingDetails?.bank_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={6}>
              <Form.Group controlId="beneficiaryName">
                <Form.Label className="frmLable">
                  Beneficiary Name <span className="req">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="beneficiary_name"
                  placeholder="Enter beneficiary name"
                  size="sm"
                  value={bankingDetails?.beneficiary_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col xs={6}>
              <Form.Group controlId="accountNumber">
                <Form.Label className="frmLable">
                  Account Number <span className="req">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="account_number"
                  placeholder="Enter account number"
                  size="sm"
                  value={bankingDetails?.account_number}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={6}>
              <Form.Group controlId="ifscCode">
                <Form.Label className="frmLable">
                  IFSC Code <span className="req">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="ifsc_code"
                  placeholder="Enter IFSC code"
                  size="sm"
                  value={bankingDetails?.ifsc_code}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col xs={6}>
              <Form.Group controlId="bankBranch">
                <Form.Label className="frmLable">
                  Bank Branch <span className="req">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="bank_branch"
                  placeholder="Enter bank branch"
                  size="sm"
                  value={bankingDetails?.bank_branch}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={6}>
              <Form.Group controlId="micrCode">
                <Form.Label className="frmLable">
                  MICR Code <span className="req">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="micr_code"
                  placeholder="Enter MICR code"
                  size="sm"
                  value={bankingDetails?.micr_code}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          {/* <Button variant="secondary" onClick={prevStep}>Previous</Button>{' '} */}
          <Row className="mt-4">
            <Col>
              <Button
                variant="dark"
                size="sm"
                className="frmLable"
                type="submit"
              >
                Update{" "}
                <span className="mx-2">
                  <GrUpdate />
                </span>
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
    </Container>
  );
};

const CategoryAndCommission = ({ userInfo, getProfileData }) => {
  const [formData, setFormData] = useState({
    commission_data: [{ categoryId: "", commission_rate: "" }],
  });
  const [categorylist, setcategorylist] = useState([]);

  useEffect(() => {
    getAllCats();
  }, []);

  useEffect(() => {
    setFormData(userInfo?.interest_details);
    console.log(userInfo?.interest_details?.categoryId, "cats");
    setSelectedCategories(userInfo?.interest_details?.categoryId);
  }, [userInfo]);

  async function getAllCats() {
    await allcatList()
      .then((res) => {
        setcategorylist(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedCategories = [...formData.commission_data];
    updatedCategories[index][name] = value;
    setFormData({ ...formData, commission_data: updatedCategories });
  };

  const addCategory = () => {
    setFormData({
      ...formData,
      commission_data: [
        ...formData.commission_data,
        { categoryId: "", commission_rate: "" },
      ],
    });
  };

  const handleSave = () => {
    console.log(formData.commission_data);
    addCategorytoForm(formData.commission_data);
  };

  const handleDelete = (index) => {
    const updatedCategories = [...formData.commission_data];
    updatedCategories.splice(index, 1);
    setFormData({ ...formData, commission_data: updatedCategories });
  };

  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCheckboxChange = (categoryId) => {
    if (selectedCategories?.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleSubmit = async () => {
    let payload = {
      interest_details: {
        commission_data: formData?.commission_data,
        categoryId: selectedCategories,
      },
    };

    console.log(payload);

    let response = await UpdatesellerOwnRegistrationForm(
      payload,
      userInfo?._id
    );

    if (response?.response?.data?.error) {
      toast.error(response?.response?.data?.data);
    } else {
      toast.success(response?.data?.message);
      getProfileData();
      //nextStep();
    }
  };

  console.log({ formData });

  return (
    <Container>
      <Row>
        <Col>
          <Row>
            <Col className="hd">
              {" "}
              <span className="mx-2">
                <TbCategoryPlus size={25} />
              </span>
              Interest Category & Commission
            </Col>
          </Row>
          <Row className="mt-2">
            <Row>
              {categorylist?.length > 0 &&
                categorylist.map((option) => (
                  <Col key={option?._id} xs={4} className="mt-2 ">
                    <input
                      type="checkbox"
                      id={option?._id}
                      name={option?.title}
                      checked={selectedCategories?.includes(option?._id)}
                      onChange={() => handleCheckboxChange(option?._id)}
                    />
                    <label className="mx-2 frmLable" htmlFor={option?._id}>
                      {option?.title}
                    </label>
                  </Col>
                ))}
            </Row>
          </Row>
        </Col>
      </Row>
      {/* <Row className='mt-2'>
            <Row>
              
            </Row>
           
            <Row className='mt-2'>
                <Col xs={8} >
                    <Form.Group controlId="commissionRate">
                        {formData?.commission_data.map((item, index) => (
                            <Row key={index} className="mb-2">
                                <Col xs={4}>
                                    <Form.Label className='frmLable'>category</Form.Label>
                                    <Form.Select
                                        name="categoryId"
                                        value={item?.categoryId}
                                        onChange={(e) => handleChange(e, index)}
                                        size='sm'
                                        required
                                    >
                                        <option value="" disabled>Select category</option>
                                        {categorylist?.length > 0 && categorylist.map((ele) => (
                                            <option value={ele?._id}>{ele?.title}</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col xs={4}>
                                    <Form.Label className='frmLable'>commission(%)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="commission_rate"
                                        value={item?.commission_rate}
                                        onChange={(e) => handleChange(e, index)}
                                        placeholder="Commisson rate"
                                        size='sm'
                                        required
                                    />
                                </Col>
                              
                            </Row>
                        ))}
                        <IoIosAddCircle size={20} onClick={addCategory} />
                        <span className='frmLable mx-2' >Add more...</span>
                    </Form.Group>
                </Col>
            </Row>
        </Row> */}
      <Row className="mt-4">
        <Col>
          {/* <Button variant="secondary" onClick={prevStep}>Previous</Button>{' '} */}
          <Button
            variant="dark"
            size="sm"
            className="frmLable"
            onClick={() => handleSubmit()}
          >
            Update{" "}
            <span className="mx-2">
              <GrUpdate />
            </span>
          </Button>
        </Col>
      </Row>
      <Toaster position="top-right" />
    </Container>
  );
};

export default ProfilePage;
