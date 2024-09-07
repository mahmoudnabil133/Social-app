import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
const Profile = ()=>{

    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();
    const getProfile = async ()=>{
        try{
            const token = localStorage.getItem('token');
            let response = await axios.get('http://localhost:3001/users/me',
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            response = response.data
            setProfile(response.data)

        }catch(err){
            alert('get profile failed')
        }
    }
    useEffect(()=>{
        getProfile()
    }, [])
    return (
        <div>
            <h1>Profile</h1>
            <h2>{profile && profile.userName}</h2>
            <h2>{profile && profile.email}</h2>
            <button onClick={()=>navigate('/')}>Edit Profile</button>
            {/* <button onClick={getProfile()}></button> */}
        </div>
    );
}
export default Profile;