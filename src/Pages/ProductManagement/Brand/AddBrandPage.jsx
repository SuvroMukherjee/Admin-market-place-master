import React from 'react'
import '../product.css';
import { useState } from 'react';
import { AddBrand, AddProductCategory } from '../../../API/api';


const AddBrandPage = () => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (title && file) {
            console.log('rsrs')
            let payload =
            {
                "title": title,
                "image": file?.name
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
                <button type="submit" className="addProductButton">Create</button>
            </form>
        </div>
    )
}

export default AddBrandPage