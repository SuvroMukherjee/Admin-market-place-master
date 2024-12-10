// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { AddProductCategory, FileUpload } from "../../../API/api";
// import NoImage from "../../../assets/noimage.png";
// import "../product.css";

// const AddCategory = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [isOpenBox, setIsOpenBox] = useState(true);
//   const [file, setFile] = useState(NoImage);
//   const [sgst, setSgst] = useState(""); // SGST field
//   const [cgst, setCgst] = useState(""); // CGST field
//   const [igst, setIgst] = useState(""); // IGST field

//   const navigate = useNavigate();

//   const handleTitleChange = (e) => {
//     setTitle(e.target.value);
//   };

//   const handleDescriptionChange = (e) => {
//     setDescription(e.target.value);
//   };

//   const handleFileChange = async (e) => {
//     onFileUpload(e.target.files[0]);
//   };

//   const handleCheckboxChange = (e) => {
//     setIsOpenBox(e.target.checked); // Handle checkbox state
//   };

//   const handleTaxChange = (setter) => (e) => {
//     const value = e.target.value;
//     if (!isNaN(value) && value >= 0) { // Only allow positive numbers
//       setter(value);
//     }
//   };

//   const onFileUpload = async (data) => {
//     const formData = new FormData();
//     formData.append("file", data);
//     await FileUpload(formData)
//       .then((res) => {
//         console.log(res, "res");
//         setTimeout(() => {
//           setFile(res?.data?.data?.fileurl);
//         }, 3000);
//       })
//       .catch((err) => {
//         console.log(err, "err");
//       });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (title && description && file && sgst && cgst && igst) {
//       let payload = {
//         title: title,
//         description: description,
//         image: {
//           image_path: file,
//         },
//         isOpenBox: isOpenBox,
//         taxes: {
//           sgst: parseFloat(sgst),
//           cgst: parseFloat(cgst),
//           igst: parseFloat(igst),
//         },
//       };

//       await AddProductCategory(payload)
//         .then((res) => {
//           console.log(res?.data?.data);
//           setTitle("");
//           setDescription("");
//           setFile(NoImage);
//           setIsOpenBox(true);
//           setSgst("");
//           setCgst("");
//           setIgst("");
//           navigate("/Admin/category");
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     } else {
//       alert("Please fill all the fields");
//     }
//   };

//   return (
//     <div className="newProduct">
//       <h3 className="addProductTitle mt-4">New Category</h3>
//       <form className="addProductForm" onSubmit={handleSubmit}>
//         <div className="addProductItem">
//           <label>Image</label>
//           {file && <img src={file} alt="Category Preview" />}
//           <input
//             type="file"
//             id="file"
//             onChange={handleFileChange}
//             accept="image/jpeg, image/png, image/gif"
//           />
//         </div>
//         <div className="addProductItem">
//           <label>Title</label>
//           <input
//             type="text"
//             name="Title"
//             placeholder="Category"
//             value={title}
//             onChange={handleTitleChange}
//           />
//         </div>
//         <div className="addProductItem">
//           <label>Description</label>
//           <textarea
//             name="description"
//             rows="4"
//             placeholder="Add Category description"
//             cols="50"
//             value={description}
//             onChange={handleDescriptionChange}
//           ></textarea>
//         </div>
//         <div className="addProductItem">
//           <label>SGST (%)</label>
//           <input
//             type="text"
//             placeholder="SGST"
//             value={sgst}
//             onChange={handleTaxChange(setSgst)}
//           />
//         </div>
//         <div className="addProductItem">
//           <label>CGST (%)</label>
//           <input
//             type="text"
//             placeholder="CGST"
//             value={cgst}
//             onChange={handleTaxChange(setCgst)}
//           />
//         </div>
//         <div className="addProductItem">
//           <label>IGST (%)</label>
//           <input
//             type="text"
//             placeholder="IGST"
//             value={igst}
//             onChange={handleTaxChange(setIgst)}
//           />
//         </div>
//         <div className="m-2 d-flex gap-2 align-items-center p-2">
//           <input
//             type="checkbox"
//             size={20}
//             className="form-check-input"
//             name="isOpenBox"
//             checked={isOpenBox}
//             onChange={handleCheckboxChange}
//             style={{ transform: "scale(1.3)" }}
//           />
//           <label className="form-check-label fo">
//             This Category will be Open Box Delivery
//           </label>
//         </div>
//         <button type="submit" className="addProductButton">
//           Create
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddCategory;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddProductCategory, FileUpload } from "../../../API/api";
import NoImage from "../../../assets/noimage.png";
import "../product.css";

