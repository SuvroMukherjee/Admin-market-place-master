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

const Permission = () => {
  const { auth } = useAuth();
  console.log({ auth });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [requestedCategories, setRequestedCategories] = useState([]);
  const [requestedBrands, setRequestedBrands] = useState([]);

  useEffect(() => {
    getPermittedCatalogueList();
    getSellerCategoryRequestList();
  }, []);

  async function getPermittedCatalogueList() {
    try {
      const res = await getPermittedCatalogue(auth?.userId);
      console.log(res?.data?.data, "ddddd");
      setSelectedCategories(
        res?.data?.data?.categories?.sort((a, b) =>
          a?.title.localeCompare(b?.title)
        )
      );
      setSelectedBrands(
        res?.data?.data?.brand?.sort((a, b) => a?.title.localeCompare(b?.title))
      );
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
        ?.filter((ele) => ele?.sellerId?._id === auth?.userId && ele?.status == "pending")
        ?.map((ele) => ele?.categories)
        .flat(); // Flatten the nested arrays into a single array

      console.log(reqCats, "Flattened reqCats");

      setRequestedCategories(reqCats);

      // Filter and map the brands based on the seller ID
      let reqBrands = res?.data?.data
        ?.filter((ele) => ele?.sellerId?._id === auth?.userId && ele?.status == "pending")
        ?.map((ele) => ele?.brand)
        .flat(); // Flatten the nested arrays into a single array

      console.log(reqBrands, "Flattened reqBrands");

      setRequestedBrands(reqBrands);

      // Sort and set the selected categories
      setSelectedCategories(
        res?.data?.data?.categories?.sort((a, b) =>
          a?.title.localeCompare(b?.title)
        )
      );

      // Sort and set the selected brands
      setSelectedBrands(
        res?.data?.data?.brand?.sort((a, b) => a?.title.localeCompare(b?.title))
      );
    } catch (error) {
      console.error("Error fetching seller category data:", error);
    }
  }

  return (
    <div className="p-4 mt-4 mx-4">
      <PermittedCatalogue
        selectedCategories={selectedCategories}
        selectedBrands={selectedBrands}
      />
      <RequestedCatalogue
        requestedCategories={requestedCategories}
        requestedBrands={requestedBrands}
      />
      <SellingCatalogue auth={auth} />
    </div>
  );
};

export default Permission;

const PermittedCatalogue = ({ selectedCategories, selectedBrands }) => {
  return (
    <Container>
      <Row>
        <Col>
          <Row>
            <Col className="hd">
              <span className="mx-2">
                <TbCategoryPlus size={25} />
              </span>
              Permitted Categories & Brands
            </Col>
          </Row>
          <Row className="mt-4">
            <p style={{ fontWeight: "bold" }}>
              Working Categories - {selectedCategories?.length || 0}
            </p>
            <Row>
              {selectedCategories?.map((option) => (
                <Col key={option?._id} xs={3} className="mt-2">
                  <input
                    type="checkbox"
                    id={option?._id}
                    checked={selectedCategories.includes(option?._id)}
                    // onChange={() => handleCheckboxChange(option?._id)}
                  />
                  <label className="mx-2 frmLable" htmlFor={option?._id}>
                    {option?.title}
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
              {selectedBrands?.map((option) => (
                <Col key={option?._id} xs={2} className="mt-2">
                  <input
                    type="checkbox"
                    id={option?._id}
                    checked={selectedBrands.includes(option?._id)}
                    //  onChange={() => handleBrandCheckboxChange(option?._id)}
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
    </Container>
  );
};

const RequestedCatalogue = ({ requestedCategories, requestedBrands }) => {
  return (
    <Container>
      <Row>
        <Col>
          <Row>
            <Col className="hd">
              <span className="mx-2">
                <TbCategoryPlus size={25} />
              </span>
              Requested Categories & Brands
            </Col>
          </Row>
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
        </Col>
      </Row>
    </Container>
  );
};

const SellingCatalogue = ({ auth }) => {
  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    fetchAllCategories();
    fetchAllBrands();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const res = await allcatList();
      const filteredData = res?.data?.data
        .filter((category) => category?.status)
        .sort((a, b) => a?.title.localeCompare(b?.title));
      setCategoryList(filteredData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchAllBrands = async () => {
    try {
      const res = await allBrandList();
      const filteredData = res?.data?.data
        .filter((brand) => brand?.status)
        .sort((a, b) => a?.title.localeCompare(b?.title));
      setBrandList(filteredData);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleCheckboxChange = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const handleBrandCheckboxChange = (brandId) => {
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(brandId)
        ? prevSelected.filter((id) => id !== brandId)
        : [...prevSelected, brandId]
    );
  };

  const handleSubmit = async () => {
    const payload = {
      sellerId: auth?.userId,
      categories: selectedCategories || [],
      brand: selectedBrands || [],
    };

    let res = await createNewSellerPermission(payload);

    if (res?.response?.data?.error) {
      toast.error(res?.response?.data?.data || "Seller Permission Not Added");
    } else {
      toast.success(res?.data?.message || "Seller Permission Added");
    }

    console.log(payload);
  };

  const [show, setShow] = useState(false);

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Row className="hd">
            <Col>
              <span className="mx-2">
                <TbCategoryPlus size={25} />
              </span>
              Request New Selling Categories & Brands
            </Col>
            <Col xs={1}>
              {!show ? (
                <IoIosArrowDropup
                  size={25}
                  onClick={() => setShow(!show)}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <IoIosArrowDropdown
                  size={25}
                  onClick={() => setShow(!show)}
                  style={{ cursor: "pointer" }}
                />
              )}
            </Col>
          </Row>

          {show && (
            <div className="p-4">
              <Row className="mt-4">
                <p style={{ fontWeight: "bold" }}>
                  Select Categories - {selectedCategories?.length}
                </p>
                <Row>
                  {categoryList?.map((option) => (
                    <Col key={option?._id} xs={3} className="mt-2">
                      <input
                        type="checkbox"
                        id={option?._id}
                        checked={selectedCategories.includes(option?._id)}
                        onChange={() => handleCheckboxChange(option?._id)}
                      />
                      <label className="mx-2 frmLable" htmlFor={option?._id}>
                        {option?.title}
                      </label>
                    </Col>
                  ))}
                </Row>
              </Row>

              {/* Brands Section */}
              <Row className="mt-4">
                <p style={{ fontWeight: "bold" }}>
                  Select Brands - {selectedBrands?.length}
                </p>
                <Row>
                  {brandList?.map((option) => (
                    <Col key={option?._id} xs={2} className="mt-2">
                      <input
                        type="checkbox"
                        id={option?._id}
                        checked={selectedBrands.includes(option?._id)}
                        onChange={() => handleBrandCheckboxChange(option?._id)}
                      />
                      <label className="mx-2 frmLable" htmlFor={option?._id}>
                        {option?.title}
                      </label>
                    </Col>
                  ))}
                </Row>
              </Row>
            </div>
          )}
        </Col>
      </Row>

      {/* Submit Button */}
      {show && (
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
      )}

      <Toaster position="top-right" />
    </Container>
  );
};
