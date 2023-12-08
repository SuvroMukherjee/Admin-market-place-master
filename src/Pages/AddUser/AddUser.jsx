import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { StaffCreateByAdmin, allRoleList } from '../../API/api';
import './addUser.css';

const AddUser = () => {
    const [formData, setFormData] = useState({
        name: '',
        role: '', // Set default role value to an empty string
        email: '',
        phone_no: '',
        password: '',
    });
    const [roleList, setRoleList] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        getAllRole()
    }, [])

    async function getAllRole() {
        await allRoleList().then((res) => {
            console.log(res)
            setRoleList(res?.data?.data)
        }).catch((err) => [
            console.log(err)
        ])
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };





    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        await StaffCreateByAdmin(formData).then((res) => {
            console.log(res)
            navigate('/users')
        }).catch((err) => {
            console.log(err)
        })
    };

    return (
        <div className="newUser">
            <h1 className="newUserTitle">New User</h1>
            <form className="newUserForm" onSubmit={handleSubmit}>
                <div className="newUserItem">
                    <label>Username</label>
                    <input type="text" placeholder="Enter User Name" name='name' onChange={handleChange} />
                </div>
                {/* <div className="newUserItem">
                    <label>Full Name</label>
                    <input type="text" placeholder="John Smith" />
                </div> */}
                <div className="newUserItem">
                    <label>Email</label>
                    <input type="email" placeholder="Enter User Email" name='email' onChange={handleChange} />
                </div>
                <div className="newUserItem">
                    <label>Password</label>
                    <input type="password" placeholder="Enter User Password" name='password' onChange={handleChange} />
                </div>
                <div className="newUserItem">
                    <label>Phone</label>
                    <input type="phone" placeholder="Enter Phone Number" name='phone_no' onChange={handleChange} />
                </div>
                {/* <div className="newUserItem">
                    <label>Address</label>
                    <input type="text" placeholder="New York | USA" />
                </div> */}
                {/* <div className="newUserItem">
                    <label>Role</label>
                    <div className="newUserGender">
                        <input type="radio" name="gender" id="male" value="male" />
                        <label for="male">Male</label>
                        <input type="radio" name="gender" id="female" value="female" />
                        <label for="female">Female</label>
                        <input type="radio" name="gender" id="other" value="other" />
                        <label for="other">Other</label>
                    </div>
                </div> */}
                <div className="newUserItem">
                    <label>Role</label>
                    <select
                        className="newUserSelect"
                        name="role"
                        id="role"
                        onChange={handleChange}
                    >
                        <option value="" disabled selected>
                            Select User Role
                        </option>
                        {roleList?.length > 0 &&
                            roleList?.map((ele) => (
                                <option key={ele?._id} value={ele?._id}>
                                    {ele?.name}
                                </option>
                            ))}
                    </select>
                </div>
                <button className="newUserButton">Create</button>
            </form>
        </div>

    );
};

export default AddUser;
