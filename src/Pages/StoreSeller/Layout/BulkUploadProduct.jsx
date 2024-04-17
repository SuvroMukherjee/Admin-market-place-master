import { saveAs } from "file-saver";
import Papa from "papaparse";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import toast, { Toaster } from "react-hot-toast";
import { BsClipboard2CheckFill } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa";
import { HiDownload } from "react-icons/hi";
import {
  MdCancel,
  MdOutlineFileDownload,
  MdOutlineFileUpload,
  MdOutlineLaunch,
} from "react-icons/md";
import { SlClose } from "react-icons/sl";
import {
  FileUpload,
  OwnProductSellerList,
  sellerProductBulkUpload,
  sellerVariationsBulkUpload,
} from "../../../API/api";
import useAuth from "../../../hooks/useAuth";

const BulkUploadProduct = () => {
  const [loading, setLoading] = useState(false);
  const [variloading, setvariLoading] = useState(false);
  const [productList, setProductList] = useState([]);

  const [show, setShow] = useState(false);
  const [showConverter, setshowConverter] = useState(false);
  const [blkProducts, SetBlkproducts] = useState([]);

  const { auth } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = () => {
    getReqPorducts();
    setShow(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      Papa.parse(file, {
        complete: (result) => {
          // Access the parsed data in result.dat
          console.log({ result });
          SetBlkproducts(result?.data);
        },
        header: true, // Set this to true if your CSV file has headers
      });
      onFileUpload(file);
    }
  };

  const onFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await FileUpload(formData);
      console.log(res?.data?.data);

      setTimeout(() => {
        // setUploadedFile(res?.data?.data);
        productBulkUpload(res?.data?.data?.fileName);
      }, 3000);
    } catch (err) {
      console.error(err, "err");
    }
  };

  const productBulkUpload = async (file) => {
    let payload = {
      file: file,
    };

    let res = await sellerProductBulkUpload(payload);
    console.log(res?.data?.data);
    if (res?.response?.data?.error) {
      toast.error(res?.response?.data?.message);
      setLoading(false);
    } else {
      toast.success("Products Added Successfully");
      setLoading(false);
    }
  };

  const handleFileChangeForVariations = (event) => {
    const file = event.target.files[0];
    if (file) {
      setvariLoading(true);
      Papa.parse(file, {
        complete: (result) => {
          // Access the parsed data in result.dat
          console.log({ result });
        },
        header: true, // Set this to true if your CSV file has headers
      });
      onFileUploadVariations(file);
    }
  };

  const onFileUploadVariations = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await FileUpload(formData);
      console.log(res?.data?.data);

      setTimeout(() => {
        // setUploadedFile(res?.data?.data);
        productvariationsBulkUpload(res?.data?.data?.fileName);
      }, 3000);
    } catch (err) {
      console.error(err, "err");
    }
  };

  const productvariationsBulkUpload = async (file) => {
    let payload = {
      file: file,
    };

    let res = await sellerVariationsBulkUpload(payload);
    console.log(res?.data?.data);
    if (res?.response?.data?.error) {
      toast.error(res?.response?.data?.message);
      setvariLoading(false);
    } else {
      toast.success("Products Added Successfully");
      setvariLoading(false);
    }
  };

  const getReqPorducts = async () => {
    let res = await OwnProductSellerList(auth?.userId);
    console.log(res?.data?.data, "pDara");
    setProductList(res?.data?.data);
  };

  return (
    <div>
      <Container>
        <Row className="mt-4">
          <Col>
            <h4>Choose a template to get started</h4>
          </Col>
        </Row>
      </Container>
      <Container className="mt-4">
        <Row>
          <Col>
            <Card body>
              <Row className="me-2">
                <Col className="cmpgin-title">
                  List products that are not currently in Zoofi's catalogue
                </Col>
              </Row>
              <Row className="mt-2 me-2">
                <Col className="cmpgin-sub-title">
                  Provide your product details and offer information to create
                  new products in Zoofi's catalogue.
                </Col>
              </Row>
              <Row className="mb-2 mt-2">
                <Col className="text-center">
                  <img
                    src="https://media.dev.to/cdn-cgi/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fkfdzyhxhae8c95nwi6go.jpg"
                    className="upImg"
                    alt="cmp_img"
                  />
                </Col>
              </Row>
              <Row>
                <Col className="cmpgin-sub-title">{}</Col>
              </Row>
              <Row>
                <Col className="mt-2">
                  <a href="https://firebasestorage.googleapis.com/v0/b/hire2inspire-62f96.appspot.com/o/MARKETPLACE_1711604427285.csv?alt=media">
                    <button className="w-100 cmpComtinue-temp">
                      <span>
                        <MdOutlineFileDownload size={25} />
                      </span>
                      Download Template
                    </button>{" "}
                  </a>
                </Col>
              </Row>
              <Row>
                <Col className="mt-2">
                  <label
                    htmlFor="fileInput"
                    className="w-100 cmpComtinue text-center"
                  >
                    {loading ? (
                      <Spinner className="mx-2" size="sm" />
                    ) : (
                      <span>
                        <MdOutlineFileUpload size={25} />
                      </span>
                    )}
                    Upload Spreadsheet
                  </label>
                  <input
                    id="fileInput"
                    type="file"
                    accept=".xls,.xlsx,.ods,.csv" // Specify accepted file types here
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </Col>
              </Row>
              {loading && (
                <Row className="mt-2">
                  <Col className="text-center upl">
                    Uploading... {blkProducts?.length - 1} Products
                  </Col>
                </Row>
              )}
            </Card>
          </Col>

          <Col>
            <Card body>
              <Row className="me-2">
                <Col className="cmpgin-title">
                  Listing various iterations by uploading your Product ID
                </Col>
              </Row>
              <Row className="mt-2 me-2">
                <Col className="cmpgin-sub-title">
                  Provide your product details and offer information to create
                  new products in Zoofi's catalogue.
                </Col>
              </Row>
              <Row>
                <Col className="text-center p-2">
                  <img
                    src="https://support.bigcommerce.com/servlet/rtaImage?eid=aAn4O000000CdIP&feoid=00N4O000006F7bx&refid=0EM4O000001YFvJ"
                    className="upImg"
                    alt="cmp_img"
                  />
                </Col>
              </Row>
              <Row>
                <Col className="cmpgin-sub-title">{}</Col>
              </Row>
              <Row>
                <Col className="mt-2">
                  <button
                    className="w-100 cmpComtinue-temp"
                    onClick={handleShow}
                  >
                    <span>
                      <MdOutlineFileDownload size={25} />
                    </span>
                    Download Template
                  </button>
                </Col>
              </Row>
              <Row>
                <Col className="mt-2">
                  <label
                    htmlFor="fileInputvariations"
                    className="w-100 cmpComtinue text-center"
                  >
                    {variloading ? (
                      <Spinner className="mx-2" size="sm" />
                    ) : (
                      <span>
                        <MdOutlineFileUpload size={25} />
                      </span>
                    )}
                    Upload Variations sheet
                  </label>
                  <input
                    id="fileInputvariations"
                    type="file"
                    accept=".xls,.xlsx,.ods,.csv" // Specify accepted file types here
                    style={{ display: "none" }}
                    onChange={handleFileChangeForVariations}
                  />
                </Col>
              </Row>
            </Card>
            <ShowVariationSheets
              show={show}
              handleClose={handleClose}
              productList={productList}
            />
          </Col>

          <Col>
            <Card body>
              <Row className="me-2">
                <Col className="cmpgin-title">
                  Mutliple Image converter and upload to spreedsheet
                </Col>
              </Row>
              <Row className="mt-2 me-2">
                <Col className="cmpgin-sub-title">
                  Provide your product details and offer information to create
                  new products in Zoofi's catalogue.
                </Col>
              </Row>
              <Row>
                <Col className="text-center p-2">
                  <img
                    src="https://cdn.setapp.com/blog/images/how-to-copy-paste-and-cut-on-mac-1200-628.png"
                    className="upImg"
                    alt="cmp_img"
                  />
                </Col>
              </Row>
              <Row>
                <Col className="cmpgin-sub-title">{}</Col>
              </Row>
              <Row>
                {!showConverter ? (
                  <Col
                    className="mt-2"
                    onClick={() => setshowConverter(!showConverter)}
                  >
                    <button className="w-100 cmpComtinue">
                      <span>
                        <MdOutlineLaunch size={25} />
                      </span>{" "}
                      Launch Converter
                    </button>
                  </Col>
                ) : (
                  <Col
                    className="mt-2"
                    onClick={() => setshowConverter(!showConverter)}
                  >
                    <button className="w-100 cmpComtinue">
                      <span>
                        <SlClose size={25} />
                      </span>{" "}
                      Close Converter
                    </button>
                  </Col>
                )}
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
      <Container className="mt-4 p-4 mb-4">
        <ImageConveter showConverter={showConverter} />
      </Container>
      <Toaster />
    </div>
  );
};

