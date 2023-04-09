import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const Login = ({ setLoginUser }) => {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        username: "",
        password: ""
    })

    const handleChange = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const login = () => {
        axios.post("http://localhost:3500/auth/login", user)
            .then(res => {
                alert(res.data.message)
                setLoginUser(res.data.user)
                navigate("/")
            }).catch(err => {
                alert('Login Failed!');
            })
    }

    return (
        <div className="login">
            <h1>Login</h1>
            <input type="text" name="username" value={user.username} onChange={handleChange} placeholder="Enter your username" />
            <input type="password" name="password" value={user.password} onChange={handleChange} placeholder="Enter your Password" />
            <div className="button" onClick={login}>Login</div>
            <div>or</div>
            <div className="button" onClick={() => navigate("/signup")}>Signup</div>
        </div>
    )
}

export default Login;