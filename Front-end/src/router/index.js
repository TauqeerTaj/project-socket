import React from 'react'
import {Routes, Route} from "react-router-dom";
import Signup from '../components/form/signup';
import Signin from '../components/form/signin';
import Dashboard from '../components/dashboard';

function Routing() {
    return (
        <Routes>
            <Route path='/' element={<Signin/>}></Route>
            <Route path='/signup' element={<Signup/>}></Route>
            <Route path='/dashboard' element={<Dashboard/>}></Route>
        </Routes>
    )
}

export default Routing