const ShowVariationSheets = ({ show, handleClose, productList }) => {
  const [copied, setCopied] = useState(false);
  const [copiedindex, setCopiedIndex] = useState("");

  const copyTextToClipboard = (text, index) => {
    setCopiedIndex(index);
    const textToCopy = text;
    // Create a temporary textarea element
    const textarea = document.createElement("textarea");
    // Set the text content to be copied
    textarea.value = textToCopy;
    // Append the textarea to the body
    document.body.appendChild(textarea);
    // Select the text within the textarea
    textarea.select();
    // Copy the selected text to the clipboard
    document.execCommand("copy");
    // Remove the temporary textarea
    document.body.removeChild(textarea);
    // Set copied state to true
    setCopied(true);
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
      setCopiedIndex("");
    }, 2000);
  };

  const downloadVariationCSV = (ele) => {
    const data = [
      ["productId", "title", "value", "price", "image"],
      [`${ele?.sellerProId}`],
    ];

    const csvContent = data.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `products_${ele?.sellerProId}.csv`);
  };

  const [clickIndex, setClickIndex] = useState();

  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <p className="cmpgin-title">
            Download Variation Template Sheet Accoding to Your Product
          </p>
        </Modal.Header>
        <Modal.Body style={{ height: "70vh", overflow: "scroll" }}>
          <ListGroup size="sm">
            {productList?.length > 0 &&
              productList?.map((ele, index) => (
                <ListGroup.Item className="mt-2" key={index}>
                  <Row className="vHead">
                    <Col>Product Name</Col>
                    <Col>Status</Col>
                    <Col className="text-center">Image</Col>
                    <Col>Product ID</Col>
                    <Col>Cateogry</Col>
                    <Col>Brand</Col>
                    <Col>Variants</Col>
                    <Col xs={2}>Action</Col>
                  </Row>
                  <Row className="vData mt-2">
                    <Col>{ele?.name}</Col>
                    <Col>{ele?.is_approved}</Col>
                    <Col className="text-center">
                      {" "}
                      <img
                        src={ele?.image?.[0]?.image_path}
                        className="appPhoto"
                        width={30}
                        height={30}
                      />
                    </Col>
                    <Col>
                      {ele?.sellerProId}
                      <span className="mx-4">
                        {copied && copiedindex == index ? (
                          <>
                            <BsClipboard2CheckFill size={20} color="green" />
                            <span style={{ fontSize: "10px", color: "green" }}>
                              Copied
                            </span>
                          </>
                        ) : (
                          <>
                            <FaRegCopy
                              style={{
                                cursor: "pointer",
                                color: "darkgoldenrod",
                              }}
                              onClick={() =>
                                copyTextToClipboard(ele?.sellerProId, index)
                              }
                              size={18}
                            />
                          </>
                        )}
                      </span>
                    </Col>
                    <Col>{ele?.categoryId?.title}</Col>
                    <Col>{ele?.brandId?.title}</Col>
                    <Col className="text-center">
                      <Row>
                        <Col xs={12}>{ele?.specId?.length}</Col>
                        {ele?.specId?.length > 0 && (
                          <Col
                            className="variCss"
                            onClick={() => setClickIndex(index)}
                          >
                            <span>view</span>
                          </Col>
                        )}
                      </Row>
                    </Col>
                    <Col xs={2} className="d-flex align-items-center">
                      <p
                        className="downloadClass"
                        onClick={() => downloadVariationCSV(ele)}
                      >
                        <span>
                          <HiDownload size={15} />
                        </span>{" "}
                        Download
                      </p>
                    </Col>
                  </Row>
                  {clickIndex == index && (
                    <Row className="p-4">
                      {ele?.specId?.map((item, index) => (
                        <Col
                          key={index}
                          xs={4}
                          className={
                            "is_approved" in item &&
                            item?.is_approved == "pending"
                              ? "othervariDiv-notApproved"
                              : "othervariDiv"
                          }
                        >
                          <Row>
                            {console.log({ item })}
                            {"is_approved" in item &&
                              item?.is_approved == "pending" && (
                                <Col className="mb-2 mt-2 specborder2" xs={12}>
                                  <h6>Not Approved</h6>
                                </Col>
                              )}
                            <Col
                              xs={5}
                              className="d-flex justify-content-end align-items-center"
                            >
                              <img
                                src={item?.image?.[0]?.image_path}
                                width={80}
                                className="bgofferProductImg3"
                                alt="productImage"
                              />
                            </Col>
                            <Col className="d-flex justify-content-end align-items-center mt-2 mb-2">
                              <Row>
                                <Col xs={12} className="othervariDivName">
                                  {item?.productId?.brandId?.title}{" "}
                                  {item?.productId?.name}{" "}
                                  {item?.spec_det?.length > 0 && (
                                    <span>
                                      (
                                      {item?.spec_det.map(
                                        (item, index, array) => (
                                          <span key={index}>
                                            {item?.value}
                                            {index < array.length - 1
                                              ? ", "
                                              : ""}
                                          </span>
                                        )
                                      )}
                                      )
                                    </span>
                                  )}
                                </Col>
                                <Col className="mt-1 othervariDivNameV" xs={12}>
                                  <span className="othervariDivName">
                                    M.R.P Price
                                  </span>{" "}
                                  : {item?.price?.toLocaleString()}
                                </Col>
                                <Col className="mt-1 othervariDivNameV" xs={12}>
                                  <span className="othervariDivName">
                                    SKU ID
                                  </span>{" "}
                                  : {item?.skuId?.toUpperCase()}
                                </Col>
                                <Col className="mt-1 othervariDivNameV" xs={12}>
                                  <span className="othervariDivName">
                                    Product ID
                                  </span>{" "}
                                  : {item?.productId?.productId?.toUpperCase()}
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      ))}
                    </Row>
                  )}
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const ImageConveter = ({ showConverter }) => {
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

    try {
      const res = await FileUpload(formData);
      setTimeout(() => {
        setFormData((prevData) => ({
          ...prevData,
          image: [...prevData.image, res?.data?.data?.fileurl],
        }));
      }, 3000);
    } catch (err) {
      console.error(err, "err");
    }
  };

  console.log(formData, "formData");

  const fileInputRef = useRef(null);

  const handleCancelImage = (url) => {
    let filterData = formData.image?.filter((e) => {
      return e !== url;
    });

    setFormData((prevData) => ({
      ...prevData,
      image: filterData,
    }));
  };

  useEffect(() => {
    if (formData.image.length === 0) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [formData]);

  return (
    <div>
      {showConverter && (
        <div className="converterBack">
          <Container className="mt-2">
            <Row className="justify-content-md-center">
              <Col md="auto">
                <h3 className="cmpgin-title">Convert Your Images</h3>
              </Col>
            </Row>
          </Container>
          <Container>
            <Row className="mt-2">
              <Col xs={6}>
                <Form.Group controlId="formFileMultiple" className="mb-3">
                  <Form.Label className="cmpgin-title">
                    Multiple Images
                  </Form.Label>
                  <Form.Control
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageInputChange}
                    multiple
                    accept="image/jpeg, image/png, image/gif"
                  />
                  <p className="cmpgin-sub-title">
                    Add images one by one or Select multiple images.
                  </p>
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
                      navigator.clipboard.writeText(
                        formData?.image?.toString()
                      );
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
      )}
    </div>
  );
};

export default BulkUploadProduct;
