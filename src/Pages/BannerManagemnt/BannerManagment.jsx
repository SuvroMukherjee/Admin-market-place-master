// import { useEffect, useRef, useState } from "react";
// import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
// import toast, { Toaster } from "react-hot-toast";
// import { FaImages, FaYoutube } from "react-icons/fa";
// import { MdCancel } from "react-icons/md";
// import {
//   BannerImagesLists,
//   DeleteBanner,
//   FileUpload,
//   bannerTypeList,
//   creteBannerType,
//   updateBannerImages,
// } from "../../API/api";

// const BannerManagment = () => {
//   const [bannerType, setBannerType] = useState("");
//   const [bannerTypelist, setBannerTypelist] = useState([]);
//   const [selectBannerType, SetSelectedBannerType] = useState({
//     id: "",
//     type: "",
//   });
//   const [BannerImages, SetbannerImages] = useState([]);
//   const [allbannerImages, setAllBannerImages] = useState([]);
//   const [bannerUpdateid, setbannerupdateId] = useState("");
//   const [isNew, setIsNew] = useState(true);
//   const [inputFields, setInputFields] = useState([]);
//   const [isImage, seIsImage] = useState(true);

//   const handleAddInput = () => {
//     seIsImage(false);
//     setInputFields([...inputFields, ""]); // Add a new empty input field to the array
//   };

//   const handleInputChange = (index, value) => {
//     const updatedInputs = [...inputFields];
//     updatedInputs[index] = { image_path: value };
//     setInputFields(updatedInputs);
//   };

//   useEffect(() => {
//     getBannerType();
//     getbannerImageslist();
//   }, []);

//   async function getbannerImageslist() {
//     await BannerImagesLists()
//       .then((res) => {
//         //console.log(res?.data?.data,'imgs')
//         setAllBannerImages(res?.data?.data);
//         // setBannerTypelist(res?.data?.data)
//       })
//       .catch((err) => [console.log(err)]);
//   }

//   async function getBannerType() {
//     await bannerTypeList()
//       .then((res) => {
//         setBannerTypelist(res?.data?.data);
//       })
//       .catch((err) => [console.log(err)]);
//   }

//   const bannerTypeFunc = async () => {
//     let payload = {
//       banner_type: bannerType,
//     };

//     let res = await creteBannerType(payload);

//     if (res?.data?.error == false) {
//       toast.success("Banner Type create successfully...");
//       setBannerType("");
//       getBannerType();
//       getbannerImageslist();
//     }
//   };

//   const fileInputRef = useRef(null);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       // Handle the file, e.g., upload or process it
//       console.log("Selected File:", file);
//       onFileUpload(file);
//     }
//   };

//   const handleButtonClick = () => {
//     // Trigger the hidden file input
//     fileInputRef.current.click();
//   };

//   const onFileUpload = async (file) => {
//     //setUploading(true)
//     const formData = new FormData();
//       return ele?.banner_typeId?._id == selectedOption.value;
//     });

//     console.warn({ filterDataImges });

//     if (
//       filterDataImges?.banner_typeId?.banner_type ==
//       "indian grown product videos new"
//     ) {
//       console.log("herererere");

//       setInputFields(filterDataImges?.image);
//     }

//     if (filterDataImges) {
//       //setIsNew(false)
//       SetbannerImages(filterDataImges?.image);
//       setbannerupdateId(filterDataImges?._id);
//     }
//     // }else{
//     //     setIsNew(true)
//     // }
//     SetSelectedBannerType({
//       id: selectedOption.value,
//       type: selectedOption.label,
//     });
//   };

//   const BannerUpload = async () => {
//     console.log({ inputFields });
//     let payload = {};

//     if (!isImage) {
//       payload = {
//         banner_typeId: selectBannerType?.id,
//         image: inputFields,
//       };
//     } else {
//       payload = {
//         banner_typeId: selectBannerType?.id,
//         image: BannerImages,
//       };
//     }
//     console.log({ payload });

//     let res;
//     if (BannerImages?.length > 0 || inputFields?.length > 0) {
//       // if (isNew) {
//       //     res = await createBannerImages(payload);
//       // } else {
//       //     res = await updateBannerImages(payload, bannerUpdateid);
//       // }

//       res = await updateBannerImages(payload, bannerUpdateid);

//       if (res?.data?.error === false) {
//         toast.success("Images upload successfully...");
//         getbannerImageslist();
//         resetState();
//       }
//     }
//   };

//   const resetState = () => {
//     SetSelectedBannerType({ id: "", type: "" });
//     SetbannerImages([]);
//     setInputFields([]);
//   };

//   console.log({ isNew });

//   const deleteImage = (id) => {
//     console.log("clc");
//     let filterData = BannerImages?.filter((ele, i) => {
//       return i != id;
//     });
//     console.log({ filterData });
//     SetbannerImages(filterData);
//   };

//   console.log({ BannerImages });

//   const deleteBanner = async (id) => {
//     let res = await DeleteBanner(id);
//     resetState();
//     getBannerType();
//     getbannerImageslist();

//     console.log(res);
//   };

//   console.log({ inputFields });

