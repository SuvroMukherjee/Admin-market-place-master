// App.js
import React, { useEffect, useState } from 'react';

// import Step2 from './components/Step2';
// import Step3 from './components/Step3';
// import Step4 from './components/Step4';
// import Step5 from './components/Step5';
import { Stepper, Step } from 'react-form-stepper';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';

function SellerRegistrationPage() {
    const [step, setStep] = useState(4);
    const [userData,setUserData] = useState();

    const reg_userdata = JSON.parse(localStorage.getItem('seller-registration'))

    console.log({ reg_userdata })

    // useEffect(()=>{
       
    //     // if (!reg_userdata?.Shop_Details_Info){
    //     //     setStep(1)
    //     // } else if (!reg_userdata?.doc_details && reg_userdata?.Shop_Details_Info && reg_userdata?.password){
    //     //     setStep(2)
    //     // }
    //     if (reg_userdata?.password && !reg_userdata?.Shop_Details_Info){
    //         console.log('call')
    //         setStep(1)
    //     } else if (reg_userdata?.password && reg_userdata?.Shop_Details_Info ){
    //         setStep(2)
    //     }
    // },[])

    

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const getUserdata  = (data) =>{
        console.log(data)
        setUserData(data)
    }

  

    return (
        <div className="App">
            <Stepper activeStep={step}>
                <Step label="User Information" />
                <Step label="Shop Details" />
                <Step label="Step 3" />
                <Step label="Step 4" />
                <Step label="Step 5" />
            </Stepper>
            {step === 0 && <Step1 nextStep={nextStep} getUserdata={getUserdata}/>}
            {step === 1 && <Step2 nextStep={nextStep} prevStep={prevStep} reg_userdata={reg_userdata} getUserdata={getUserdata} />}
            {step === 2 && <Step3 nextStep={nextStep} prevStep={prevStep} reg_userdata={reg_userdata} getUserdata={getUserdata} />}
            {step === 3 && <Step4 nextStep={nextStep} prevStep={prevStep} reg_userdata={reg_userdata} getUserdata={getUserdata} />}
            {step === 4 && <Step5 prevStep={prevStep}  reg_userdata={reg_userdata} getUserdata={getUserdata} />}
        </div>
    );
}

export default SellerRegistrationPage;
