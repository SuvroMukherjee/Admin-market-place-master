import { IndeterminateCheckBox } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { FaArrowDown, FaArrowUp, FaInfoCircle } from "react-icons/fa";
import { IoIosAdd, IoMdCloseCircle } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import {
  FileUpload,
  ProductSpecificationCreate,
  UpdateProductSpecification,
  sellerProductDeatils,
} from "../../../API/api";
import { ratingCalculation } from "../../../common/RatingAvg";
import { StarRating } from "../../../Layouts/StarRating";
import "./Style.css";
import { FaCircleInfo } from "react-icons/fa6";

const NewProductVariation = ({
  selectedproductid,
  showModal,
  handleCloseModal,
  getProductListFunc,
}) => {
  const [specifications, setSpecifications] = useState([
    {
      title: "",
      value: "",
      //user_choice: false,
    },
  ]);

  const [productPrice, setproductPrice] = useState(0);

  const [isEdit, setIsEdit] = useState(false);

  const [productImges, setProductImages] = useState([]);

  const [selectedSpecId, setSelectedSpecId] = useState();

  const [addedVariants, setAddedVariants] = useState([]);

  const [reviewData, setReviewData] = useState([]);

  const { id: productId } = useParams();

  const [productData, setProductData] = useState([]);
  useEffect(() => {
    getProductdata();
  }, []);

  const navigate = useNavigate();

  async function getProductdata() {
    let res = await sellerProductDeatils(productId);
    console.log(res?.data?.data?.SellerProductData, "productData");
    setProductData(res?.data?.data?.SellerProductData);
    setAddedVariants(res?.data?.data?.specificationData);
    setReviewData(res?.data?.data?.reviewData);
  }

  const handleChange = (index, title, value) => {
    setSpecifications((prevSpecifications) => {
      const newSpecifications = [...prevSpecifications];
      newSpecifications[index] = { title, value };
      return newSpecifications;
    });
  };

  const addSpecification = () => {
    setSpecifications((prevSpecifications) => [
      ...prevSpecifications,
      { title: "", value: "" }, // Set user_choice to a default value
    ]);
  };

  const removeSpecification = (index) => {
    setSpecifications((prevSpecifications) => {
      const newSpecifications = [...prevSpecifications];
      newSpecifications.splice(index, 1);
      return newSpecifications;
    });
  };

  const handleSubmit = async () => {
    console.log("Submitted Data:", specifications);
    let payload = {
      productId: productData?.productId?._id,
      spec_det: specifications,
      price: productPrice,
      image: productImges,
      skuId: generateRandomKey(),
      // user_choice:false,
    };

    console.log(payload);

    payload["product_type"] = "products";

    payload["createdby"] = productData?.sellerId?._id;

    payload["created_type"] = "sellers";

    payload["is_approved"] = false;

    let res = await ProductSpecificationCreate(payload);

    if (res?.data?.error) {
      toast.error("Something went wrong..");
    } else {
      console.log({ payload });
      getProductdata();
      setSpecifications([
        {
          title: "",
          value: "",
          //user_choice: false,
        },
      ]);
      setproductPrice("");
      setProductImages([]);
      // setTimeout(() => {
      //     navigate(`/seller/seller-ownproduct-status/new-description/${res?.data?.data?._id}`)
      // }, 1500);
      // setTimeout(() => {
      //     navigate(`/seller/seller-ownproduct-status/new-variations/${res?.data?.data?._id}`)
      // }, 1500);
    }
  };

  const nextToCustomized = () => {
    // setTimeout(() => {
    //     navigate(`/seller/seller-ownproduct-status/new-customization/${productId}`)
    // }, 1500);
  };

  const EdithandleSubmit = async () => {
    console.log("Submitted Data:", specifications);
    let payload = {
      productId: selectedproductid?._id,
      spec_det: specifications,
      price: productPrice,
      image: productImges,
      skuId: generateRandomKey(),
      // user_choice:false,
    };

    console.log(payload);

    let res = await UpdateProductSpecification(payload, selectedSpecId);

    if (res?.data?.error) {
      toast.error("Something went wrong..");
    } else {
      console.log({ payload });
      getProductListFunc();
      setSpecifications([
        {
          title: "",
          value: "",
          //user_choice: false,
        },
      ]);
      setproductPrice("");
      setProductImages([]);
      handleCloseModal(); // Close the modal after submitting
    }
  };

  function generateRandomKey() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      key += characters.charAt(randomIndex);
    }

    return key;
  }

  const handleFileImageChange = async (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const selectedFiles = Array.from(files);
      console.log("Selected Files:", selectedFiles);
      selectedFiles.forEach((file, index) => {
        console.log(`File ${index + 1}:`, file);
      });

      for (const file of selectedFiles) {
        await onFileUpload(file);
      }
    }
  };

  const onFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await FileUpload(formData);
      console.log(res?.data?.data);

      setTimeout(() => {
        setProductImages((prevData) => [
          ...prevData,
          { image_path: res?.data?.data?.fileurl },
        ]);
      }, 1500);
    } catch (err) {
      console.error(err, "err");
    }
  };

  const deleteImage = (id) => {
    console.log("clc");
    let filterData = productImges?.filter((ele, i) => {
      return i != id;
    });
    console.log({ filterData });
    setProductImages(filterData);
  };

  console.table(productImges);

  const [copyFrom, setCopyFrom] = useState(0);

  const handleCopySpecification = (e) => {
    console.log(e.target.value);
    const selectedVariant = addedVariants.find(
      (variant) => variant._id === e.target.value
    );
    console.log({ selectedVariant });
    setSpecifications(selectedVariant?.spec_det);
    setproductPrice(selectedVariant?.price);
    setProductImages(selectedVariant?.image);
  };

  const handleReset = () => {
    setSpecifications([
      {
        title: "",
        value: "",
        //user_choice: false,
      },
    ]);
    setproductPrice("");
    setProductImages([]);
    setCopyFrom(0);
  };

  const handleSpecificationsArrayUp = (index) => {
    console.log(index, "Up");

    const SpecificationsArray = [...specifications];

    let temp = SpecificationsArray[index];
    SpecificationsArray[index] = SpecificationsArray[index - 1];
    SpecificationsArray[index - 1] = temp;

    setSpecifications([...SpecificationsArray]);
  };

  const handleSpecificationsArrayDown = (index) => {
    console.log(index, "Down");

    const SpecificationsArray = [...specifications];

    let temp = SpecificationsArray[index];
    SpecificationsArray[index] = SpecificationsArray[index + 1];
    SpecificationsArray[index + 1] = temp;

    setSpecifications([...SpecificationsArray]);
  };

  return (
    <Container>
      <Row className="mx-4">
        <Col className="text-center infotab">
          <span className="mx-4">
            <FaInfoCircle color="#013e38" size={25} />
          </span>
          Request for New Variations. New variations Need Zoofi's Approval.
          After Approval you can find your variation in{" "}
          <strong>{productData?.name}</strong> Product ID :
          <strong> {productData?.productId?.productId?.toUpperCase()}</strong>
        </Col>
      </Row>
      <Row className="m-4 p-4 justify-content-md-center stepContent paddingConatiner">
        <Row className="mt-2">
          <Col className="live mt-2" xs={12}>
            Available Variants on Zoofi
          </Col>
          <Col className="live2 mt-2">
            {" "}
            This Variations are currently used by Zoofi as part of this product
            listing.
          </Col>
        </Row>
        {addedVariants?.length > 0 && (
          <Row className="d-flex gap-4 mt-4">
            {addedVariants?.map((ele, index) => (
              <Col
                key={index}
                xs={4}
                className={
                  "is_approved" in ele && !ele?.is_approved
                    ? "othervariDiv-notApproved"
                    : "othervariDiv"
                }
              >
                <Row>
                  {"is_approved" in ele && !ele?.is_approved && (
                    <Col className="mb-2 mt-2 specborder2" xs={12}>
                      <h6>Not Approved</h6>
                    </Col>
                  )}
                  <Col
                    xs={4}
                    className="d-flex justify-content-end align-items-center"
                  >
                    <img
                      src={ele?.image?.[0]?.image_path}
                      width={100}
                      className="bgofferProductImg3"
                      alt="productImage"
                    />
                  </Col>
                  <Col className="d-flex justify-content-end align-items-center mt-2 mb-2">
                    <Row>
                      <Col xs={12} className="othervariDivName">
                        {ele?.productId?.brandId?.title} {ele?.productId?.name}{" "}
                        {ele?.spec_det?.length > 0 && (
                          <span>
                            (
                            {ele?.spec_det.map((ele, index, array) => (
                              <span key={index}>
                                {ele?.value}
                                {index < array.length - 1 ? ", " : ""}
                              </span>
                            ))}
                            )
                          </span>
                        )}
                      </Col>
                      <Col xs={12} className="w-70">
                        <StarRating
                          value={ratingCalculation(ele?._id, reviewData)}
                        />
                      </Col>
                      <Col className="mt-1 othervariDivNameV" xs={12}>
                        <span className="othervariDivName">M.R.P Price</span> :{" "}
                        {ele?.price?.toLocaleString()}
                      </Col>
                      <Col className="mt-1 othervariDivNameV" xs={12}>
                        <span className="othervariDivName">SKU ID</span> :{" "}
                        {ele?.skuId?.toUpperCase()}
                      </Col>
                      <Col className="mt-1 othervariDivNameV" xs={12}>
                        <span className="othervariDivName">Product ID</span> :{" "}
                        {ele?.productId?.productId?.toUpperCase()}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            ))}
          </Row>
        )}
        <Col>
          <Row className="mt-4">
            <Col className="live mt-4">Request for New Variants</Col>
            <Col
              style={{
                textAlign: "justify",
              }}
            >
              <span>
                <FaCircleInfo />
              </span>
              <span>
                {" "}
                You should add at least 3 specifications for the product and the
                first 3 specification should be the main differentiator of the
                variant as it will show as the specification title.
              </span>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col xs={12}>
              <Row className="mt-2">
                <Col xs={6}>
                  <h6>Copy Specification from existing variants : </h6>
                  <Form.Select
                    aria-label="Default select example"
                    className="tapG"
                    onChange={(e) => {
                      handleCopySpecification(e);
                      setCopyFrom(e.target.value);
                    }}
                    value={copyFrom}
                  >
                    <option disabled value={0}>
                      open select
                    </option>
                    {addedVariants.map((ele, index) => (
                      <option key={index} value={ele?._id}>
                        Specification : {index + 1} (SKU ID : {ele?.skuId})
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col xs={6}>
                  {specifications.length > 0 &&
                    specifications[0]?.title.trim() !== "" && (
                      <>
                        <h6>The Title of the new Variant : </h6>
                        <p>
                          {"( "}
                          {specifications.slice(0, 3).map((ele, index) => (
                            <>
                              <span key={index}>
                                {ele?.title} : {ele?.value}
                                {index < 2 ? ", " : ""}
                              </span>
                            </>
                          ))}
                          {" )"}
                        </p>
                      </>
                    )}
                </Col>
              </Row>
            </Col>

            <Col xs={12}>
              {specifications.map((specification, index) => (
                <Row key={index} className="mt-2">
                  <Col>
                    <Form.Group controlId={`key-${index}`}>
                      <Form.Label className="frmLable">
                        Specification Title :
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={specification.title}
                        className="tapG"
                        placeholder="Enter Specification Title..."
                        onChange={(e) =>
                          handleChange(
                            index,
                            e.target.value,
                            specification.value
                          )
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId={`value-${index}`}>
                      <Form.Label className="frmLable">
                        Specification Value :
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={specification.value}
                        className="tapG"
                        placeholder="Enter Specification Value..."
                        onChange={(e) =>
                          handleChange(
                            index,
                            specification.title,
                            e.target.value
                          )
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col
                    xs={2}
                    className="d-flex align-items-center justify-content-start gap-2"
                  >
                    <Button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeSpecification(index)}
                    >
                      Delete
                    </Button>

                    {specifications.length > 1 && (
                      <>
                        {index !== specifications.length - 1 && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              handleSpecificationsArrayDown(index);
                            }}
                          >
                            <FaArrowDown />
                          </Button>
                        )}
                        {index !== 0 && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              handleSpecificationsArrayUp(index);
                            }}
                          >
                            <FaArrowUp />
                          </Button>
                        )}
                      </>
                    )}
                  </Col>
                </Row>
              ))}
            </Col>

            <Row className="mt-4 stepContent">
              <Col xs={6} className="d-flex justify-content-center">
                <button size="sm" className="btns" onClick={addSpecification}>
                  <IoIosAdd size={20} /> Add Title
                </button>
              </Col>
              <Col xs={6} className="d-flex justify-content-center">
                <Button
                  size="sm"
                  className="btns btn-danger"
                  onClick={() => {
                    handleReset();
                  }}
                >
                  Reset
                </Button>
              </Col>
            </Row>

            <Row className="stepContent mt-2">
              <Col xs={6}>
                <Form.Group>
                  <Form.Label className="frmLable">
                    Product M.R.P Price :
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    value={productPrice}
                    placeholder="Enter Product Price"
                    className="tapG"
                    onChange={(e) => setproductPrice(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group>
                  <Form.Group controlId="formFileMultiple" className="mb-3">
                    <Form.Label className="frmLable">
                      Choose Multiple Files
                    </Form.Label>
                    <Form.Control
                      type="file"
                      className="tapG"
                      multiple
                      onChange={handleFileImageChange}
                    />
                  </Form.Group>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Row>
                  {productImges?.length > 0 &&
                    productImges?.map((ele, index) => (
                      <Col key={IndeterminateCheckBox} xs={2}>
                        <span>
                          <MdCancel
                            style={{
                              color: "red",
                              fontSize: "20px",
                              cursor: "pointer",
                            }}
                            onClick={() => deleteImage(index)}
                          />
                        </span>
                        <Image
                          src={ele?.image_path}
                          thumbnail
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "contain",
                          }}
                        />
                      </Col>
                    ))}
                </Row>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col xs={6} className="d-flex justify-content-center">
                {isEdit ? (
                  <Button variant="dark" size="sm" onClick={EdithandleSubmit}>
                    Update Form
                  </Button>
                ) : (
                  <button className="btns2" onClick={handleSubmit}>
                    Request Variant
                  </button>
                )}
              </Col>

              <Col xs={6} className="d-flex justify-content-center">
                <Button
                  size="sm"
                  className="btns2"
                  onClick={() => {
                    handleReset();
                  }}
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </Row>
        </Col>

        <Row className="mt-4">
          <Col xs={12} className="mt-4">
            <Row>
              <Col>
                <Button size="sm" variant="secondary" className="cancelbtn">
                  CANCEL
                </Button>
              </Col>
              <Col className="d-flex justify-content-end">
                <Button
                  size="sm"
                  variant="success"
                  type="submit"
                  onClick={() => nextToCustomized()}
                >
                  SAVE & NEXT{" "}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default NewProductVariation;
