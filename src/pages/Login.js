import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Login = () => {

    const navigate = useNavigate()
    const [err, setErr] = useState(false)
    const [loading, setLoading] = useState(false)
    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()


        const email = e.target[0].value;
        const password = e.target[1].value;
        console.log(email, password);

        try {
            await signInWithEmailAndPassword(auth, email, password)
            alert("login successfully")
            navigate('/addquiz')

        } catch (err) {
            setErr(true);
            console.log(err);
            setLoading(false);
        }
    };

    return (
        <div className='formContainer'>
            <div className="formWrapper">
                <span className="logo">User</span>
                <span className="title">Login</span>
                <form onSubmit={handleSubmit} >

                    <input type="email" placeholder='email' />
                    <input type="password" placeholder='password' />


                    <button >Sign in</button>
                    {err && <span>Somthing went wrong</span>}
                </form>
                <p>YO don't have an account ? <Link to='/register'>Register</Link></p>
            </div>

        </div>
    )
}

export default Login