const AddCategory = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isOpenBox, setIsOpenBox] = useState(true);
  const [file, setFile] = useState(NoImage);
  const [icon, setIcon] = useState(NoImage); // Icon state
  const [sgst, setSgst] = useState(""); // SGST field
  const [cgst, setCgst] = useState(""); // CGST field
  const [igst, setIgst] = useState(""); // IGST field

  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = async (e) => {
    onFileUpload(e.target.files[0], setFile);
  };

  const handleIconChange = async (e) => {
    onFileUpload(e.target.files[0], setIcon);
  };

  const handleCheckboxChange = (e) => {
    setIsOpenBox(e.target.checked);
  };

  const handleTaxChange = (setter) => (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value >= 0) {
      setter(value);
    }
  };

  const onFileUpload = async (data, setter) => {
    const formData = new FormData();
    formData.append("file", data);
    await FileUpload(formData)
      .then((res) => {
        console.log(res, "res");
        setTimeout(() => {
          setter(res?.data?.data?.fileurl);
        }, 3000);
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title && description && file && icon && sgst && cgst && igst) {
      let payload = {
        title: title,
        description: description,
        image: {
          image_path: file,
        },
        icon: icon,
        isOpenBox: isOpenBox,
        taxes: {
          sgst: parseFloat(sgst),
          cgst: parseFloat(cgst),
          igst: parseFloat(igst),
        },
      };

      await AddProductCategory(payload)
        .then((res) => {
          console.log(res?.data?.data);
          setTitle("");
          setDescription("");
          setFile(NoImage);
          setIcon(NoImage);
          setIsOpenBox(true);
          setSgst("");
          setCgst("");
          setIgst("");
          navigate("/Admin/category");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Please fill all the fields");
    }
  };

  return (
    <div className="newProduct">
      <h3 className="addProductTitle mt-4">New Category</h3>
      <form className="addProductForm" onSubmit={handleSubmit}>
        <div className="addProductItem">
          <label>Image</label>
          {file && <img src={file} alt="Category Preview" />}
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            accept="image/jpeg, image/png, image/gif"
          />
        </div>
        <div className="addProductItem">
          <label>Icon</label>
          {icon && <img src={icon} alt="Category Icon Preview" />}
          <input
            type="file"
            id="icon"
            onChange={handleIconChange}
            accept="image/jpeg, image/png, image/gif"
          />
        </div>
        <div className="addProductItem">
          <label>Title</label>
          <input
            type="text"
            name="Title"
            placeholder="Category"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <textarea
            name="description"
            rows="4"
            placeholder="Add Category description"
            cols="50"
            value={description}
            onChange={handleDescriptionChange}
          ></textarea>
        </div>
        <div className="addProductItem">
          <label>SGST (%)</label>
          <input
            type="text"
            placeholder="SGST"
            value={sgst}
            onChange={handleTaxChange(setSgst)}
          />
        </div>
        <div className="addProductItem">
          <label>CGST (%)</label>
          <input
            type="text"
            placeholder="CGST"
            value={cgst}
            onChange={handleTaxChange(setCgst)}
          />
        </div>
        <div className="addProductItem">
          <label>IGST (%)</label>
          <input
            type="text"
            placeholder="IGST"
            value={igst}
            onChange={handleTaxChange(setIgst)}
          />
        </div>
        <div className="m-2 d-flex gap-2 align-items-center p-2">
          <input
            type="checkbox"
            size={20}
            className="form-check-input"
            name="isOpenBox"
            checked={isOpenBox}
            onChange={handleCheckboxChange}
            style={{ transform: "scale(1.3)" }}
          />
          <label className="form-check-label">
            This Category will be Open Box Delivery
          </label>
        </div>
        <button type="submit" className="addProductButton">
          Create
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
