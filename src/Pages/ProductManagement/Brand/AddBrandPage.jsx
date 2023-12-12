import React from 'react'
import '../product.css';
import { useState } from 'react';
import { AddBrand, AddProductCategory, FileUpload } from '../../../API/api';


const AddBrandPage = () => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState("https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg");

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (title && file) {
            console.log('rsrs')
            let payload =
            {
                "title": title,
                "image": file
            }

            await AddBrand(payload).then((res) => {
                console.log(res?.data?.data)
                setTitle('');
                setFile(null);
            }).catch((err) => {
                console.log(err)
            })
        }
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
                }, 5000);
            })
            .catch((err) => {
                console.log(err, "err");
            });
    };

    return (

        <div className="newProduct">
            <h1 className="addProductTitle">New Category</h1>
            <form className="addProductForm" onSubmit={handleSubmit}>
                <div className="addProductItem">
                    <label>Image</label>
                    {file &&
                        <img src={file} />}
                    <input type="file" id="file" onChange={handleFileChange} accept="image/jpeg, image/png, image/gif" />
                </div>
                <div className="addProductItem">
                    <label>Title</label>
                    <input
                        type="text"
                        name="Title"
                        placeholder="Brand Name"
                        value={title}
                        onChange={handleTitleChange}
                    />
                </div>
                <button type="submit" className="addProductButton">Create</button>
            </form>
        </div>
    )
}

export default AddBrandPage