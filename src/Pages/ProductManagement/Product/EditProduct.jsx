import { CKEditor } from "ckeditor4-react";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import toast, { Toaster } from "react-hot-toast";
import { IoIosAdd, IoMdCloseCircle } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import {
  FileUpload,
  GetProductDetails,
  UpdateProduct,
  allBrandList,
  allCategoryList,
  allSubCategoryList,
} from "../../../API/api";

const EditProduct = () => {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    visibility_in_Catalog: "",
    desc: "",
    full_desc: "",
    tax_status: "",
    regular_price: "",
    categoryId: "",
    subcategoryId: "",
    image: [],
    tags: [],
    position: "",
    features: [],
    brandId: "",
    video_link: "",
  });
  const [allcategoryList, setAllCategoryList] = useState([]);
  const [allSubcategorylist, setSubCatgoryList] = useState([]);
  const [allbrandList, setAllBrandList] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { id: productId } = useParams();

  async function getProductDetails() {
    try {
      const res = await GetProductDetails(productId);
      const productData = res?.data?.data?.ProductData;

      console.log(productData, "productData");

      setFormData({
        type: productData?.type,
        name: productData?.name,
        visibility_in_Catalog: "visible",
        desc: productData?.desc,
        full_desc: productData?.full_desc,
        tax_status: productData?.tax_status,
        regular_price: productData?.regular_price,
        categoryId: productData?.categoryId?._id,
        subcategoryId: productData?.subcategoryId?._id,
        image: productData?.image,
        tags: productData?.tags,
        position: productData?.position,
        features: productData?.features,
        brandId: productData?.brandId?._id,
        video_link: productData?.video_link,
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log(formData, "formData");
  }, [formData]);

  useEffect(() => {
    getCategoryList();
    getSubCategoryList();
    getAllBrandLists();
    getProductDetails();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  async function getCategoryList() {
    await allCategoryList()
      .then((res) => {
        setAllCategoryList(res?.data?.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function getSubCategoryList() {
    await allSubCategoryList()
      .then((res) => {
        setSubCatgoryList(res?.data?.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => [setLoading(false)]);
  }

  async function getAllBrandLists() {
    await allBrandList()
      .then((res) => {
        setAllBrandList(res?.data?.data);
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTagInputChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      tags: value.split(",").map((tag) => tag.trim()),
    }));
  };

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
      const res = await FileUpload(formData);
      console.log(res, "res");
      setTimeout(() => {
        setFormData((prevData) => ({
          ...prevData,
          image: [...prevData.image, { image_path: res?.data?.data?.fileurl }],
        }));
      }, 3000);
    } catch (err) {
      console.error(err, "err");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any required fields are blank
    const requiredFields = [
      "type",
      "name",
      "visibility_in_Catalog",
      "desc",
      "tax_status",
      // 'regular_price',
      "categoryId",
      "subcategoryId",
      "brandId",
      "image",
    ];

    if (requiredFields.every((field) => formData[field])) {
      // Filter out blank fields from the formData
      const nonBlankFields = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => {
          if (Array.isArray(value)) {
            return value.length > 0; // For arrays, check if it's not empty
          }
          return value !== "";
        })
      );

      console.log(nonBlankFields);

      try {
        const res = await UpdateProduct(productId, nonBlankFields);
        console.log(res);
        toast.success("Product added successfully!");
        navigate("/Admin/product");
      } catch (err) {
        console.log(err);
        toast.error("An error occurred. Please try again.");
      }
    } else {
      toast.error("Please fill in all required fields.");
    }
  };

  const handleCancelImage = (url) => {
    let filterData = formData.image?.filter((e, index) => {
      return e !== url;
    });

    setFormData((prevData) => ({
      ...prevData,
      image: filterData,
    }));
  };

  const getProductSpefication = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      specifications: data,
    }));
  };

  const handleFeaturesChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      features: value.split(",").map((tag) => tag.trim()),
    }));
  };

  function createMarkup(val) {
    return { __html: val };
  }

  const handleEditorChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      full_desc: event.editor.getData(),
    }));
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
        <Container>
          <Row className="justify-content-md-center">
            <Col md="auto">
              <h3>Edit Product</h3>
            </Col>
          </Row>

          <Row className="justify-content-md-center">
            <Col>
              <Form>
                <Row className="mt-2">
                  <Col>
                    <Form.Group controlId="type">
                      <Form.Label>Type</Form.Label>
                      <Form.Control
                        type="text"
                        name="type"
                        placeholder="Enter product type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId="name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter product name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId="visibility_in_Catalog">
                      <Form.Label>Visibility in Catalog</Form.Label>
                      <Form.Control
                        as="select"
                        name="visibility_in_Catalog"
                        value={formData?.visibility_in_Catalog}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled selected>
                          Select visibility
                        </option>
                        <option value="visible">Visible</option>
                        <option value="hidden">Hidden</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col>
                    <Form.Group controlId="tax_status">
                      <Form.Label>Tax Status</Form.Label>
                      <Form.Control
                        as="select"
                        name="tax_status"
                        value={formData.tax_status}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled selected>
                          Select tax status
                        </option>
                        <option value="taxable">Taxable</option>
                        <option value="non_taxable">Non-taxable</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col>
                    <Form.Group controlId="categoryId">
                      <Form.Label>Category</Form.Label>
                      <Form.Control
                        as="select"
                        name="categoryId"
                        value={formData.categoryId}
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
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId="categoryId">
                      <Form.Label>Sub Category</Form.Label>
                      <Form.Control
                        as="select"
                        name="subcategoryId"
                        value={formData.subcategoryId}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>
                          Select Sub Category
                        </option>
                        {allSubcategorylist
                          ?.filter(
                            (sub) => sub?.category?._id === formData?.categoryId
                          )
                          ?.map((ele) => (
                            <option key={ele?._id} value={ele?._id}>
                              {ele?.title}
                            </option>
                          ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId="categoryId">
                      <Form.Label>Brand</Form.Label>
                      <Form.Control
                        as="select"
                        name="brandId"
                        value={formData.brandId}
                        onChange={handleChange}
                        required
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
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col>
                    <Form.Group controlId="desc">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder="Enter Product description"
                        name="desc"
                        value={formData.desc}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* <Row className='mt-2'>
                                    <Col>
                                        <Form.Group controlId="desc">
                                            {console.log(formData,'formData?.specification')}
                                            <Form.Label>Product Specification Form</Form.Label>
                                            <ProductSpecificationForm getProductSpefication={getProductSpefication} initalData={formData?.specifications}/>
                                        </Form.Group>
                                    </Col>
                                </Row> */}
                {/* <p>{formData?.full_desc} </p> */}
                {formData?.full_desc && (
                  <Row className="mt-4">
                    <Col>
                      <Form.Group controlId="full_desc">
                        <Form.Label>Full Description</Form.Label>
                        <CKEditor
                          // initData={formData?.full_desc || "<p>No content</p>"}
                          initData={
                            <div
                              dangerouslySetInnerHTML={createMarkup(
                                formData?.full_desc
                              )}
                            />
                          }
                          onChange={handleEditorChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                {!formData?.full_desc && (
                  <Row className="mt-4">
                    <Col>
                      <Form.Group controlId="full_desc">
                        <Form.Label>Full Description</Form.Label>
                        <CKEditor
                          // initData={formData?.full_desc || "<p>No content</p>"}
                          initData={
                            <div
                              dangerouslySetInnerHTML={createMarkup(
                                formData?.full_desc
                              )}
                            />
                          }
                          onChange={handleEditorChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                <Row className="mt-2">
                  <Col>
                    <Form.Group controlId="features">
                      <Form.Label>Features</Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder="Enter Product Features"
                        name="features"
                        rows={4}
                        value={formData.features?.join(", ")}
                        onChange={handleFeaturesChange}
                      />
                      <Form.Text className="text-muted">
                        Separate Features with commas (e.g., features1,
                        features2).
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col xs={6}>
                    <Form.Group controlId="formFileMultiple" className="mb-3">
                      <Form.Label>Product Identification Image</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={handleImageInputChange}
                        multiple
                        accept="image/jpeg, image/png, image/gif"
                      />
                      <Form.Text className="text-muted">
                        Add images that can identify this product.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Row>
                    <Col>
                      {formData?.image?.length > 0 && (
                        <Container>
                          <Row>
                            {formData?.image.map((fileUrl, index) => (
                              <Col key={index} xs={4} md={2}>
                                <span>{index + 1}</span>
                                <span>
                                  <MdCancel
                                    style={{
                                      color: "red",
                                      fontSize: "20px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleCancelImage(fileUrl)}
                                  />
                                </span>
                                <Image src={fileUrl?.image_path} thumbnail />
                              </Col>
                            ))}
                          </Row>
                        </Container>
                      )}
                    </Col>
                  </Row>
                </Row>

                <Row className="mt-4">
                  <Col>
                    <Form.Group controlId="desc">
                      <Form.Label>Add Youtube Video Link(optional)</Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder="Add Video Link"
                        name="video_link"
                        value={formData.video_link}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Button
                        variant="success"
                        size="lg"
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubmit(e);
                        }}
                      >
                        Edit Product
                      </Button>
                      <Button
                        variant="danger"
                        size="lg"
                        type="submit"
                        onClick={() => navigate("/Admin/product")}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          <Toaster position="top-right" />
        </Container>
      </div>
    </>
  );
};

const ProductSpecificationForm = ({ getProductSpefication, initalData }) => {
  const [specifications, setSpecifications] = useState([
    {
      key: "",
      value: "",
      user_choice: false,
    },
  ]);

  useEffect(() => {
    setSpecifications([...initalData]);
  }, [initalData]);

  const handleChange = (index, key, value, userChoice) => {
    setSpecifications((prevSpecifications) => {
      const newSpecifications = [...prevSpecifications];
      newSpecifications[index] = { key, value, user_choice: userChoice };
      return newSpecifications;
    });
  };

  const addSpecification = () => {
    setSpecifications((prevSpecifications) => [
      ...prevSpecifications,
      { key: "", value: "", user_choice: false }, // Set user_choice to a default value
    ]);
  };

  const removeSpecification = (index) => {
    setSpecifications((prevSpecifications) => {
      const newSpecifications = [...prevSpecifications];
      newSpecifications.splice(index, 1);
      return newSpecifications;
    });
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", specifications);
    getProductSpefication(specifications);
    // Send the specifications data to your API or perform other actions
  };

  console.log({ specifications });
  console.log([initalData]);

  return (
    <Container>
      {/* <h4>Product Specification Form</h4> */}
      <Row>
        {specifications.map((specification, index) => (
          <Row key={index}>
            <Col>
              <Form.Group controlId={`key-${index}`}>
                <Form.Label>Key:</Form.Label>
                <Form.Control
                  type="text"
                  value={specification.key}
                  onChange={(e) =>
                    handleChange(
                      index,
                      e.target.value,
                      specification.value,
                      specification.user_choice
                    )
                  }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId={`value-${index}`}>
                <Form.Label>Value:</Form.Label>
                <Form.Control
                  type="text"
                  value={specification.value}
                  onChange={(e) =>
                    handleChange(
                      index,
                      specification.key,
                      e.target.value,
                      specification.user_choice
                    )
                  }
                />
                <Form.Text className="text-muted">
                  Separate values with commas (e.g., value1, value2).
                </Form.Text>
              </Form.Group>
            </Col>
            <Col className="d-flex align-items-center">
              <Form.Group controlId={`value-${index}`}>
                <Form>
                  <Form.Check // prettier-ignore
                    type="switch"
                    id={`custom-switch-${index}`}
                    label="User Select Option"
                    checked={specification.user_choice}
                    onChange={(e) =>
                      handleChange(
                        index,
                        specification.key,
                        specification.value,
                        e.target.checked
                      )
                    }
                  />
                </Form>
              </Form.Group>
            </Col>
            <Col className="d-flex align-items-end">
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeSpecification(index)}
              >
                <IoMdCloseCircle size={24} />
              </Button>
            </Col>
          </Row>
        ))}
      </Row>
      <Row className="mt-2">
        <Col xs={3}>
          <Button variant="dark" size="sm" onClick={addSpecification}>
            <IoIosAdd /> Add Specification
          </Button>
        </Col>
        <Col xs={2}>
          <Button variant="dark" size="sm" onClick={handleSubmit}>
            Submit Form
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProduct;
