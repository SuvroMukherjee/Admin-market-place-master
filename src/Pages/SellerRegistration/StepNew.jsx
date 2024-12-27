import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import {
    allBrandList,
  allBrandreqList,
  allcatList,
  createNewSellerPermission,
} from "../../API/api";
import toast, { Toaster } from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import useAuth from "../../hooks/useAuth";

const StepNew = ({ prevStep, getUserdata, nextStep }) => {
  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const { auth } = useAuth();

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
        nextStep();
      }

      // Refresh dat

      // Reset state
      setSelectedCategories([]);
      setSelectedBrands([]);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Row>
            <Col className="t1">Choose categories you wish to sell</Col>
          </Row>

          {/* Categories Section */}
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
        </Col>
      </Row>

      {/* Buttons Section */}
      <Row className="mt-5">
        <Col className="text-center">
          <Button
            size="sm"
            className="frmLable grnbg btn-final-submit mx-2"
            onClick={handleSubmit}
          >
            Next Step
            <span className="mx-2">
              <FaCheckCircle size={20} />
            </span>
          </Button>
        </Col>
      </Row>

      <Toaster position="top-right" />
    </Container>
  );
};

export default StepNew;
