import React from 'react'
import '../product.css';
import { useState } from 'react';
import { AddProductCategory, FileUpload } from '../../../API/api';
import EditCategory from './EditCategory';
import NoImage from '../../../assets/noimage.png'
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(NoImage);

    const navigate = useNavigate()

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleFileChange = async (e) => {
        onFileUpload(e.target.files[0])
    };


    const onFileUpload = async (data) => {
        const formData = new FormData();
        formData.append("file", data);
        await FileUpload(formData)
            .then((res) => {
                console.log(res, "res");
                setTimeout(() => {
                    setFile(res?.data?.data?.fileurl)
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
            console.log('rsrs')
            let payload =
            {
                "title": title,
                "description": description,
                "image": {
                    image_path : file
                }
            }


            await AddProductCategory(payload).then((res) => {
                console.log(res?.data?.data)
                setTitle('');
                setDescription('');
                setFile(null);
                navigate('/Admin/category')
            }).catch((err) => {
                console.log(err)
            })
        }
    };
    return (

        <div className="newProduct">
            <h3 className="addProductTitle mt-4">New Category</h3>
            <form className="addProductForm" onSubmit={handleSubmit}>
                <div className="addProductItem">
                    <label>Image</label>
                    {file &&
                        <img src={file }  />}
                    {/* <h2>{file?.fileurl}</h2> */}
                    <input type="file" id="file"  onChange={handleFileChange} accept="image/jpeg, image/png, image/gif" />
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
                        placeholder='Add Category description'
                        cols="50"
                        value={description}
                        onChange={handleDescriptionChange}
                    ></textarea>
                </div>
                <button type="submit" className="addProductButton">Create</button>
            </form>
        </div>
    )
}

export default AddCategory