import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { GrUpdate } from "react-icons/gr";
import { TbCategoryPlus } from "react-icons/tb";
import {
  allBrandList,
  allcatList,
  createNewSellerPermission,
  getPermittedCatalogue,
  getSellerCategoryRequest,
} from "../../../API/api";
import useAuth from "../../../hooks/useAuth";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Permission = () => {
  const { auth } = useAuth();
  console.log({ auth });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [permittedCategoriesIds, setPermittedCategoriesIds] = useState([]);
  const [permittedBrandsIds, setPermittedBrandsIds] = useState([]);
  const [requestedCategories, setRequestedCategories] = useState([]);
  const [requestedBrands, setRequestedBrands] = useState([]);
  const [rejectedCategories, setRejectedCategories] = useState([]);
  const [rejectedBrands, setRejectedBrands] = useState([]);

  useEffect(() => {
    getSellerCategoryRequestList();
    setTimeout(() => {
      getPermittedCatalogueList();
    }, 1000);
  }, []);

  async function getPermittedCatalogueList() {
    try {
      const res = await getPermittedCatalogue(auth?.userId);
      console.log(res?.data?.data, "ddddd");

      setSelectedCategories(res?.data?.data?.categories);
      setSelectedBrands(res?.data?.data?.brand);

      setPermittedCategoriesIds(
        res?.data?.data?.categories?.map((ele) => ele?._id)
      );
      setPermittedBrandsIds(res?.data?.data?.brand?.map((ele) => ele?._id));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  async function getSellerCategoryRequestList() {
    try {
      const res = await getSellerCategoryRequest();
      console.log(res?.data?.data, "requested Data");

      // Filter and map the categories based on the seller ID
      let reqCats = res?.data?.data
        ?.filter(
          (ele) =>
            ele?.sellerId?._id === auth?.userId && ele?.status == "pending"
        )
        ?.map((ele) => ele?.categories)
        .flat(); // Flatten the nested arrays into a single array

      let rejectCats = res?.data?.data
        ?.filter(
          (ele) =>
            ele?.sellerId?._id === auth?.userId && ele?.status == "rejected"
        )
        ?.map((ele) => ele?.categories)
        .flat(); // Flatten the nested arrays into a single array

      console.log(rejectCats, "Flattened reqCats");

      console.log(reqCats, "Flattened reqCats");

      setRequestedCategories(reqCats);

      // Filter and map the brands based on the seller ID
      let reqBrands = res?.data?.data
        ?.filter(
          (ele) =>
            ele?.sellerId?._id === auth?.userId && ele?.status == "pending"
        )
        ?.map((ele) => ele?.brand)
        .flat(); // Flatten the nested arrays into a single array

      let rejectBrands = res?.data?.data
        ?.filter(
          (ele) =>
            ele?.sellerId?._id === auth?.userId && ele?.status == "rejected"
        )
        ?.map((ele) => ele?.brand)
        .flat(); // Flatten the nested arrays into a single array

      setRejectedCategories(rejectCats);
      setRejectedBrands(rejectBrands);

      console.log(reqBrands, "Flattened reqBrands");

      setRequestedBrands(reqBrands);
    } catch (error) {
      console.error("Error fetching seller category data:", error);
    }
  }

  const navigate = useNavigate();

  return (
    <div className="p-4 mt-4 mx-4">
      <div className="d-flex justify-content-end">
        <Button
          variant="dark"
          size="sm"
          className="frmLable float-right"
          onClick={() => navigate("seller/seller-request")}
        >
          <span className="mx-2">
            {" "}
            <IoArrowBack size={25} />{" "}
          </span>{" "}
          Back to Requested Panel
        </Button>
      </div>
      <PermittedCatalogue
        selectedCategories={selectedCategories}
        selectedBrands={selectedBrands}
      />
      <RequestedCatalogue
        requestedCategories={requestedCategories}
        requestedBrands={requestedBrands}
      />

      <RejectedCatalogue
        requestedCategories={rejectedCategories}
        requestedBrands={rejectedBrands}
      />

      <SellingCatalogue
        auth={auth}
        permittedBrandsIds={permittedBrandsIds}
        permittedCategoriesIds={permittedCategoriesIds}
        getPermittedCatalogueList={getPermittedCatalogueList}
        getSellerCategoryRequestList={getSellerCategoryRequestList}
      />
    </div>
  );
};

export default Permission;

const PermittedCatalogue = ({ selectedCategories, selectedBrands }) => {
  console.log({ selectedCategories });

  const [show, setShow] = useState(false);

  return (
    <Container className="mt-4 mb-4">
      <Row>
        <Col>
          <Row
            className="hd bg-success"
            style={{ cursor: "pointer" }}
            onClick={() => setShow(!show)}
          >
            <Col>
              <span className="mx-2">
                <TbCategoryPlus size={25} />
              </span>
              Permitted Categories & Brands
            </Col>
            <Col xs={1}>
              {show ? (
                <IoIosArrowDropup size={30} style={{ cursor: "pointer" }} />
              ) : (
                <IoIosArrowDropdown size={30} style={{ cursor: "pointer" }} />
              )}
            </Col>
          </Row>
          {show && (
            <>
              <Row className="mt-4">
                <p style={{ fontWeight: "bold" }}>
                  Working Categories - {selectedCategories?.length || 0}
                </p>
                <Row>
                  {selectedCategories?.map((option, index) => (
                    <Col key={option?._id} xs={3} className="mt-2">
                      <label className="mx-2 frmLable" htmlFor={option?._id}>
                        {index + 1}. {option?.title}
                      </label>
                    </Col>
                  ))}
                </Row>
              </Row>

              {/* Brands Section */}
              <Row className="mt-4">
                <p style={{ fontWeight: "bold" }}>
                  Working Brands - {selectedBrands?.length || 0}
                </p>
                <Row>
                  {selectedBrands?.map((option, index) => (
                    <Col key={option?._id} xs={2} className="mt-2">
                      <label className="mx-2 frmLable" htmlFor={option?._id}>
                        {index + 1}. {option?.title}
                      </label>
                    </Col>
                  ))}
                </Row>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

const RequestedCatalogue = ({ requestedCategories, requestedBrands }) => {
  const [show, setShow] = useState(false);

  return (
    <Container className="mt-4 mb-4">
      <Row>
        <Col>
          <Row
            className="hd bg-info"
            style={{ cursor: "pointer" }}
            onClick={() => setShow(!show)}
          >
            <Col>
              <span className="mx-2">
                <TbCategoryPlus size={25} />
              </span>
              Requested Categories & Brands
            </Col>
            <Col xs={1}>
              {show ? (
                <IoIosArrowDropup size={30} style={{ cursor: "pointer" }} />
              ) : (
                <IoIosArrowDropdown size={30} style={{ cursor: "pointer" }} />
              )}
            </Col>
          </Row>

          {show && (
            <>
              {/* Categories Section */}
              <Row className="mt-4">
                <p style={{ fontWeight: "bold" }}>
                  Requested Categories - {requestedCategories?.length || 0}
                </p>
                <Row>
                  {requestedCategories?.map((option, index) => (
                    <Col key={option?._id} xs={2} className="mt-2">
                      <label className="mx-2 frmLable" htmlFor={option?._id}>
                        {index + 1}. {option?.title}
                      </label>
                    </Col>
                  ))}
                </Row>
              </Row>

              {/* Brands Section */}
              <Row className="mt-4">
                <p style={{ fontWeight: "bold" }}>
                  Requested Brands - {requestedBrands?.length || 0}
                </p>
                <Row>
                  {requestedBrands?.map((option, index) => (
                    <Col key={option?._id} xs={2} className="mt-2">
                      <label className="mx-2 frmLable" htmlFor={option?._id}>
                        {index + 1}. {option?.title}
                      </label>
                    </Col>
                  ))}
                </Row>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

const RejectedCatalogue = ({ requestedCategories, requestedBrands }) => {
  const [show, setShow] = useState(false);

  return (
    <Container className="mt-4 mb-4">
      <Row>
        <Col>
          <Row
            className="hd bg-danger"
            style={{ cursor: "pointer" }}
            onClick={() => setShow(!show)}
          >
            <Col>
              <span className="mx-2">
                <TbCategoryPlus size={25} />
              </span>
              Rejected Categories & Brands
            </Col>
            <Col xs={1}>
              {show ? (
                <IoIosArrowDropup size={30} style={{ cursor: "pointer" }} />
              ) : (
                <IoIosArrowDropdown size={30} style={{ cursor: "pointer" }} />
              )}
            </Col>
          </Row>

          {show && (
            <>
              {/* Categories Section */}
              <Row className="mt-4">
                <p style={{ fontWeight: "bold" }}>
                  Rejected Categories - {requestedCategories?.length || 0}
                </p>
                <Row>
                  {requestedCategories?.map((option, index) => (
                    <Col key={option?._id} xs={2} className="mt-2">
                      <label className="mx-2 frmLable" htmlFor={option?._id}>
                        {index + 1}. {option?.title}
                      </label>
                    </Col>
                  ))}
                </Row>
              </Row>

              {/* Brands Section */}
              <Row className="mt-4">
                <p style={{ fontWeight: "bold" }}>
                  Rejected Brands - {requestedBrands?.length || 0}
                </p>
                <Row>
                  {requestedBrands?.map((option, index) => (
                    <Col key={option?._id} xs={2} className="mt-2">
                      <label className="mx-2 frmLable" htmlFor={option?._id}>
                        {index + 1}. {option?.title}
                      </label>
                    </Col>
                  ))}
                </Row>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

const SellingCatalogue = ({
  auth,
  permittedCategoriesIds = [],
  permittedBrandsIds = [],
  getPermittedCatalogueList,
  getSellerCategoryRequestList,
}) => {
  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetchAllCategories();
    fetchAllBrands();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const res = await allcatList(); // Ensure this API function is correctly implemented
      const filteredData = res?.data?.data
        ?.filter(
          (category) =>
            category?.status && !permittedCategoriesIds.includes(category?._id)
        )
        ?.sort((a, b) => a?.title.localeCompare(b?.title));
      setCategoryList(filteredData || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories.");
    }
  };

  const fetchAllBrands = async () => {
    try {
      const res = await allBrandList(); // Ensure this API function is correctly implemented
      const filteredData = res?.data?.data
        ?.filter(
          (brand) => brand?.status && !permittedBrandsIds.includes(brand?._id)
        )
        ?.sort((a, b) => a?.title.localeCompare(b?.title));
      setBrandList(filteredData || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Failed to fetch brands.");
    }
  };

  const handleCheckboxChange = (id, type) => {
    const updateState =
      type === "category" ? setSelectedCategories : setSelectedBrands;
    const currentState =
      type === "category" ? selectedCategories : selectedBrands;

    updateState((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        sellerId: auth?.userId,
        categories: selectedCategories,
        brand: selectedBrands,
      };

      const res = await createNewSellerPermission(payload); // Ensure this API function is correctly implemented

      if (res?.response?.data?.error) {
        toast.error(res?.response?.data?.data || "Failed to add permissions.");
      } else {
        toast.success(res?.data?.message || "Permissions added successfully.");
      }

      // Refresh data
      getPermittedCatalogueList();
      getSellerCategoryRequestList();

      // Reset state
      setSelectedCategories([]);
      setSelectedBrands([]);
      setShow(false);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Row
            className="hd bg-warning"
            style={{ cursor: "pointer" }}
            onClick={() => setShow((prev) => !prev)}
          >
            <Col>
              <span className="mx-2">
                <TbCategoryPlus size={25} />
              </span>
              Request New Selling Categories & Brands
            </Col>
            <Col xs={1}>
              {show ? (
                <IoIosArrowDropup size={30} style={{ cursor: "pointer" }} />
              ) : (
                <IoIosArrowDropdown size={30} style={{ cursor: "pointer" }} />
              )}
            </Col>
          </Row>

          {show && (
            <div className="p-3">
              {/* Categories Section */}
              <Row className="mt-3">
                <p style={{ fontWeight: "bold" }}>
                  Select Categories - {selectedCategories.length}
                </p>
                <Row>
                  {categoryList.length ? (
                    categoryList.map((option) => (
                      <Col key={option?._id} xs={3} className="mt-2">
                        <input
                          type="checkbox"
                          id={`category-${option?._id}`}
                          checked={selectedCategories.includes(option?._id)}
                          onChange={() =>
                            handleCheckboxChange(option?._id, "category")
                          }
                        />
                        <label
                          className="mx-2 frmLable"
                          htmlFor={`category-${option?._id}`}
                        >
                          {option?.title}
                        </label>
                      </Col>
                    ))
                  ) : (
                    <p>No available categories to request.</p>
                  )}
                </Row>
              </Row>

              {/* Brands Section */}
              <Row className="mt-4">
                <p style={{ fontWeight: "bold" }}>
                  Select Brands - {selectedBrands.length}
                </p>
                <Row>
                  {brandList.length ? (
                    brandList.map((option) => (
                      <Col key={option?._id} xs={3} className="mt-2">
                        <input
                          type="checkbox"
                          id={`brand-${option?._id}`}
                          checked={selectedBrands.includes(option?._id)}
                          onChange={() =>
                            handleCheckboxChange(option?._id, "brand")
                          }
                        />
                        <label
                          className="mx-2 frmLable"
                          htmlFor={`brand-${option?._id}`}
                        >
                          {option?.title}
                        </label>
                      </Col>
                    ))
                  ) : (
                    <p>No available brands to request.</p>
                  )}
                </Row>
              </Row>

              {/* Submit Button */}
              <Row className="mt-4">
                <Col>
                  <Button
                    variant="dark"
                    size="sm"
                    className="frmLable"
                    onClick={handleSubmit}
                  >
                    Add New Request
                    <span className="mx-2">
                      <GrUpdate />
                    </span>
                  </Button>
                </Col>
              </Row>
            </div>
          )}
        </Col>
      </Row>

      <Toaster position="top-right" />
    </Container>
  );
};
