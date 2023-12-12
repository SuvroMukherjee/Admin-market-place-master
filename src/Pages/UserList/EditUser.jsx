import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { StaffCreateByAdmin, StaffDetails, StaffUpdatedDetails, allRoleList } from '../../API/api';


const EditUser = () => {
    const [formData, setFormData] = useState();
    const [roleList, setRoleList] = useState([])

    const { id: staffId } = useParams();

    useEffect(() => {
        getStaffDetails()
        getAllRole()
    }, [])

    async function getStaffDetails() {
        await StaffDetails(staffId).then((res) => {
            setFormData(res?.data?.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    const navigate = useNavigate()

    async function getAllRole() {
        await allRoleList().then((res) => {
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
        await StaffUpdatedDetails(staffId, formData).then((res) => {
            navigate('/users');
        }).catch((err) => {
            console.log(err)
        })
    };

    return (
        <div className="newUser">
            <h1 className="newUserTitle">Update User</h1>
            <form className="newUserForm" onSubmit={handleSubmit}>
                <div className="newUserItem">
                    <label>Username</label>
                    <input type="text" placeholder="Enter User Name" name='name' value={formData?.name} onChange={handleChange} />
                </div>
                <div className="newUserItem">
                    <label>Email</label>
                    <input type="email" placeholder="Enter User Email" name='email' value={formData?.email} onChange={handleChange} />
                </div>
                <div className="newUserItem">
                    <label>Phone</label>
                    <input type="phone" placeholder="Enter Phone Number" name='phone_no' value={formData?.phone_no} onChange={handleChange} />
                </div>
                <div className="newUserItem">
                    <label>Role</label>
                    <select
                        className="newUserSelect"
                        name="role"
                        id="role"
                        value={formData?.role}
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
                <button className="newUserButton">Update</button>
            </form>
        </div>

    );
};

export default EditUser;
