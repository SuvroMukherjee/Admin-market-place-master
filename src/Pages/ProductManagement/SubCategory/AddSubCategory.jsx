import React, { useEffect } from 'react'
import '../product.css';
import { useState } from 'react';
import { AddProductCategory, AddProductSubCategory, FileUpload, allCategoryList } from '../../../API/api';


const AddSubCategory = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [categoryId, setCategoryId] = useState();
    const [categorylist, setCategorylist] = useState([]);

    useEffect(() => {
        getCategoryList();
    }, [])

    async function getCategoryList() {
        await allCategoryList().then((res) => {
            setCategorylist(res?.data?.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (title && description && file && categoryId) {
            console.log('rsrs')
            let payload =
            {
                "title": title,
                "description": description,
                "image": file,
                "category": categoryId
            }

            console.log(payload)

            await AddProductSubCategory(payload).then((res) => {
                console.log(res?.data?.data)
                setTitle('');
                setDescription('');
                setFile(null);
                setCategoryId(null)
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
                setFile(res?.data?.data?.fileurl)
            })
            .catch((err) => {
                console.log(err, "err");
            });
    };

    return (

        <div className="newProduct">
            <h1 className="addProductTitle">New Sub-Category</h1>
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
                        placeholder="Sub Category"
                        value={title}
                        onChange={handleTitleChange}
                    />
                </div>
                <div className="addProductItem">
                    <label>Description</label>
                    <textarea
                        name="description"
                        rows="4"
                        placeholder='Add Sub Category description'
                        cols="50"
                        value={description}
                        onChange={handleDescriptionChange}
                    ></textarea>
                </div>
                <div className="addProductItem">
                    <label>Category</label>
                    <select
                        className="newUserSelect"
                        name="category"
                        id="category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        <option value="" disabled selected>
                            Select Category
                        </option>
                        {categorylist?.length > 0 &&
                            categorylist?.map((ele) => (
                                <option key={ele?._id} value={ele?._id}>
                                    {ele?.title}
                                </option>
                            ))}
                    </select>
                </div>
                <button type="submit" className="addProductButton">Create</button>
            </form>
        </div>
    )
}

export default AddSubCategory