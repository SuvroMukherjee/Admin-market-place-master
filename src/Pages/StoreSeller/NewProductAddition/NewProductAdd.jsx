import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FileUpload,
  SellerCreateOwn,
  allBrandList,
  allCategoryList,
  getSubCategoryByCategory,
  sellerNewAddedProductDtails,
} from "../../../API/api";
import useAuth from "../../../hooks/useAuth";
import "../../SellerRegistration/registration.css";
import "./newproduct.css";

const NewProductAdd = () => {
  const [formData, setFormData] = useState();

  const [loading, setLoading] = useState(true);

  const [allcategoryList, setAllCategoryList] = useState([]);
  const [allSubcategorylist, setSubCatgoryList] = useState([]);
  const [allbrandList, setAllBrandList] = useState([]);
  const [openNewCat, setOpenNewCat] = useState(false);
  const [openNewBrand, setOpenNewCatBrand] = useState(false);
  const [imageUploading,setImageUploading] = useState(false)

  const { auth } = useAuth();

  const navigate = useNavigate();

  const SellerNewProductId = localStorage.getItem("Seller-productId") || "";

  useEffect(() => {
    getCategoryList();
    getBrandList();
  }, []);

  useEffect(() => {
    if(SellerNewProductId !== ""){
    getProductdata()
    }
  }, [SellerNewProductId])

  async function getProductdata() {
    let res = await sellerNewAddedProductDtails(SellerNewProductId);
    console.log(res?.data?.data, 'productData')
    setFormData(res?.data?.data)
}


  async function getCategoryList() {
    await allCategoryList()
      .then((res) => {
        let filterData = res?.data?.data
          .filter((item) => item?.status == true)
          ?.sort((a, b) => a?.title?.localeCompare(b?.title));
        console.log(filterData);
        setAllCategoryList(filterData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function getSubCategoryList(CategoryId) {
    console.log(CategoryId);
    await getSubCategoryByCategory(CategoryId)
      .then((res) => {
        let filterData = res?.data?.data
          .filter((item) => item?.status == true)
          ?.sort((a, b) => a?.title?.localeCompare(b?.title));
        setSubCatgoryList(filterData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "categoryId") {
      getSubCategoryList(value);
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function getBrandList() {
    await allBrandList()
      .then((res) => {
        let filterData = res?.data?.data
          .filter((item) => item?.status == true)
          ?.sort((a, b) => a?.title?.localeCompare(b?.title));
        setAllBrandList(filterData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleImageInputChange = (e) => {
   
    const { files } = e.target;
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const selectedFiles = Array.from(files).filter((file) =>
      allowedTypes.includes(file.type)
    );

    selectedFiles.forEach((file) => {
      onFileUpload(file);
    });
  };

  const onFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setImageUploading(true)
      const res = await FileUpload(formData);
      setTimeout(() => {
        setFormData((prevData) => ({
          ...prevData,
          image: [
            ...(prevData?.image || []),
            { image_path: res?.data?.data?.fileurl },
          ],
        }));
        setImageUploading(false)
      }, 2000);
     

    } catch (err) {
      console.error(err, "err");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData["sellerId"] = auth?.userId;
    console.log("formdata details", formData);

    const res = await SellerCreateOwn(formData);

    if (res?.response?.data?.error) {
      toast.error(res?.response?.data?.message);
    } else {
      toast.success("Product Added successfully");
      // setTimeout(() => {
      //     navigate(`/seller/seller-ownproduct-status/new-variations/${res?.data?.data?._id}`)
      // }, 1500);
      localStorage.setItem("Seller-productId", res?.data?.data?._id);
      setTimeout(() => {
        navigate(
          `/seller/seller-ownproduct-status/new-description/${res?.data?.data?._id}`
        );
      }, 1500);
    }
  };

  const resetAll = () =>{
    localStorage.removeItem('Seller-productId');
    navigate('/seller/seller-ownproduct-status/new-add')
  }

  return (
    <Container>
      <Row className="m-4 p-4 justify-content-md-center stepContent paddingConatiner">
        <Container className="w-80">
          <Form onSubmit={handleSubmit}>
            <Row className="mt-3">
              <Col xs={12}>
                <Form.Group controlId="user_name">
                  <Row>
                    <Col
                      xs={3}
                      className="d-flex align-items-center justify-content-end"
                    >
                      <Form.Label>
                        {" "}
                        <span className="req mx-1">*</span> Prouduct Name
                      </Form.Label>
                    </Col>
                    <Col xs={6}>
                      <Form.Control
                        type="text"
                        name="name"
                        className="tapG"
                        placeholder="Enter Product Name"
                        size="sm"
                        value={formData?.name}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={12}>
                <Form.Group controlId="email">
                  <Row>
                    <Col
                      xs={3}
                      className="d-flex align-items-center justify-content-end"
                    >
                      <Form.Label>
                        <span className="req mx-1">*</span> Product Type{" "}
                      </Form.Label>
                    </Col>
                    <Col xs={6}>
                      <Form.Control
                        type="text"
                        name="type"
                        size="sm"
                        className="tapG"
                        placeholder="Enter Product Type"
                        value={formData?.type}
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
                <Form.Group controlId="email">
                  <Row>
                    <Col
                      xs={3}
                      className="d-flex align-items-center justify-content-end"
                    >
                      <Form.Label>
                        <span className="req mx-1">*</span>Product Front Image{" "}
                      </Form.Label>
                    </Col>
                    <Col xs={6}>
                      <span className="specTextsmall ms-2">
                        {formData?.image?.length || 0} images Uploaded  <span className="mx-4">{imageUploading ? <Spinner size="md" animation="border" role="status" className="spinner-border spinner-border-sm text-secondary" /> : null}</span>
                      </span>
                      <Form.Control
                        type="file"
                        onChange={handleImageInputChange}
                        multiple
                        accept="image/jpeg, image/png, image/gif"
                      />
                      <Form.Text className="text-muted">
                        Add images one by one or Select multiple images.
                      </Form.Text>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={12}>
                <Row>
                  <Col xs={12}>
                    <Form.Group controlId="email">
                      <Row>
                        <Col
                          xs={3}
                          className="d-flex align-items-center justify-content-end"
                        >
                          <Form.Label>
                            <span className="req mx-1">*</span> Category{" "}
                          </Form.Label>
                        </Col>
                        <Col xs={6}>
                          <Form.Control
                            as="select"
                            name="categoryId"
                            size="sm"
                            className="tapG"
                            value={formData?.categoryId}
                            onChange={handleChange}
                            required
                          >
                            <option value="" disabled selected>
                              Select Category
                            </option>
                            {allcategoryList?.length > 0 &&
                              allcategoryList?.map((ele) => (
                                <option key={ele?._id} value={ele?._id}>
                                  {ele?.title}
                                </option>
                              ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                  <Row className="mt-1">
                    <Col xs={3}></Col>
                    <Col
                      xs={6}
                      className="text-end reqText"
                      onClick={() => navigate("/seller/category-request/")}
                    >
                      Request for New Category?
                    </Col>
                  </Row>
                  <Col xs={12} className="mt-2">
                    <Form.Group controlId="email">
                      <Row>
                        <Col
                          xs={3}
                          className="d-flex align-items-center justify-content-end"
                        >
                          <Form.Label>
                            <span className="req">*</span> Subcategory{" "}
                          </Form.Label>
                        </Col>
                        <Col xs={6}>
                          <Form.Control
                            as="select"
                            name="subcategoryId"
                            size="sm"
                            value={formData?.subcategoryId}
                            onChange={handleChange}
                            disabled={!formData?.categoryId}
                          >
                            <option value="" disabled selected>
                              Select Sub Category
                            </option>
                            {allSubcategorylist?.length > 0 &&
                              allSubcategorylist?.map((ele) => (
                                <option key={ele?._id} value={ele?._id}>
                                  {ele?.title}
                                </option>
                              ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mt-1">
              <Col xs={3}></Col>
              <Col
                xs={6}
                className="text-end reqText"
                onClick={() => navigate("/seller/subcategory-request/")}
              >
                Request for New Sub Category?
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={12}>
                <Form.Group controlId="email">
                  <Row>
                    <Col
                      xs={3}
                      className="d-flex align-items-center justify-content-end"
                    >
                      <Form.Label>
                        <span className="req mx-1">*</span>Brand{" "}
                      </Form.Label>
                    </Col>
                    <Col xs={6}>
                      <Form.Control
                        as="select"
                        name="brandId"
                        size="sm"
                        value={formData?.brandId}
                        onChange={handleChange}
                      >
                        <option value="" disabled selected>
                          Select Brand
                        </option>
                        {allbrandList?.length > 0 &&
                          allbrandList?.map((ele) => (
                            <option key={ele?._id} value={ele?._id}>
                              {ele?.title}
                            </option>
                          ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-1">
              <Col xs={3}></Col>
              <Col
                xs={6}
                className="text-end reqText"
                onClick={() => navigate("/seller/brand-request/")}
              >
                Request for New Brand Listing?
              </Col>
            </Row>

            <Row className="mt-2">
              <Col xs={12} className="mt-4">
                <Row>
                  <Col>
                    <Button size="sm" variant="secondary" className="cancelbtn" onClick={()=> resetAll()}>
                      Reset All
                    </Button>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <Button size="sm" variant="success" type="submit">
                      SAVE & NEXT{" "}
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Container>
      </Row>
      <Toaster position="top-right" />
    </Container>
  );
};

export default NewProductAdd;
