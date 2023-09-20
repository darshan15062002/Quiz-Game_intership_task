import React, { useState } from 'react'


import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, storage } from '../firebase'
import { Link, useNavigate } from "react-router-dom";
const Register = () => {
    const navigate = useNavigate();
    const [err, setErr] = useState(false)
    const [loading, setLoading] = useState(false)

    // const [isChecked, setIsChecked] = useState(false);

    // const handleCheckboxChange = (event) => {
    //   setIsChecked(event.target.checked);
    // };

    const handleSubmit = async (e) => {
        e.preventDefault()

        const name = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;



        try {
            //Create user
            const res = await createUserWithEmailAndPassword(auth, email, password);

            try {
                //create user on firestore
                await setDoc(doc(db, "users", res.user.uid), {
                    uid: res.user.uid,
                    displayName: name,

                    email,

                });



                navigate("/")

            } catch (err) {
                console.log(err, "1");
                setErr(true);
                setLoading(false);
            }


        } catch (err) {
            console.log(err, "2");
            setErr(true);
            setLoading(false);
        }
    };




    return (
        <div className='formContainer'>
            <div className="formWrapper">
                <span className="logo">Quiz</span>
                <span className="title">Register</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder='Name' />
                    <input type="email" placeholder='Email' />
                    <input type="password" placeholder='Password' />





                    <button>Sign Up</button>
                    {loading && "Loading..."}
                    {err && <span>Something went wrong !</span>}
                </form>
                <p>Do have an account ? <Link to='/'>Login</Link></p>
            </div>

        </div>
    )
}

export default Register
