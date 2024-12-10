import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { BsClipboard2CheckFill } from "react-icons/bs";
import { CiClock2 } from "react-icons/ci";
import { FaRegCopy } from "react-icons/fa";
import { MdFileDownloadDone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  OwnProductSellerList,
  sellerBrandRequestList,
  sellerCategoryRequestList,
  subCategoryReqList,
} from "../../../API/api";
import { ChangeFormatDate2 } from "../../../common/DateFormat";
import useAuth from "../../../hooks/useAuth";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

const ApprovalPendingList = () => {
  const [categoryApplicqation, setCategoryApplication] = useState();
  const [SubcategoryApplicqation, setSubCategoryApplication] = useState([]);
  const [type, setType] = useState("");
  const [data, setData] = useState([]);
  const [brandList, setBrandlist] = useState([]);
  const [singleAddedSubCat,setSingleAddedSubCart] = useState([])

  const { auth } = useAuth();

  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const tabtype = queryParams.tabtype;

  useEffect(() => {
    setType(tabtype ?? "category");
  }, [tabtype, location]);

  useEffect(() => {
    getCatsList();
    getbrandList();
    getReqPorducts();
    getRequestedSubCats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();

  const getbrandList = async () => {
    let res = await sellerBrandRequestList();
    console.log(res?.data?.data, "all brands");
    let typeadded = res?.data?.data?.map((ele) => {
      return { ...ele, type: "Brand" };
    });
    setData(typeadded);
    setBrandlist(typeadded);
  };

  const getCatsList = async () => {
    let res = await sellerCategoryRequestList();

    console.log(res?.data?.data, "all cats list");
    setType(tabtype ?? "category");
    let typeAdded = res?.data?.data?.categoryData.map((ele) => {
      return { ...ele, type: "Category" };
    });
    setCategoryApplication(typeAdded);
    setData(typeAdded);
    let newtypeadded = res?.data?.data?.subcategoryData.map((ele) => {
      return { ...ele, type: "SubCategory" };
    });
    setSubCategoryApplication(newtypeadded);
    // setTableHeader();
  };

  const getReqPorducts = async () => {
    let res = await OwnProductSellerList(auth?.userId);
    console.log(res?.data?.data, "pDara");
    let newtypeadded = res?.data?.data?.map((ele) => {
      return { ...ele, type: "Product" };
    });
    setData(newtypeadded);
    // console.log(data);
    
  };


  const getRequestedSubCats= async() =>{
    let res = await subCategoryReqList();
    let newtypeadded = res?.data?.data?.map((ele) => {
      return { ...ele, type: "SubCategory" };
    });
    setSingleAddedSubCart(newtypeadded)
    
  }

  const filterSubCatdata = (id) => {
    let find = SubcategoryApplicqation?.find((ele) => {
      return ele?.category?._id == id;
    });

    return find;
  };

  const Reqvariations = async () => {
    let res = await sellerCategoryRequestList();

    // setVariations(res?.data?.data?.SpecificationData);

    let typeAdded = res?.data?.data?.SpecificationData.map((ele) => {
      return { ...ele, type: "Variation" };
    });

    setData(typeAdded);
  };

  const getSubCategory = () => {
  
    let all = [...singleAddedSubCat,...SubcategoryApplicqation]?.sort((a,b)=>{
      return new Date(b?.updatedAt) - new Date(a.updatedAt)
    })
    console.table(all)
    setData(all);
  };

  const getAllLists = () => {
    let alldata = [
      ...brandList,
      ...categoryApplicqation,
      ...SubcategoryApplicqation,
    ];

    let sortedData = alldata.sort((a, b) => {
      const titleA = a?.title.toUpperCase(); // ignore upper and lowercase
      const titleB = b?.title.toUpperCase(); // ignore upper and lowercase

      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
      return 0;
    });

    console.log({ sortedData });

    setData(sortedData);
  };

  const handleFunctionCall = (type) => {
    switch (type) {
      case "category":
        getCatsList();
        setType("category");
        break;
      case "Sub-category":
        getSubCategory();
        setType("Sub-category");
        break;
      case "brand":
        getbrandList();
        setType("brand");
        break;
      case "all":
        getAllLists();
        setType("all");
        break;
      case "product":
        getReqPorducts();
        setType("product");
        break;
      case "variation":
        Reqvariations();
        setType("variation");
        break;
    }
  };

  const [copied, setCopied] = useState(false);
  const [copiedindex, setCopiedIndex] = useState("");

  const copyTextToClipboard = (text, index) => {
    setCopiedIndex(index);
    const textToCopy = text;
    const textarea = document.createElement("textarea");
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setCopiedIndex("");
    }, 2000);
  };

  console.log({ data });

  return (
    <div>
      <Container className="mt-4">
        <Row>
          {/* <Col xs={12}>
            <h4>View Selling Applications Form</h4>
          </Col> */}
          {/* <Col xs={12}>
            <p>
              Track and manage your selling application status. Use{" "}
              <span
                className="addPHih"
                onClick={() => navigate("/seller/seller-addproduct")}
              >
                Add Products
              </span>{" "}
              search to determine your eligibility to sell a product.
            </p>
          </Col> */}
        </Row>
        <Row>
          <Col className="d-flex gap-2">
            <div>
              <Button
                size="sm"
                variant={type != "all" ? "outline-secondary" : "dark"}
                onClick={() => handleFunctionCall("all")}
              >
                {" "}
                View All
              </Button>
            </div>
            <div>
              <Button
                size="sm"
                variant={type != "category" ? "outline-secondary" : "dark"}
                onClick={() => handleFunctionCall("category")}
              >
                {" "}
                Categories
              </Button>
            </div>
            <div>
              <Button
                size="sm"
                variant={type != "Sub-category" ? "outline-secondary" : "dark"}
                onClick={() => handleFunctionCall("Sub-category")}
              >
                Subcategory
              </Button>
            </div>
            <div>
              <Button
                size="sm"
                variant={type != "brand" ? "outline-secondary" : "dark"}
                onClick={() => handleFunctionCall("brand")}
              >
                Brands
              </Button>
            </div>
            <div>
              <Button
                size="sm"
                variant={type != "product" ? "outline-secondary" : "dark"}
                onClick={() => handleFunctionCall("product")}
              >
                Products
              </Button>
            </div>
            <div>
              <Button
                size="sm"
                variant={type != "variation" ? "outline-secondary" : "dark"}
                onClick={() => handleFunctionCall("variation")}
              >
                Variations
              </Button>
            </div>
          </Col>
          <Col></Col>
        </Row>
      </Container>

      <Container className="mt-4">
        <Row>
          <Col>
            {type == "category" && (
              <Table responsive hover striped>
                <thead>
                  <tr>
                    <th>Application Name</th>
                    <th>Image</th>
                    <th>Application Type</th>
                    <th>subCategory</th>
                    <th>Changed</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="mt-2 ">
                  {data?.length > 0 &&
                    data?.map((ele, index) => (
                      <tr key={index}>
                        <td>{ele?.title}</td>
                        <td>
                          <img
                            src={ele?.image?.[0]?.image_path}
                            width={30}
                            className="appPhoto"
                            height={30}
                          />
                        </td>
                        <td>{ele?.type}</td>
                        <td>{filterSubCatdata(ele?._id)?.title || "N/A"}</td>
                        <td>{ChangeFormatDate2(ele?.createdAt)}</td>
                        <td>
                          {ele?.is_approved ? (
                            <span>Approved</span>
                          ) : (
                            <span>Pending</span>
                          )}
                        </td>
                        <td>
                          {ele?.is_approved ? (
                            <button
                              size="sm"
                              className="gotoBtnYellow"
                              onClick={() =>
                                navigate("/seller/seller-addproduct")
                              }
                            >
                              <span className="mx-2">
                                <MdFileDownloadDone size={20} />
                              </span>{" "}
                              List Products
                            </button>
                          ) : (
                            <button
                              size="sm"
                              className="gotoBtn"
                              onClick={() =>
                                navigate(
                                  `/seller/category-request-edit/${ele?._id}`
                                )
                              }
                            >
                              <span className="mx-2">
                                <CiClock2 size={20} />
                              </span>{" "}
                              RE-APPLY
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}

            {type == "Sub-category" && (
              <Table responsive hover striped>
                <thead>
                  <tr>
                    <th>Application Name</th>
                    <th>Image</th>
                    <th>Application Type</th>
                    <th>Changed</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="mt-2 ">
                  {data?.length > 0 &&
                    data?.map((ele, index) => (
                      <tr key={index}>
                        <td>{ele?.title}</td>
                        <td>
                          <img
                            src={ele?.image?.[0]?.image_path}
                            width={30}
                            className="appPhoto"
                            height={30}
                          />
                        </td>
                        <td>{ele?.type}</td>
                        <td>{ChangeFormatDate2(ele?.createdAt)}</td>
                        <td>
                          {ele?.is_approved ? (
                            <span>Approved</span>
                          ) : (
                            <span>Pending</span>
                          )}
                        </td>
                        <td>
                          {ele?.is_approved ? (
                            <button
                              size="sm"
                              className="gotoBtnYellow"
                              onClick={() =>
                                navigate("/seller/seller-addproduct")
                              }
                            >
                              <span className="mx-2">
                                <MdFileDownloadDone size={20} />
                              </span>{" "}
                              List Products
                            </button>
                          ) : (
                            <button
                              size="sm"
                              className="gotoBtn"
                              onClick={() =>
                                navigate(
                                  `/seller/subcategory-request-edit/${ele?._id}`
                                )
                              }
                            >
                              <span className="mx-2">
                                <CiClock2 size={20} />
                              </span>{" "}
                              RE-APPLY
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}

            {type == "brand" && (
              <Table responsive hover striped>
                <thead>
                  <tr>
                    <th>Application Name</th>
                    <th>Image</th>
                    <th>Application Type</th>
                    <th>Changed</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="mt-2 ">
                  {data?.length > 0 &&
                    data?.map((ele, index) => (
                      <tr key={index}>
                        <td>{ele?.title}</td>
                        <td>
                          <img
                            src={ele?.image?.[0]?.image_path}
                            className="appPhoto"
                            width={30}
                            height={30}
                          />
                        </td>
                        <td>{ele?.type}</td>
                        <td>{ChangeFormatDate2(ele?.createdAt)}</td>
                        <td>
                          {ele?.is_approved ? (
                            <span>Approved</span>
                          ) : (
                            <span>Pending</span>
                          )}
                        </td>
                        <td>
                          {ele?.is_approved ? (
                            <button
                              size="sm"
                              className="gotoBtnYellow"
                              onClick={() =>
                                navigate("/seller/seller-addproduct")
                              }
                            >
                              <span className="mx-2">
                                <MdFileDownloadDone size={20} />
                              </span>{" "}
                              List Products
                            </button>
                          ) : (
                            <button
                              size="sm"
                              className="gotoBtn"
                              onClick={() =>
                                navigate(
                                  `/seller/brand-request-edit/${ele?._id}`
                                )
                              }
                            >
                              <span className="mx-2">
                                <CiClock2 size={20} />
                              </span>{" "}
                              RE-APPLY
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}

            {type == "product" && (
              <Table responsive hover striped>
                <thead>
                  <tr>
                    <th>Application Name</th>
                    <th>Image</th>
                    <th>product Id</th>
                    <th>Application Type</th>
                    <th>Category</th>
                    <th>SubCategory</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="mt-2 ">
                  {data?.length > 0 &&
                    data?.map((ele, index) => (
                      <tr key={index}>
                        <td>{ele?.name}</td>
                        <td>
                          <img
                            src={ele?.image?.[0]?.image_path}
                            className="appPhoto"
                            width={30}
                            height={30}
                          />
                        </td>
                        <td>
                          {ele?.sellerProId} <br />
                          <span className="mx-2">
                            {copied && copiedindex == index ? (
                              <>
                                <BsClipboard2CheckFill
                                  size={20}
                                  color="green"
                                />
                                <span
                                  style={{ fontSize: "10px", color: "green" }}
                                >
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
                        </td>
                        <td>{ele?.type}</td>
                        <td>{ele?.categoryId?.title}</td>
                        <td>{ele?.subcategoryId?.title}</td>
                        <td>
                          {ele?.is_approved === "pending" ? (
                            <span>Pending</span>
                          ) : (
                            <span>Approved</span>
                          )}
                        </td>
                        <td>
                          {ele?.is_approved !== "pending" ? (
                            <button
                              size="sm"
                              className="gotoBtnYellow"
                              onClick={() =>
                                navigate("/seller/seller-addproduct")
                              }
                            >
                              <span className="mx-2">
                                <MdFileDownloadDone size={20} />
                              </span>{" "}
                              List Products
                            </button>
                          ) : (
                            <button
                              size="sm"
                              className="gotoBtn"
                              onClick={() =>
                                navigate(`/seller/seller-ownproduct-status/new-description/${ele?._id}`)
                              }
                            >
                              <span className="mx-2">
                                <CiClock2 size={20} />
                              </span>{" "}
                              RE-APPLY
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}

            {type == "variation" && (
              <Table responsive hover striped>
                <thead>
                  <tr>
                    <th>Application Name</th>
                    <th>Image</th>
                    <th>Application Type</th>
                    <th>SKU ID</th>
                    <th>Main Product</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="mt-2 ">
                  {data?.length > 0 &&
                    data?.map((ele, index) => (
                      <tr key={index}>
                        <td>
                          {ele?.spec_det?.length > 0 &&
                            ele?.spec_det?.map((ele, index, array) => (
                              <span key={index}>
                                {ele?.title} : {ele?.value}
                                {index < array.length - 1 ? ", " : ""}
                                <br />
                              </span>
                            ))}
                        </td>
                        <td>
                          <img
                            src={ele?.image?.[0]?.image_path}
                            className="appPhoto"
                            width={30}
                            height={30}
                          />
                        </td>
                        <td>{ele?.type}</td>
                        <td>{ele?.skuId?.toUpperCase()}</td>
                        <td>{ele?.productId?.name}</td>
                        <td>
                          {ele?.is_approved ? (
                            <span>Approved</span>
                          ) : (
                            <span>Pending</span>
                          )}
                        </td>
                        <td>
                          {ele?.is_approved ? (
                            <button
                              size="sm"
                              className="gotoBtnYellow"
                              onClick={() =>
                                navigate("/seller/seller-addproduct")
                              }
                            >
                              <span className="mx-2">
                                <MdFileDownloadDone size={20} />
                              </span>{" "}
                              List Products
                            </button>
                          ) : (
                            <button
                              size="sm"
                              className="gotoBtn"
                              onClick={() =>
                                navigate(`new-variations/${ele?._id}`)
                              }
                            >
                              <span className="mx-2">
                                <CiClock2 size={20} />
                              </span>{" "}
                              RE-APPLY
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}

            {type == "all" && (
              <Table responsive hover striped>
                <thead>
                  <tr>
                    <th>Application Name</th>
                    <th>Image</th>
                    <th>Application Type</th>
                    <th>Category</th>
                    <th>SubCategory</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="mt-2 ">
                  {data?.length > 0 &&
                    data?.map((ele, index) => (
                      <tr key={index}>
                        <td>{ele?.name}</td>
                        <td>
                          <img
                            src={ele?.image?.[0]?.image_path}
                            className="appPhoto"
                            width={30}
                            height={30}
                          />
                        </td>
                        <td>{ele?.type}</td>
                        <td>{ele?.categoryId?.title}</td>
                        <td>{ele?.subcategoryId?.title}</td>
                        <td>
                          {ele?.is_approved == "pending" ? (
                            <span>Approved</span>
                          ) : (
                            <span>Pending</span>
                          )}
                        </td>
                        <td>
                          {ele?.is_approved == "pending" ? (
                            <button
                              size="sm"
                              className="gotoBtnYellow"
                              onClick={() =>
                                navigate("/seller/seller-addproduct")
                              }
                            >
                              <span className="mx-2">
                                <MdFileDownloadDone size={20} />
                              </span>{" "}
                              List Products
                            </button>
                          ) : (
                            <button
                              size="sm"
                              className="gotoBtn"
                              onClick={() =>
                                navigate(`new-variations/${ele?._id}`)
                              }
                            >
                              <span className="mx-2">
                                <CiClock2 size={20} />
                              </span>{" "}
                              RE-APPLY
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ApprovalPendingList;
