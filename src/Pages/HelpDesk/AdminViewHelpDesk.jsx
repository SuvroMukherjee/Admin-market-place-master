import { useEffect, useRef, useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import { getAllHelpDeskList } from "../../API/api";
const AdminViewHelpDesk = () => {
  const [helpDeskList, setHelpDeskList] = useState([]);
  const [titleArray, setTitleArray] = useState([]);
  const [filteredList, setFilteredList] = useState(null);

  const videoRef = useRef();

  const fetchHelpDeskList = async () => {
    try {
      const response = await getAllHelpDeskList();
      setHelpDeskList(response?.data || []);
      setTitleArray(response?.data?.map((item) => item?.title));
    } catch (error) {
      console.error("Failed to fetch Help Desk data:", error);
    }
  };

  useEffect(() => {
    if (videoRef.current && filteredList?.type === "video") {
      videoRef.current.load(); // Reload the video when URL changes
    }
  }, [filteredList?.url]);

  useEffect(() => {
    fetchHelpDeskList();
  }, []);

  const handleChange = (e) => {
    const selectedTopic = helpDeskList.find(
      (item) => item.title === e.target.value
    );
    setFilteredList(selectedTopic || null);
  };

  return (
    <div className="productList p-4 mt-4">
      <div className="container mt-4">
        <Container>
          {/* <h2 className="text-center mb-4" style={{ color: "#2c3e50" }}>
          Help Center: Find Answers and Resources
        </h2> */}

          <Col xs={12} md={6} className="mt-4">
            <Form.Group>
              <Form.Label>Select a Topic to Learn More</Form.Label>
              <Form.Control as="select" size="lg" onChange={handleChange}>
                <option value="">-- Choose a Topic --</option>
                {titleArray.map((title, index) => (
                  <option key={index} value={title}>
                    {title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>

          {filteredList && (
            <Card className="mt-5">
              <Card.Body>
                <Row>
                  {/* Left Column for Details */}
                  <Col xs={12} md={6}>
                    <div className="mb-3">
                      <h5 className="text-primary">Title</h5>
                      <p>{filteredList?.title}</p>
                    </div>
                    <div className="mb-3">
                      <h5 className="text-primary">Description</h5>
                      <p>{filteredList?.description}</p>
                    </div>
                    <div className="mb-3">
                      <h5 className="text-primary">Module</h5>
                      <p>{filteredList?.module || "General"}</p>
                    </div>
                    <div>
                      <h5 className="text-primary">Content Type</h5>
                      <p>{filteredList?.type?.toUpperCase()}</p>
                    </div>
                  </Col>

                  {/* Right Column for Media */}
                  <Col xs={12} md={6} className="text-center">
                    <h5 className="text-primary mb-4">
                      Access the Resource Below
                    </h5>
                    {filteredList?.type === "video" ? (
                      <video
                        className="w-100 rounded shadow-sm"
                        controls
                        style={{ maxHeight: "300px" }}
                        ref={videoRef}
                      >
                        <source src={filteredList?.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={filteredList?.url}
                        alt={filteredList?.title}
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: "300px" }}
                      />
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Container>
      </div>
    </div>
  );
};

export default AdminViewHelpDesk;
