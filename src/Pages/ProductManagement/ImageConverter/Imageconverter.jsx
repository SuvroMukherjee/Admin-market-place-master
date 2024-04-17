import { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { FaRegCopy } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { toast } from "react-toastify";
import { FileUpload } from "../../../API/api";

const Imageconverter = () => {
  const [formData, setFormData] = useState({
    image: [],
  });

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

    toast.dismiss();

    toast
      .promise(
        FileUpload(formData),
        {
          pending: "Processing Image...",
          success: "Done Processing Image",
          error: "Some thing went wrong",
        },
        {
          position: "bottom-right",
          theme: "colored",
        }
      )
      .then((res) => {
        setTimeout(() => {
          setFormData((prevData) => ({
            ...prevData,
            image: [...prevData.image, res?.data?.data?.fileurl],
          }));
        }, 3000);
      })
      .catch((err) => {
        console.error(err, "err");
      });
  };

  const handleCancelImage = (url) => {
    let filterData = formData.image?.filter((e) => {
      return e !== url;
    });

    setFormData((prevData) => ({
      ...prevData,
      image: filterData,
    }));
  };

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (formData.image.length === 0) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [formData]);

  return (
    <div className="productList mt-2 p-4">
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h3>Convert Your Images</h3>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row className="mt-2">
          <Col xs={6}>
            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Label>Multiple Images</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageInputChange}
                ref={fileInputRef}
                multiple
                accept="image/jpeg, image/png, image/gif"
              />
              <Form.Text className="text-muted">
                Add images one by one or Select multiple images.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col className="d-flex justify-content-start align-items-center gap-4">
            <Button
              onClick={() => {
                setFormData({ image: [] });
              }}
            >
              Reset
            </Button>
            {formData?.image?.length > 1 && (
              <Button
                onClick={() => {
                  if (formData?.image?.length == 0) {
                    toast.error("No Images to Copy", {
                      position: "bottom-right",
                      style: {
                        background: "red",
                        color: "#fff",
                      },
                    });
                    return;
                  }
                  navigator.clipboard.writeText(formData?.image?.toString());
                  toast.dismiss();
                  toast.success("Copied All urls to clipboard", {
                    position: "bottom-right",
                    style: {
                      background: "green",
                      color: "#fff",
                    },
                  });
                }}
              >
                Copy All
              </Button>
            )}
          </Col>
        </Row>

        <Table
          responsive
          style={{
            border: "1px solid #ccc",
          }}
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Preview</th>
              <th>Url</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {formData?.image?.map((fileUrl, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={fileUrl}
                    alt="productImage"
                    width={50}
                    height={50}
                  />
                </td>
                <td>
                  <a href={fileUrl} target="_blank" rel="noreferrer">
                    {fileUrl}
                  </a>
                </td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <MdCancel
                      style={{
                        color: "red",
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleCancelImage(fileUrl)}
                    />

                    <FaRegCopy
                      style={{
                        color: "blue",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigator.clipboard.writeText(fileUrl);
                        toast.dismiss();
                        toast.success("Copied url to clipboard", {
                          position: "bottom-right",
                          style: {
                            background: "green",
                            color: "#fff",
                          },
                        });
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {formData?.image?.length == 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  No Images Uploaded Start Uploading some
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default Imageconverter;
