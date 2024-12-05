import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  ListGroup,
  Row,
  Table,
} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import toast, { Toaster } from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { RiEdit2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import {
  SellerProductAdd,
  StatusUpdateProduct,
  allBrandList,
  allCategoryList,
  allProductList,
  deleteProduct,
  getSubCategoryByCategory,
} from "../../../API/api";
import sellerback2 from "../../../assets/sellerback2.jpg";
import "./sellerlayout.css";
import { AiOutlineInfoCircle } from "react-icons/ai";
import PList from "../../ProductManagement/Product/PList";
import AddingProductTable from "./AddingProductTable";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_BASE;

export default function NewAddProduct() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allcategoryList, setAllCategoryList] = useState();
  const [maindata, setMaindata] = useState([]);
  const [allSubcategorylist, setSubCatgoryList] = useState();
  const [allbrandList, setAllBrandList] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [show, setShow] = useState(false);
  const [seletedProducrt, setSelectedProduct] = useState();
  const [formData, setFormData] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [variantsArray, setVariantsArray] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleCheckboxChange = () => {
    // Toggle the value of 'isChecked' when the checkbox is clicked
    setIsChecked(!isChecked);

    if (isChecked == true) {
      setData([]);
    }
  };

  const handlePriceChange = (specIndex, price) => {
    setFormData((prevData) => {
      const newData = [...prevData];
      newData[specIndex] = { ...newData[specIndex], price };
      return newData;
    });
  };

  const handleQuansChange = (specIndex, quantity) => {
    setFormData((prevData) => {
      const newData = [...prevData];
      newData[specIndex] = { ...newData[specIndex], quantity };
      return newData;
    });
  };

  const handleShippingChange = (specIndex, shipping_cost) => {
    setFormData((prevData) => {
      const newData = [...prevData];
      newData[specIndex] = { ...newData[specIndex], shipping_cost };
      return newData;
    });
  };

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { userId } = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    setTimeout(() => {
      getProductListFunc();
      getAllCats();
      getBrandList();
    }, 2000);
  }, []);

  const navigate = useNavigate();

  const handleSelectChange = (event) => {
    const selectedValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(selectedValues);
  };

  async function getProductListFunc() {
    // await allProductList()
    //   .then((res) => {
    //     const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
    //       ...item,
    //       id: index + 1,
    //     }));
    //     //  setData(dataWithUniqueIds)
    //     console.log(dataWithUniqueIds,'datawithuniqueids');
    //     setMaindata(dataWithUniqueIds);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   })
    //   .finally((data) => {
    //     setLoading(false);
    //   });

    try {
      const res = await axios.get(
        `${apiUrl}/product/all-list?page=${1}&limit=15`
      );
      setMaindata(res?.data?.data);
      setData(res?.data?.data);
      //     setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  }

  async function getAllCats() {
    await allCategoryList()
      .then((res) => {
        setAllCategoryList(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function getBrandList() {
    await allBrandList()
      .then((res) => {
        console.log(res?.data?.data, "brands");
        setAllBrandList(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleCategoryChange = async (e) => {
    console.log(e.target.value);
    setLoading(true);
    let filterData = maindata?.filter((ele) => {
      return ele?.categoryId?._id == e?.target?.value;
    });
    setData(filterData);

    await getSubCategoryByCategory(e?.target?.value)
      .then((res) => {
        console.log(res?.data?.data, "subcats");
        setSubCatgoryList(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const handleSubChange = (e) => {
    setLoading(true);
    let filterData = maindata?.filter((ele) => {
      return ele?.subcategoryId?._id == e.target.value;
    });
    setData(filterData);
    setLoading(false);
  };

  const handleBrandChange = (e) => {
    console.log(e.target.value);
    setLoading(true);
    let filterData = maindata?.filter((ele) => {
      return ele?.brandId?._id == e.target.value;
    });
    setData(filterData);
    setLoading(false);
  };

  const cleatFilter = () => {
    setLoading(true);
    getProductListFunc();
  };

  const AddSellerProduct = async (
    Pid,
    SpecId,
    price,
    quantity,
    shipping_cost
  ) => {
    if (price) {
      let payload = {
        sellerId: userId,
        productId: Pid,
        specId: SpecId,
        price: price,
        quantity: quantity,
        shipping_cost: shipping_cost,
        // "discount_price": inputValue?.discount_price
      };

      console.log(payload);

      await SellerProductAdd(payload)
        .then((res) => {
          if (res?.response?.data?.error == true) {
            toast.error(res?.response?.data?.message);

            // handleClose();
          } else {
            toast.success("product added successfully");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleStatus = async (dataset) => {
    let payload = {
      status: !dataset?.status,
    };

    await StatusUpdateProduct(dataset?._id, payload)
      .then((res) => {
        console.log(res);
        getProductListFunc();
        toast.success("Product status updated successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handledeleteProduct = async (id) => {
    await deleteProduct(id)
      .then((res) => {
        console.log(res);
        getProductListFunc();
        toast.success("Product deleted successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "productId", headerName: "Product Id", width: 150 },
    { field: "name", headerName: "Name", width: 250 },
    {
      field: "image",
      headerName: "Image",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img
              className="productListImg"
              src={params?.row?.image?.[0]}
              alt=""
            />
            {params?.row?.image?.length > 1 && (
              <span>{params?.row?.image?.length - 1}+</span>
            )}
          </div>
        );
      },
    },
    { field: "regular_price", headerName: "Price", width: 150 },
    { field: "desc", headerName: "Description", width: 150 },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="productListItem">{params.row.categoryId?.title}</div>
        );
      },
    },
    {
      field: "Subcategory",
      headerName: "Sub Category",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            {params.row.subcategoryId?.title}
          </div>
        );
      },
    },
    {
      field: "Brand",
      headerName: "Brand",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="productListItem">{params.row?.brandId?.title}</div>
        );
      },
    },
    {
      field: "tags",
      headerName: "Tags",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            {params.row?.tags?.map((ele, i) => (
              <p key={i}>{ele},</p>
            ))}
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            {params?.row?.status ? (
              <span className="ActiveStatus">Active</span>
            ) : (
              <span className="DeactiveStatus">Not Active</span>
            )}
          </div>
        );
      },
    },
    // { field: "type", headerName: "Type", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => {
        return (
          <>
            <div className="buttonWrapper">
              <Button
                variant="success"
                onClick={() => handleAddProduct(params?.row)}
                size="sm"
              >
                <RiEdit2Line /> Add Item
              </Button>
            </div>
          </>
        );
      },
    },
  ];

  // new

  const handleAddProduct = (product) => {
    console.log(product, "product");
    setSelectedProduct(product);
    handleShow();
  };

  const handleSubmit = (index) => {
    console.log("Form Data:", formData[index]);
    // You can now send formData to your server or perform any other desired actions
  };

  const navbarStyle = {
    paddingLeft: "0px", // Adjust the left padding
    paddingRight: "10px", // Adjust the right padding
    height: "6vh",
  };

  const [searchtext, setsearchrtext] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchproducts = () => {
    let filterproducts = maindata?.filter((ele) => {
      console.log(searchtext?.toLowerCase());
      return ele?.name?.toLowerCase()?.includes(searchtext?.toLowerCase());
    });
    console.table({ filterproducts });
    // setSearchResults(filterproducts);
    setIsChecked(true);
    setData(filterproducts);
  };

  const showVariants = (data) => {
    console.log(data);
    setVariantsArray(data);
    handleShowModal();
  };

  function calculateApprovedVariantsLength(items, index) {
    const approvedItems = items.filter(
      (item) => "is_approved" in item && item?.is_approved
    );

    console.log(approvedItems, index, "index");

    return 0;
  }

  console.log({ maindata });

  return (
    <div
      className="px-4 py-3"
      style={{ backgroundColor: "#e5faca", minHeight: "100vh" }}
    >
      {/** NEWW  */}

      <NewAddProductComponent />
    </div>
  );
}

const NewAddProductComponent = () => {
  return <AddingProductTable />;
};
