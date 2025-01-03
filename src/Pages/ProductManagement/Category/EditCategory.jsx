// import React, { useEffect, useState } from "react";
// import { Button, ButtonGroup, Col, Form, Modal, Row } from "react-bootstrap";
// import toast, { Toaster } from "react-hot-toast";
// import { FileUpload, UpdateProductCategory } from "../../../API/api";

// const EditCategory = ({ showModal, handleClose, data }) => {
//   const [modalData, setModalData] = useState({});

//   useEffect(() => {
//     setModalData(data);
//   }, [data]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     console.log({ modalData });

//     await UpdateProductCategory(modalData, modalData?._id)
//       .then((res) => {
//         console.log({ res });
//         toast.success("Product updated successfully");
//         handleClose();
//       })
//       .catch((err) => {
//         console.log(err);
//         toast.error("Something went wrong!");
//       });
//   };

//   const handleInputChange = (e) => {
//     const { name, type, checked, value } = e.target;

//     setModalData({
//       ...modalData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleFileChange = async (e) => {
//     onFileUpload(e.target.files[0]);
//   };

//   const onFileUpload = async (data) => {
//     const formData = new FormData();
//     formData.append("file", data);
//     await FileUpload(formData)
//       .then((res) => {
//         console.log(res, "res");
//         setModalData({
//           ...modalData,
//           image: { image_path: res?.data?.data?.fileurl },
//         });
//       })
//       .catch((err) => {
//         console.log(err, "err");
//       });
//   };

//   return (
//     <div>
//       <Modal show={showModal} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>{data?.title}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//             <Row className="mt-2">
//               <Form.Group controlId="title">
//                 <Form.Label>Title</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter title"
//                   name="title"
//                   value={modalData?.title || ""}
//                   onChange={handleInputChange}
//                 />
//               </Form.Group>
//             </Row>
//             <Row className="mt-2">
//               <Form.Group controlId="description">
//                 <Form.Label>Description</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={3}
//                   placeholder="Enter description"
//                   name="description"
//                   value={modalData?.description || ""}
//                   onChange={handleInputChange}
//                 />
//               </Form.Group>
//             </Row>
//             <Row className="mt-2">
//               <Form.Group controlId="image">
//                 <Form.Label>Image</Form.Label>
//                 <Col>
//                   <img
//                     src={modalData?.image?.image_path || ""}
//                     alt="category"
//                     style={{ width: "100%" }}
//                   />
//                 </Col>
//                 <Col>
//                   <label>Upload New Image</label>
//                   <input
//                     type="file"
//                     onChange={handleFileChange}
//                     accept="image/jpeg, image/png, image/gif"
//                   />
//                 </Col>
//               </Form.Group>
//             </Row>
//             <Row className="mt-3">
//               <Form.Group
//                 controlId="isOpenBox"
//                 className="d-flex gap-2 justify-items-center"
//               >
//                 <Form.Check
//                   type="checkbox"
//                   name="isOpenBox"
//                   checked={modalData?.isOpenBox || false}
//                   onChange={handleInputChange}
//                   style={{ transform: "scale(1.3)" }}
//                 />
//                 <Form.Label>This Category will be Open Box Delivery</Form.Label>
//               </Form.Group>
//             </Row>
//             <Row className="mt-3">
//               <Form.Group controlId="sgst">
//                 <Form.Label>SGST (%)</Form.Label>
//                 <Form.Control
//                   type="number"
//                   name="sgst"
//                   value={modalData?.sgst || ""}
//                   onChange={handleInputChange}
//                   placeholder="Enter SGST"
//                 />
//               </Form.Group>
//               <Form.Group controlId="cgst">
//                 <Form.Label>CGST (%)</Form.Label>
//                 <Form.Control
//                   type="number"
//                   name="cgst"
//                   value={modalData?.cgst || ""}
//                   onChange={handleInputChange}
//                   placeholder="Enter CGST"
//                 />
//               </Form.Group>
//               <Form.Group controlId="igst">
//                 <Form.Label>IGST (%)</Form.Label>
//                 <Form.Control
//                   type="number"
//                   name="igst"
//                   value={modalData?.igst || ""}
//                   onChange={handleInputChange}
//                   placeholder="Enter IGST"
//                 />
//               </Form.Group>
//             </Row>
//             <Row className="mt-3">
//               <Col>
//                 <ButtonGroup className="d-flex">
//                   <Button
//                     className="btn-block mr-1 mt-1 btn-lg"
//                     variant="warning"
//                     type="submit"
//                     block
//                   >
//                     Update Category
//                   </Button>
//                 </ButtonGroup>
//               </Col>
//             </Row>
//           </Form>
//         </Modal.Body>
//       </Modal>
//       <Toaster position="top-right" />
//     </div>
//   );
// };

