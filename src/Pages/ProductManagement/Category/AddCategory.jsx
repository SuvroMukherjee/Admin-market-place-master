import React from "react";
import "../product.css";
import { useState } from "react";
import { AddProductCategory, FileUpload } from "../../../API/api";
import EditCategory from "./EditCategory";
import NoImage from "../../../assets/noimage.png";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Toast } from "react-bootstrap";

const AddCategory = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isOpenBox, setIsOpenBox] = useState(true);
  const [file, setFile] = useState(NoImage);

  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = async (e) => {
    onFileUpload(e.target.files[0]);
  };

  const handleCheckboxChange = (e) => {
    setIsOpenBox(e.target.checked); // Handle checkbox state
  };

  const onFileUpload = async (data) => {
    const formData = new FormData();
    formData.append("file", data);
    await FileUpload(formData)
      .then((res) => {
        console.log(res, "res");
        setTimeout(() => {
          setFile(res?.data?.data?.fileurl);
        }, 3000);
        //setFile(res?.data?.data?.fileurl)
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title && description && file) {
      console.log("rsrs");
      let payload = {
        title: title,
        description: description,
        image: {
          image_path: file,
        },
        isOpenBox: isOpenBox,
      };

      await AddProductCategory(payload)
        .then((res) => {
          console.log(res?.data?.data);
          setTitle("");
          setDescription("");
          setFile(NoImage);
          setIsOpenBox(true);
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
          {file && <img src={file} />}
          {/* <h2>{file?.fileurl}</h2> */}
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
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
          <label className="form-check-label fo"> This Category will be Open Box Delivery</label>
        </div>
        <button type="submit" className="addProductButton">
          Create
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