//   return (
//     <div className="productList mt-2 p-4">
//       <Container>
//         <Row className="justify-content-md-center">
//           <Col md="auto">
//             <h3>Banner Managment</h3>
//           </Col>
//         </Row>
//         <Row>
//           <Col xs={8}>
//             <Row>
//               <Col size="6">
//                 <Form.Group
//                   className="mb-3"
//                   controlId="exampleForm.ControlInput1"
//                 >
//                   <Form.Label>Banner Type</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="create your banner type"
//                     value={bannerType}
//                     onChange={(e) => setBannerType(e.target.value)}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//               <Col size="6" className="d-flex align-items-center">
//                 <div>
//                   <Button
//                     variant="dark"
//                     size="sm"
//                     onClick={() => bannerTypeFunc()}
//                   >
//                     Create banner type
//                   </Button>
//                 </div>
//               </Col>
//             </Row>
//             <Row className="mt-3">
//               <Col md="auto">
//                 <h5>Upload Banner Images</h5>
//               </Col>
//             </Row>
//             <Row>
//               <Col>
//                 <Row>
//                   <Col xs={6}>
//                     <Form.Group controlId="bannerType">
//                       <Form.Label>Banner Type:</Form.Label>
//                       <Form.Select
//                         value={SetSelectedBannerType}
//                         onChange={BabnnerTypeChange}
//                       >
//                         <option value="" disabled selected>
//                           Select Banner Type
//                         </option>
//                         {bannerTypelist?.length > 0 &&
//                           bannerTypelist?.map((ele) => (
//                             <option value={ele?._id} label={ele?.banner_type}>
//                               {ele?.banner_type}
//                             </option>
//                           ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//                 {selectBannerType?.type && (
//                   <>
//                     <Row className="mt-4">
//                       <Col>
//                         <h6>{selectBannerType?.type}</h6>
//                       </Col>
//                       <Col>
//                         <Button
//                           variant="dark"
//                           size="sm"
//                           onClick={() => BannerUpload()}
//                           disabled={
//                             BannerImages?.length == 0 &&
//                             inputFields?.length == 0
//                           }
//                         >
//                           SAVE BANNER
//                         </Button>
//                         <Button
//                           variant="danger"
//                           size="sm"
//                           onClick={() => deleteBanner(bannerUpdateid)}
//                           disabled={
//                             BannerImages?.length == 0 &&
//                             inputFields?.length == 0
//                           }
//                         >
//                           DELETE BANNER
//                         </Button>
//                       </Col>
//                     </Row>
//                     <Row className="mt-2">
//                       <Col xs={12}>
//                         <Row>
//                           {BannerImages?.length > 0 &&
//                             BannerImages?.map((ele, index) => (
//                               <Col xs={2}>
//                                 <span>{index + 1}</span>
//                                 <span>
//                                   <MdCancel
//                                     style={{
//                                       color: "red",
//                                       fontSize: "20px",
//                                       cursor: "pointer",
//                                     }}
//                                     onClick={() => deleteImage(index)}
//                                   />
//                                 </span>
//                                 <Image src={ele?.image_path} thumbnail />
//                               </Col>
//                             ))}
//                           {inputFields?.length > 0 &&
//                             inputFields?.map((input, index) => (
//                               <Form.Control
//                                 key={index}
//                                 type="text"
//                                 placeholder={`Enter video link ${index + 1}`}
//                                 value={input?.image_path}
//                                 onChange={(e) =>
//                                   handleInputChange(index, e.target.value)
//                                 }
//                               />
//                             ))}
//                         </Row>
//                       </Col>
//                       <Col xs={6} className="mt-2">
//                         <input
//                           type="file"
//                           ref={fileInputRef}
//                           style={{ display: "none" }}
//                           onChange={handleFileChange}
//                           accept="image/*"
//                         />
//                         <div className="d-grid">
//                           <Button
//                             variant="dark"
//                             size="sm"
//                             onClick={handleButtonClick}
//                           >
//                             <FaImages /> Upload Images
//                           </Button>
//                           <span style={{ textAlign: "center" }}>OR</span>
//                           <Button
//                             variant="dark"
//                             size="sm"
//                             onClick={handleAddInput}
//                           >
//                             <FaYoutube /> Upload Video Link
//                           </Button>
//                         </div>
//                       </Col>
//                     </Row>
//                   </>
//                 )}
//               </Col>
//             </Row>
//           </Col>
//           <Col>
//             <BannerCMS />
//           </Col>
//         </Row>

//         <Toaster position="top-right" />
//       </Container>
//     </div>
//   );
// };

// const BannerCMS = () => {
//   return (
//     <div className="border border-dark p-4">
//       <Row className="text-center bg-primary text-white">
//         <Col>Header</Col>
//       </Row>
//       <Row className="bg-secondary p-4 text-center mt-1">
//         <Col>Top Banner</Col>
//       </Row>
//       <Row className="mt-2">
//         <Col>Indian grown product videos</Col>
//       </Row>
//       <Row className="d-flex justify-content-between gap-2 mt-1">
//         <Col className="bg-dark p-2 text-white">Video1</Col>
//         <Col className="bg-dark p-2 text-white">Video2</Col>
//         <Col className="bg-dark p-2 text-white">Video3</Col>
//       </Row>
//       <Row className="mt-2 d-flex justify-content-center bg-success text-center p-1 m-2">
//         <Col>Explore All</Col>
//       </Row>

//       <Row className="d-flex justify-content-between gap-2 mb-4">
//         <Col className="bg-info">Middle ban 1</Col>
//         <Col className="bg-info">Middle ban 2</Col>
//       </Row>

//       <Row className="d-flex justify-content-between gap-2 mt-4">
//         <Col className="bg-warning p-2 text-center">footer ban 1</Col>
//         <Col className="bg-warning p-2 text-center">footer ban 2</Col>
//       </Row>
//     </div>
//   );
// };

// export default BannerManagment;
