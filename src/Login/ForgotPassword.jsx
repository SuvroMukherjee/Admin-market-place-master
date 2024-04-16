
import React, { useState } from 'react';
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminLogin, EmailSendForgot, SellerLogin } from '../API/api';
import useAuth from '../hooks/useAuth';
import './loginpage.css';
import toast, { Toaster } from 'react-hot-toast';
import { getLocation } from '../Pages/KeyManager/Dashboard/Attendence';
import ReCAPTCHA from 'react-google-recaptcha';
import loginbackground from '../assets/wave6.png'
import key from '../assets/key.png'
import OTPInput from 'react-otp-input';
import OtpInput from 'react-otp-input';



const ForgotPassword = () => {
    const { setAuth } = useAuth()

    const [userEmail,setUserEmail] = useState();
    const [show,setShow] = useState(false);
    const [otp, setOtp] = useState('');

    const SendEmailHandler = async(e) =>{
       
        e.preventDefault();

        let payload = {
            email : userEmail
        }

        console.log({payload})

        setShow(true)

        // let res = await EmailSendForgot();

        // if(res?.response.data.error){
        //     toast.error(res?.response?.data?.error)
        // }else{
        //     toast.success('Otp has been send to your email ${userEmail}')
        //     setShow(true)
        // }

    }


    const OtpHnadlerFunc = async(e) =>{

        e.preventDefault();

        let payload = {
            otp: otp
        }

        console.log({payload})

    }




    return (
        <div
            className="sign-in__wrapper"

        >
            <div class="login-page-background">
                <img src={loginbackground} alt="" />
            </div>
            {!show ? 
                <Form className="shadow loginForm" onSubmit={SendEmailHandler}>
                    <img src={key} alt="" />
                   

                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Enter Your Email</Form.Label>
                        <Form.Control
                            type="text"
                            value={userEmail}
                            placeholder="Enter your email"
                            onChange={(e) => setUserEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button className="w-100 mt-2" variant="primary" type="submit" disabled={!userEmail}>
                        Send
                    </Button>

                </Form>

                :
                

                <Form className="shadow loginForm" onSubmit={OtpHnadlerFunc}>
                    <img src={key} alt="" />


                    <Form.Group className="mb-3" controlId="otp">
                        <Form.Label>Enter OTP</Form.Label>
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderSeparator={<span>-</span>}
                            renderInput={(props) => <input {...props} />}
                            containerStyle="otp-input-container" // Add your custom style class
                            inputStyle="otp-input" // Add your custom style class
                        />
                    </Form.Group>

                    <Button className="w-100 mt-2" variant="primary" type="submit" disabled={!otp}>
                        Verify
                    </Button>
                </Form>

             }
           
            <Toaster position="top-right" />
            {/* Footer */}
            <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-center">
                Zoofi | &copy;2023
            </div>
        </div>
    );
};

export default ForgotPassword;
