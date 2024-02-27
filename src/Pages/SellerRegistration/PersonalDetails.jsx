import React from 'react';
import { Stepper } from 'react-form-stepper';
import { Form, Button } from 'react-bootstrap';
// import './App.css';

const PersonalDetails = ({
    formData,
    firstname,
    lastname,
    email,
    phone,
    handleChange,
    validateFirstName,
    validateLastName,
    isErrorFirstName,
    isErrorLastName,
    errorMessageFirstName,
    errorMessageLastName,
    nextStep
}) => {
    const continueClick = e => {
        e.preventDefault();
        nextStep();
        // const isFirstNameValid = validateFirstName();
        // const isLastNameValid = validateLastName();
        // if (isFirstNameValid && isLastNameValid) {
        //     nextStep();
        // }
    };

    return (
        <div className='form'>
            <Form>
                <Stepper
                    steps={[{ label: 'Personal details' }, { label: 'Course details' }, { label: 'Summary' }]}
                    activeStep={0}
                    styleConfig={{
                        activeBgColor: '#2b7cff',
                        activeTextColor: '#fff',
                        inactiveBgColor: '#fff',
                        inactiveTextColor: '#2b7cff',
                        completedBgColor: '#fff',
                        completedTextColor: '#2b7cff',
                        size: '3em'
                    }}
                    className={'stepper'}
                    stepClassName={'stepper__step'}
                />

                <Form.Group controlId='Full Name'>
                    <Form.Label>Full name</Form.Label>
                    <Form.Control type='text' value={formData?.name} name='name' onChange={handleChange}  />
                    {/* {isErrorFirstName && <Form.Text className='error'>{errorMessageFirstName}</Form.Text>} */}
                </Form.Group>

                <Form.Group controlId='lastname'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='email' value={formData?.email} onChange={handleChange} />
                    {/* {isErrorLastName && <Form.Text className='error'>{errorMessageLastName}</Form.Text>} */}
                </Form.Group>

                <Form.Group controlId='email'>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type='phone' value={formData?.phone} onChange={handleChange('email')} />
                </Form.Group>

                <Form.Group controlId='phone'>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type='text' value={phone} onChange={handleChange('phone')} />
                </Form.Group>

                <div style={{ textAlign: 'center' }}>
                    <Button variant='primary' onClick={continueClick}>Next</Button>
                </div>
            </Form>

                

            
        </div>
    );
};

export default PersonalDetails;
