import React from 'react'
import '../product.css';
import { useState } from 'react';
import { AddProductCategory } from '../../../API/api';

const AddCategory = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (title && description && file) {
            console.log('rsrs')
            let payload =
            {
                "title": title,
                "description": description,
                "image": file?.name
            }


            await AddProductCategory(payload).then((res) => {
                console.log(res?.data?.data)

                setTitle('');
                setDescription('');
                setFile(null);
            }).catch((err) => {
                console.log(err)
            })
        }
    };
    return (

        <div className="newProduct">
            <h1 className="addProductTitle">New Category</h1>
            <form className="addProductForm" onSubmit={handleSubmit}>
                <div className="addProductItem">
                    <label>Image</label>
                    <input type="file" id="file" onChange={handleFileChange} />
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