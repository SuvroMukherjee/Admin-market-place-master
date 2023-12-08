import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const AddUser = () => {
    const [formData, setFormData] = useState({
        name: '',
        role: '', // Set default role value to an empty string
        email: '',
        phone_no: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can perform further actions with the form data here
        console.log(formData);
    };

    return (
        <div className='newUser'>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formRole">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                        aria-label="Select Role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="">Select Role</option>
                        <option value="656d7021298f781cbdd844c1">Role 1</option>
                        {/* Add more options as needed */}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhone">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="tel"
                        placeholder="Enter your phone number"
                        name="phone_no"
                        value={formData.phone_no}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
        
    );
};

export default AddUser;
