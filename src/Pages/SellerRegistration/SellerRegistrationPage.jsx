import React, { useState } from 'react';
import PersonalDetails from './PersonalDetails';
// import PersonalDetails from './PersonalDetails';
// import CourseDetails from './CourseDetails';
// import Summary from './Summary';
import './registration.css'

// Sample data
const coursesData = [
    {
        id: 1,
        courseName: 'HTML',
        category: 'Front-end'
    },
    // Other course data...
];

const levelsData = ['Beginner', 'Intermediate', 'Advanced'];

const Form = () => {
    const [step, setStep] = useState(1);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [courses, setCourses] = useState([]);
    const [level, setLevel] = useState('');
    const [isErrorFirstName, setIsErrorFirstName] = useState(true);
    const [isErrorLastName, setIsErrorLastName] = useState(true);
    const [errorMessageFirstName, setErrorMessageFirstName] = useState('');
    const [errorMessageLastName, setErrorMessageLastName] = useState('');
    const [formData, setFormData] = useState({});

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    console.log({formData})

    // const handleChange = input => e => {
    //     const { name, value } = e.target;
    //     setFormData({ ...formData, [name]: value });
    //     // if (input === 'firstname') {
    //     //     setFirstname(value);
    //     //     setIsErrorFirstName(value.length < 2);
    //     // } else if (input === 'lastname') {
    //     //     setLastname(value);
    //     //     setIsErrorLastName(value.length < 2);
    //     // }
    // };

    const handleChange = (e) => {
        const { name, value } = e?.target;
        setFormData({ ...formData, [name]: value });
    };

    const addLevel = e => {
        setLevel(e.target.value);
    };

    const addCourse = data => {
        const id = data.map(v => v.id);
        setCourses(id);
    };

    const validateFirstName = () => {
        setIsErrorFirstName(firstname.length < 2);
        if (firstname.length < 2) {
            setErrorMessageFirstName('Type your first name (at least 2 characters)');
            return false;
        }
        return true;
    };

    const validateLastName = () => {
        setIsErrorLastName(lastname.length < 2);
        if (lastname.length < 2) {
            setErrorMessageLastName('Type your last name (at least 2 characters)');
            return false;
        }
        return true;
    };

    const submitData = e => {
        e.preventDefault();
        alert('Data sent');
    };

    const coursesOptions = coursesData.map(el => ({
        course: el.courseName,
        id: el.id,
        category: el.category
    }));

    const coursesChosen = coursesData.filter(el => courses.includes(el.id));
    const coursesChosenSummary = coursesChosen.map(el => (
        <p key={el.id}>
            {el.courseName} - {el.category}
        </p>
    ));

    const chosenLevel = level;

    const levelOptions = levelsData.map((el, index) => (
        <option key={index} value={el}>
            {el}
        </option>
    ));

    switch (step) {
        case 1:
            return (
                <PersonalDetails
                    nextStep={nextStep}
                    handleChange={handleChange()}
                    formData={formData}
                    // firstname={firstname}
                    // lastname={lastname}
                    // email={email}
                    // phone={phone}
                    // validateFirstName={validateFirstName}
                    // validateLastName={validateLastName}
                    // isErrorFirstName={isErrorFirstName}
                    // isErrorLastName={isErrorLastName}
                    // errorMessageFirstName={errorMessageFirstName}
                    // errorMessageLastName={errorMessageLastName}
                />
            );
        // case 2:
        //     return (
        //         <CourseDetails
        //             nextStep={nextStep}
        //             prevStep={prevStep}
        //             addCourse={addCourse}
        //             coursesOptions={coursesOptions}
        //             addLevel={addLevel}
        //             levelOptions={levelOptions}
        //             level={level}
        //         />
        //     );
        // case 3:
        //     return (
        //         <Summary
        //             nextStep={nextStep}
        //             prevStep={prevStep}
        //             firstname={firstname}
        //             lastname={lastname}
        //             email={email}
        //             phone={phone}
        //             coursesChosenSummary={coursesChosenSummary}
        //             chosenLevel={chosenLevel}
        //             submitData={submitData}
        //         />
        //     );
        default:
            return null;
    }
};

export default Form;
