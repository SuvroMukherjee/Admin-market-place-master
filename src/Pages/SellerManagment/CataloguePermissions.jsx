import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";
import {
  AdminSellerLists,
  getSellerCategoryRequest,
  UpdateSellerCategoryRequestList,
} from "../../API/api";
import "./Seller.css";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { Toaster } from "react-hot-toast";

const CataloguePermissions = () => {
    const [sellerLists, setSellerLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeButton, setActiveButton] = useState("pending");
    const [requestData, setRequestData] = useState([]);
    const [oiriginalData, setOriginalData] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState();
  
    useEffect(() => {
      getAllSellersList();
      getSellerCategoryRequestList();
    }, []);
  
    let filteredData = [...requestData] || [];
  
    async function getSellerCategoryRequestList() {
      try {
        const res = await getSellerCategoryRequest();
        setRequestData(
          res?.data?.data?.filter((ele) => ele?.status === "pending") || []
        );
        setOriginalData(res?.data?.data || []);
      } catch (error) {
        console.error("Error fetching seller category data:", error);
      }
    }
  
    async function getAllSellersList() {
      try {
        const res = await AdminSellerLists();
        const filteredData = res?.data?.data
          ?.filter((seller) => seller?.status === "approved")
          ?.sort((a, b) => a?.user_name.localeCompare(b?.user_name));
        setSellerLists(filteredData);
      } catch (error) {
        console.error("Error fetching seller list:", error);
      } finally {
        setLoading(false);
      }
    }
  
    const handleButtonClick = (buttonType) => {
      setActiveButton(buttonType);
      setSelectedSeller("");
  
      let filteredData = [...oiriginalData]; // Working with the original data
  
      // Filter the data based on the selected status
      if (buttonType === "pending") {
        filteredData = filteredData.filter((ele) => ele?.status === "pending");
      } else if (buttonType === "approved") {
        filteredData = filteredData.filter((ele) => ele?.status === "approved");
      } else if (buttonType === "rejected") {
        filteredData = filteredData.filter((ele) => ele?.status === "rejected");
      }
  
      setRequestData(filteredData); // Update the state with filtered data
    };
  
    const handleStatusChange = async (row, status) => {
      console.log("Handle status change for:", row);
  
      let payload = {
        requestId: row?._id,
        status: status,
      };
  
      try {
        const res = await UpdateSellerCategoryRequestList(payload);
  
        console.log(res?.data?.data, "ddddd");
        if (res?.response?.data?.error) {
          toast.error(res?.response?.data?.data || "Seller Permission Not Added");
        } else {
          toast.success(res?.data?.message || "Seller Permission Added");
        }
      } catch (error) {
        console.error("Error updating seller status:", error);
        toast.error("An error occurred while updating the seller status.");
      } finally {
        getSellerCategoryRequestList();
      }
    };
  
    const handleSelectSeller = (e) => {
      setSelectedSeller(e.target.value);
      const selectedSellerId = e.target.value;
      let filteredData = [...oiriginalData];
  
      // If no seller is selected, show all sellers of the active status
      if (selectedSellerId === "") {
        filteredData = filteredData.filter(
          (seller) => seller?.status === activeButton
        );
      } else {
        // Filter by selected seller and active status
        filteredData = filteredData.filter(
          (seller) =>
            seller?.sellerId?._id === selectedSellerId &&
            seller?.status === activeButton
        );
      }
  
      setRequestData(filteredData); // Update the state with filtered data
    };
  
    return (
      <div className="productList mt-2 p-4 mt-4">
        {loading ? (
          <div className="productList p-4 contentLoader">
            <Row>
              <Col className="text-center">
                <Spinner animation="border" size="lg" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Col>
            </Row>
          </div>
        ) : (
          <Container>
            <Row className="justify-content-center mb-2">
              <h4 className="text-center">Seller Catalogue Panel</h4>
            </Row>
            <Row className="mb-3">
              <Col xs={8}>
                <ButtonGroup>
                  <Button
                    variant={activeButton === "pending" ? "dark" : "outline-dark"}
                    onClick={() => handleButtonClick("pending")}
                    size="sm"
                  >
                    Pending
                  </Button>
                  <Button
                    variant={activeButton === "approved" ? "dark" : "outline-dark"}
                    onClick={() => handleButtonClick("approved")}
                    size="sm"
                  >
                    Approved
                  </Button>
                  <Button
                    variant={activeButton === "rejected" ? "dark" : "outline-dark"}
                    onClick={() => handleButtonClick("rejected")}
                    size="sm"
                  >
                    Rejected
                  </Button>
                </ButtonGroup>
              </Col>
              <Col
                xs={2}
                className="bg-dark text-light d-flex justify-content-center align-items-center"
              >
                Total Requested: {filteredData?.length}
              </Col>
            </Row>
            <Row className="mt-4">
                <p className="fw-bold">Filter by seller</p>
              <Col xs={4}>
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleSelectSeller}
                  value={selectedSeller}
                >
                  <option value={""}>All</option>
                  {sellerLists?.length > 0 &&
                    sellerLists?.map((seller) => (
                      <option key={seller?._id} value={seller?._id}>
                        {seller?.user_name}
                      </option>
                    ))}
                </Form.Select>
              </Col>
            </Row>
            <Row className="mt-4">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Seller Name</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Status</th>
                    {activeButton === "pending" && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredData?.length > 0 ? (
                    filteredData.map((row) => (
                      <tr key={row?._id}>
                        <td>{row?.sellerId?.user_name}</td>
                        <td>
                          {row?.categories?.map((cat) => cat?.title).join(", ")}
                        </td>
                        <td>{row?.brand?.map((br) => br?.title).join(", ")}</td>
                        <td>
                          {row?.status === "approved" && (
                            <span className="ActiveStatus">Approved</span>
                          )}
                          {row?.status === "rejected" && (
                            <span className="DeactiveStatus">Rejected</span>
                          )}
                          {row?.status === "pending" && (
                            <span className="PendingStatus">Pending</span>
                          )}
                        </td>
                        {activeButton === "pending" && (
                          <td className="d-flex justify-content-center align-items-center gap-4">
                            <Button
                              variant="danger"
                              onClick={() => handleStatusChange(row, "rejected")}
                              size="sm"
                            >
                              Reject
                            </Button>
  
                            <Button
                              variant="success"
                              onClick={() => handleStatusChange(row, "approved")}
                              size="sm"
                            >
                              Approve
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Row>
          </Container>
        )}
        <Toaster position="top-right" />
      </div>
    );
  };
  
  export default CataloguePermissions;
  