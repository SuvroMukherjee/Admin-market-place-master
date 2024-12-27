import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  UpdatesellerOwnRegistrationForm,
  allBrandList,
  allcatList,
} from "../../API/api";

const Step5 = ({ prevStep, reg_userdata, getUserdata }) => {
  const [formData, setFormData] = useState({
    commission_data: [{ categoryId: "", commission_rate: "" }],
  });
  const [categorylist, setcategorylist] = useState([]);
  const [brandList, setBrandList] = useState([]);

  useEffect(() => {
    getAllCats();
    fetchAllBrands();
  }, []);

  const navigate = useNavigate();

  async function getAllCats() {
    try {
      const res = await allcatList();
      const filteredData = res?.data?.data
        .filter((cat) => cat?.status)
        .sort((a, b) => a?.title.localeCompare(b?.title));
      setcategorylist(filteredData);
    } catch (err) {
      console.log(err);
    }
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
  const [selectedBrands, setSelectedBrands] = useState([]);

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
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleBrandCheckboxChange = (brandId) => {
    if (selectedBrands.includes(brandId)) {
      setSelectedBrands(selectedBrands.filter((id) => id !== brandId));
    } else {
      setSelectedBrands([...selectedBrands, brandId]);
    }
  };

  const handleSubmit = async () => {
    try {
      let payload = {
        interest_details: {
          categoryId: selectedCategories,
          brandId: selectedBrands,
        },
      };

      console.log(payload);

      let response = await UpdatesellerOwnRegistrationForm(
        payload,
        reg_userdata?._id
      );

      if (response?.response?.data?.error) {
        toast.error(response?.response?.data?.data);
      } else {
        getUserdata(response?.data?.data);
        localStorage.clear();
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.error("Error updating seller registration form:", error);
      toast.error("Error updating seller registration form");
    } finally {
      navigate("/seller-login");
    }
  };

  return (
    <Container>
      <Row>
        <div>
          <Row>
            <Col className="t1">Choose categories you wish to sell</Col>
          </Row>
          <Row className="mt-3">
            {categorylist.map((option) => (
              <Col key={option._id} xs={4} className="mt-2 ">
                <input
                  type="checkbox"
                  className="tapG"
                  id={option._id}
                  name={option.title}
                  checked={selectedCategories.includes(option._id)}
                  onChange={() => handleCheckboxChange(option._id)}
                />
                <label className="mx-2 frmLable" htmlFor={option._id}>
                  {option.title}
                </label>
              </Col>
            ))}
          </Row>
        </div>
        <div className="mt-4">
          <Row>
            <Col className="t1">Choose brands you wish to sell</Col>
          </Row>
          <Row className="mt-3">
            {brandList.map((option) => (
              <Col key={option._id} xs={4} className="mt-2 ">
                <input
                  type="checkbox"
                  className="tapG"
                  id={option._id}
                  name={option.title}
                  checked={selectedBrands.includes(option._id)}
                  onChange={() => handleBrandCheckboxChange(option._id)}
                />
                <label className="mx-2 frmLable" htmlFor={option._id}>
                  {option.title}
                </label>
              </Col>
            ))}
          </Row>
        </div>
      </Row>
      {/* <Row className='mt-4'>
                <Row>
                    <Col className='t1'>Add commission accoding to categories</Col>
                </Row>
                <Row className='mt-2'>
                    <Col xs={12} >
                        <Form.Group controlId="commissionRate">
                            {formData.commission_data.map((item, index) => (
                                <Row key={index} className="mb-2">
                                    <Col xs={4}>
                                        <Form.Label className='frmLable'>category</Form.Label>
                                        <Form.Select
                                            name="categoryId"
                                            value={item.categoryId}
                                            onChange={(e) => handleChange(e, index)}
                                            size='sm'
                                            className='tapG form-control'
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
                                            className='tapG form-control'
                                            name="commission_rate"
                                            value={item.commission}
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
      <Row className="mt-5">
        <Col className="text-center">
          {/* <Button variant="secondary" onClick={prevStep}>Previous</Button>{' '} */}
          <Button
            size="sm"
            className="frmLable grnbg btn-final-submit"
            onClick={() => handleSubmit()}
          >
            Final Submit{" "}
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

export default Step5;
