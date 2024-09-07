import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
const Login = ()=>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = async (e)=>{
        console.log('login submitted')
        e.preventDefault();
        try{
            let response = await axios.post('http://localhost:3001/users/login', {email, password});
            // response.data => convert response to object
            response = response.data
            console.log(response.token)
            localStorage.setItem('token', response.token);
            alert('login sucsess')
            navigate('/')
        }catch(err){
            console.log(err)
            alert('login failed')
        }
    }
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin} >
                <input 
                type='email'
                placeholder='add your mail'
                onChange={e=> setEmail(e.target.value)}
                />
                <input 
                type='password'
                placeholder='add your pass'
                onChange={e => setPassword(e.target.value)}
                />
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}
export default Login;