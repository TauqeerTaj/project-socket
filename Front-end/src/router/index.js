import React from 'react'
import {Routes, Route, useNavigate} from "react-router-dom";
import Signup from '../components/form/signup';
import Signin from '../components/form/signin';
import Dashboard from '../components/dashboard';

function Routing() {
    const navigate = useNavigate()
    let token = localStorage.getItem('token')
    React.useEffect(()=>{
        if(!token){
            navigate('/')
        }
    },[])
    return (
        <Routes>
            <Route path='/' element={<Signin/>}></Route>
            <Route path='/signup' element={<Signup/>}></Route>
            {token && <Route path='/dashboard' element={<Dashboard/>}></Route>}
        </Routes>
    )
}

export default Routing