// export default EditCategory;

import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Form, Modal, Row } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { FileUpload, UpdateProductCategory } from "../../../API/api";

const EditCategory = ({ showModal, handleClose, data }) => {
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    setModalData(data);
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log({ modalData });

    await UpdateProductCategory(modalData, modalData?._id)
      .then((res) => {
        console.log({ res });
        toast.success("Category updated successfully");
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!");
      });
  };

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;

    setModalData({
      ...modalData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      await FileUpload(formData)
        .then((res) => {
          console.log(res, "res");
          setTimeout(() => {
            setModalData({
              ...modalData,
              image: { image_path: res?.data?.data?.fileurl },
            });
          }, 1000);
        })
        .catch((err) => {
          console.log(err, "err");
        });
    }
  };

  const handleIconChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      await FileUpload(formData)
        .then((res) => {
          console.log(res, "res");
          setTimeout(() => {
            setModalData({
              ...modalData,
              icon: res?.data?.data?.fileurl,
            });
          }, 1000);
        })
        .catch((err) => {
          console.log(err, "err");
        });
    }
  };

  return (
    <div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mt-2">
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  name="title"
                  value={modalData?.title || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Row>
            <Row className="mt-2">
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                  name="description"
                  value={modalData?.description || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Row>
            <Row className="mt-2">
              <Form.Group controlId="image">
                <Form.Label>Image</Form.Label>
                <Col>
                  <img
                    src={modalData?.image?.[0]?.image_path || ""}
                    alt="category"
                    style={{ width: "50px", height: "50px", cursor: "pointer" }}
                    onClick={() =>
                      window.open(
                        `${modalData?.image?.[0]?.image_path}`,
                        "_blank"
                      )
                    }
                  />
                </Col>
                <Col>
                  <label>Upload New Image</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/gif"
                  />
                </Col>
              </Form.Group>
            </Row>
            <Row className="mt-2">
              <Form.Group controlId="icon">
                <Form.Label>Icon</Form.Label>
                <Col>
                  <img
                    src={modalData?.icon || ""}
                    alt="category icon"
                    style={{ width: "50px", height: "50px", cursor: "pointer" }}
                    onClick={() => window.open(`${modalData?.icon}`, "_blank")}
                  />
                </Col>
                <Col>
                  <label>Upload New Icon</label>
                  <input
                    type="file"
                    onChange={handleIconChange}
                    accept="image/jpeg, image/png, image/gif"
                  />
                </Col>
              </Form.Group>
            </Row>
            <Row className="mt-3">
              <Form.Group
                controlId="isOpenBox"
                className="d-flex gap-2 justify-items-center"
              >
                <Form.Check
                  type="checkbox"
                  name="isOpenBox"
                  checked={modalData?.isOpenBox || false}
                  onChange={handleInputChange}
                  style={{ transform: "scale(1.3)" }}
                />
                <Form.Label>This Category will be Open Box Delivery</Form.Label>
              </Form.Group>
            </Row>
            <Row className="mt-3">
              <Form.Group controlId="sgst">
                <Form.Label>SGST (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="sgst"
                  value={modalData?.sgst || ""}
                  onChange={handleInputChange}
                  placeholder="Enter SGST"
                />
              </Form.Group>
              <Form.Group controlId="cgst">
                <Form.Label>CGST (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="cgst"
                  value={modalData?.cgst || ""}
                  onChange={handleInputChange}
                  placeholder="Enter CGST"
                />
              </Form.Group>
              <Form.Group controlId="igst">
                <Form.Label>IGST (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="igst"
                  value={modalData?.igst || ""}
                  onChange={handleInputChange}
                  placeholder="Enter IGST"
                />
              </Form.Group>
            </Row>
            <Row className="mt-3">
              <Col>
                <ButtonGroup className="d-flex">
                  <Button
                    className="btn-block mr-1 mt-1 btn-lg"
                    variant="warning"
                    type="submit"
                    block
                  >
                    Update Category
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
      <Toaster position="top-right" />
    </div>
  );
};

export default EditCategory;
