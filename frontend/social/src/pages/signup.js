import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
const SignUp = ()=>{
    const [userName, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPass] = useState("")
    const navigate = useNavigate();
    const handleLogin = async (e)=>{
        console.log('login submitted')
        e.preventDefault();
        try{
            let response = await axios.post('http://localhost:3001/users/signup', {userName, email, password, confirmPassword});
            response = response.data
            console.log(response.token)
            localStorage.setItem('token', response.token);
            alert('sign up sucsess')
            navigate('/')
        }catch(err){
            alert('sign up failed')
        }
    }
    return (
        <div>
            <h1>sign up</h1>
            <form onSubmit={handleLogin} >
                <input 
                type='text'
                placeholder='userName'
                onChange={e=> setName(e.target.value)}
                />
                
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
               <input 
                type='password'
                placeholder='add your confirmpass'
                onChange={e => setConfirmPass(e.target.value)}
                />
                <button type='submit'>sign up</button>
            </form>
        </div>
    )
}
export default SignUp;