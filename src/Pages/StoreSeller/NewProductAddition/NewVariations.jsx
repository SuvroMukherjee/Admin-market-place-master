import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Row, Spinner } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { FaInfoCircle } from "react-icons/fa";
import { IoIosAdd, IoMdCloseCircle } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import {
  DeleteProductSpecification,
  FileUpload,
  ProductSpecificationCreate,
  UpdateProductSpecification,
  sellerNewAddedProductDtails,
} from "../../../API/api";
import { addOrdinalSuffix } from "../../../common/RatingAvg";
import "./newproduct.css";

const NewVariations = ({
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
  const SellerNewProductId = localStorage.getItem("Seller-productId") || "";

  const [productPrice, setproductPrice] = useState(0);

  const [isEdit, setIsEdit] = useState(false);

  const [productImges, setProductImages] = useState([]);

  const [selectedSpecId, setSelectedSpecId] = useState();

  const [addedVariants, setAddedVariants] = useState([]);

  const { id: productId } = useParams();

  const [uploading,setImageUploading] = useState(false)

  useEffect(() => {
    getProductdata();
  }, []);

  const navigate = useNavigate();

  async function getProductdata() {
    let res = await sellerNewAddedProductDtails(productId || SellerNewProductId);
    console.log(res?.data?.data?.specId, "productData");
    setAddedVariants(res?.data?.data?.specId);
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

  const validate = () => {
    if (!productId || !SellerNewProductId) {
      toast.error("Please create product id");
      return false;
    }

    if (specifications.length == 0) {
      toast.error("Please add atleast one specification");
      return false;
    }

    specifications.forEach((specification) => {
      if (
        specification.title.trim() == "" ||
        specification.value.trim() == ""
      ) {
        toast.error("Please add title & value for each specification");
        return false;
      }
    });

    if (!productPrice || productPrice <= 0) {
      toast.error("Please add product price");
      return false;
    }

    if (productImges.length <= 0) {
      toast.error("Please upload atleast one image");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    console.log("Submitted Data:", specifications);

    if (!validate()) {
      console.log("Invalid");
      return;
    }



    let payload = {
      productId: productId || SellerNewProductId,
      spec_det: specifications,
      price: productPrice,
      image: productImges,
      skuId: generateRandomKey(),
      // user_choice:false,
    };

    payload["product_type"] = "sellerNewProducts";

    console.log(payload);

    let res = await ProductSpecificationCreate(payload);

    if (res?.data?.error) {
      toast.error("Something went wrong..");
    } else {
      toast.success("Specifications Added successfully");
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
    setTimeout(() => {
      navigate(
        `/seller/seller-ownproduct-status/new-customization/${productId || SellerNewProductId}`
      );
    }, 1500);
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
      setImageUploading(true)
      const res = await FileUpload(formData);
      console.log(res?.data?.data);

      setTimeout(() => {
        setProductImages((prevData) => [
          ...prevData,
          { image_path: res?.data?.data?.fileurl },
        ]);
        setImageUploading(false)
      }, 1500);
    } catch (err) {
      console.error(err, "err");
    } finally {
      setTimeout(() => {
        setImageUploading(false)
      }, 1500);
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

  const EditHandler = (id) => {
    setSelectedSpecId(id);
    setIsEdit(true);
    let filterSpecData = selectedproductid?.specId?.find((ele) => {
      return ele?._id == id;
    });
    setSpecifications(filterSpecData?.spec_det);
    setProductImages(filterSpecData?.image);
    setproductPrice(filterSpecData?.price);
    console.log(filterSpecData);
  };

  const deleteSpec = async (id) => {
    let res = await DeleteProductSpecification(id);
    console.log(res);
    if (res?.data?.error) {
      toast.error("Something went wrong..");
    } else {
      toast.success("Spec delete successfully");
      handleCloseModal();
    }
  };


  const resetAll = () =>{
    localStorage.removeItem('Seller-productId');
    navigate('/seller/seller-ownproduct-status/new-add')
  }

  return (
    <>
      <Container>
        <Row className="m-4 p-4 justify-content-md-center stepContent paddingConatiner">
          {!productId && !SellerNewProductId && (
            <Row>
              <Col className="text-center noproductIdText">
                <span className="mx-4">
                  <FaInfoCircle color="#7D0A0A" size={25} />
                </span>{" "}
                Product Id is missing.Please Go the First Step and then try to
                uplaod or{" "}
                <span
                  style={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    color: "darkred",
                  }}
                  onClick={() =>
                    navigate("/seller/seller-ownproduct-status/new-add")
                  }
                >
                  request for new Product
                </span>
              </Col>
            </Row>
          )}
          <Col>
            <Row className="mt-2">
              <Col xs={12}>
                {specifications.map((specification, index) => (
                  <Row key={index} className="mt-2">
                    <Col xs={2}></Col>
                    <Col>
                      <Form.Group controlId={`key-${index}`}>
                        <Form.Label className="frmLable">
                          Specification Title :
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={specification.title}
                          className="tapG"
                          placeholder="Enter Specification title..."
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
                          Specification Option :
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={specification.value}
                          className="tapG"
                          placeholder="Enter Specification option..."
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
                      className="d-flex align-items-end justify-content-start"
                    >
                      <IoMdCloseCircle
                        size={26}
                        onClick={() => removeSpecification(index)}
                      />
                    </Col>
                    {/* <Col>
                                    <IoMdCloseCircle size={26} onClick={() => removeSpecification(index)} />
                                </Col> */}
                  </Row>
                ))}
              </Col>
              <Row className="mt-2 stepContent">
                <Col xs={2}></Col>
                <Col xs={3}>
                  <button size="sm" className="btns" onClick={addSpecification}>
                    <IoIosAdd size={20} /> Add Title
                  </button>
                </Col>
              </Row>
              <Row className="stepContent mt-2">
                <Col xs={2}></Col>
                <Col>
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
                <Col>
                  <Form.Group>
                    <Form.Group controlId="formFileMultiple" className="mb-3">
                      <Form.Label className="frmLable">
                        Choose Multiple Files <span className="mx-4">{uploading ? <Spinner size="lg" animation="border" role="status" className="spinner-border spinner-border-md text-secondary" /> : null}</span>
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
                <Col xs={2}></Col>
              </Row>

              <Row>
                <Col xs={2}></Col>
                <Col>
                  <Row>
                    {productImges?.length > 0 &&
                      productImges?.map((ele, index) => (
                        <Col key={index} xs={2}>
                          {/* <span>{index + 1}</span> */}
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
                <Col xs={12} className="d-flex justify-content-center">
                  {isEdit ? (
                    <Button variant="dark" size="sm" onClick={EdithandleSubmit}>
                      Update Form
                    </Button>
                  ) : (
                    <button className="btns2" onClick={handleSubmit}>
                      Complete Variant
                    </button>
                  )}
                </Col>
              </Row>
            </Row>
          </Col>

          {addedVariants?.length > 0 && (
            <Col xs={2}>
              <Row>
                {addedVariants?.map((ele, index) => (
                  <Row key={index} className="mt-2 p-2 specborder">
                    <Col xs={12} className="specHeader mb-2">
                      {addOrdinalSuffix(index + 1)} Variant
                    </Col>
                    <Col>
                      <Row>
                        <Col xs={4}>
                          <Image
                            src={ele?.image?.[0]?.image_path}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "contain",
                            }}
                          />
                        </Col>
                        <Col className="specText d-flex align-items-end">
                          Price : ₹ {ele?.price?.toLocaleString()}
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        {ele?.spec_det?.map((e) => (
                          <Col key={e?._id} className="specText">
                            {e?.title}: {e?.value}
                          </Col>
                        ))}
                      </Row>
                    </Col>
                  </Row>
                ))}
              </Row>
            </Col>
          )}

          <Row className="mt-2">
            <Col xs={12} className="mt-4">
              <Row>
                <Col>
                  <Button size="sm" variant="secondary" className="cancelbtn" onClick={()=> resetAll()}>
                    Reset All
                   
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
        <Toaster position="top-right" />
      </Container>
    </>
  );
};

export default NewVariations;
